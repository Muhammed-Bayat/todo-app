param(
  [Parameter(Mandatory = $true)]
  [string]$CodexSessionPath,

  [string[]]$AdditionalCodexSessionPath = @()
)

$ErrorActionPreference = "Stop"

$transcriptDirectory = $PSScriptRoot
$rawDirectory = Join-Path $transcriptDirectory "raw files"
$utf8WithoutBom = New-Object System.Text.UTF8Encoding($false)

function Read-Utf8File([string]$Path) {
  return [IO.File]::ReadAllText($Path, $utf8WithoutBom)
}

function Write-Utf8File(
  [string]$Path,
  [string]$Content
) {
  [IO.File]::WriteAllText($Path, $Content, $utf8WithoutBom)
}

function Get-WebExchanges([string]$Path) {
  $content = Read-Utf8File $Path
  $pattern = "(?ms)^## Prompt:\s*\r?\n(.*?)^## Response:\s*\r?\n(.*?)(?=^## Prompt:\s*$|\z)"
  $matches = [regex]::Matches($content, $pattern)
  $exchanges = @()
  $number = 0

  foreach ($match in $matches) {
    $number++
    $exchanges += [PSCustomObject]@{
      Number = $number
      Prompt = $match.Groups[1].Value.Trim([char[]]"`r`n")
      Response = $match.Groups[2].Value.Trim([char[]]"`r`n")
    }
  }

  return $exchanges
}

function Get-CodexTurns([string]$Path) {
  $turns = @()
  $currentTurn = $null
  $usesLegacyEvents = Select-String `
    -LiteralPath $Path `
    -SimpleMatch '"type":"user_message"' `
    -Quiet

  foreach ($line in Get-Content -LiteralPath $Path -Encoding UTF8) {
    try {
      $item = $line | ConvertFrom-Json
    } catch {
      continue
    }

    if (
      $item.type -eq "event_msg" -and
      $item.payload.type -eq "user_message"
    ) {
      if ($null -ne $currentTurn) {
        $turns += $currentTurn
      }

      $currentTurn = [PSCustomObject]@{
        Number = $turns.Count + 1
        Prompt = [string]$item.payload.message
        Messages = New-Object System.Collections.ArrayList
      }
      continue
    }

    if (
      $null -ne $currentTurn -and
      $item.type -eq "event_msg" -and
      $item.payload.type -eq "agent_message"
    ) {
      [void]$currentTurn.Messages.Add([PSCustomObject]@{
        Phase = [string]$item.payload.phase
        Text = [string]$item.payload.message
      })
      continue
    }

    if (
      -not $usesLegacyEvents -and
      $item.type -eq "response_item" -and
      $item.payload.type -eq "message" -and
      $item.payload.role -eq "user"
    ) {
      $prompt = [string](
        $item.payload.content |
          Where-Object { $_.type -eq "input_text" } |
          Select-Object -First 1 -ExpandProperty text
      )

      if ($prompt.StartsWith("<environment_context>")) {
        continue
      }

      if ($null -ne $currentTurn) {
        $turns += $currentTurn
      }

      $currentTurn = [PSCustomObject]@{
        Number = $turns.Count + 1
        Prompt = $prompt
        Messages = New-Object System.Collections.ArrayList
      }
      continue
    }

    if (
      $null -ne $currentTurn -and
      -not $usesLegacyEvents -and
      $item.type -eq "response_item" -and
      $item.payload.type -eq "message" -and
      $item.payload.role -eq "assistant"
    ) {
      $messageText = [string](
        $item.payload.content |
          Where-Object { $_.type -eq "output_text" } |
          Select-Object -First 1 -ExpandProperty text
      )

      [void]$currentTurn.Messages.Add([PSCustomObject]@{
        Phase = [string]$item.payload.phase
        Text = $messageText
      })
    }
  }

  if ($null -ne $currentTurn) {
    $turns += $currentTurn
  }

  return $turns
}

function Add-WebExchange(
  [Text.StringBuilder]$Builder,
  [string]$SourceName,
  [object]$Exchange,
  [int]$DisplayNumber
) {
  [void]$Builder.AppendLine("## Exchange $DisplayNumber")
  [void]$Builder.AppendLine()
  [void]$Builder.AppendLine("Source: ``raw files/$SourceName`` - original exchange $($Exchange.Number).")
  [void]$Builder.AppendLine()
  [void]$Builder.AppendLine("### User prompt")
  [void]$Builder.AppendLine()
  [void]$Builder.AppendLine($Exchange.Prompt)
  [void]$Builder.AppendLine()
  [void]$Builder.AppendLine("### Assistant response")
  [void]$Builder.AppendLine()
  [void]$Builder.AppendLine($Exchange.Response)
  [void]$Builder.AppendLine()
}

function Add-CodexTurn(
  [Text.StringBuilder]$Builder,
  [object]$Turn,
  [int]$DisplayNumber
) {
  [void]$Builder.AppendLine("## Exchange $DisplayNumber")
  [void]$Builder.AppendLine()
  [void]$Builder.AppendLine("Source: ``raw files/Codex-Agent-Session.md`` - original turn $($Turn.Number).")
  [void]$Builder.AppendLine()
  [void]$Builder.AppendLine("### User prompt")
  [void]$Builder.AppendLine()
  [void]$Builder.AppendLine($Turn.Prompt)
  [void]$Builder.AppendLine()
  [void]$Builder.AppendLine("### Assistant response")
  [void]$Builder.AppendLine()

  foreach ($message in $Turn.Messages) {
    $label = if ($message.Phase -eq "final_answer") {
      "Final answer"
    } else {
      "Commentary"
    }

    [void]$Builder.AppendLine("#### $label")
    [void]$Builder.AppendLine()
    [void]$Builder.AppendLine($message.Text)
    [void]$Builder.AppendLine()
  }
}

function New-Transcript(
  [string]$Title,
  [string]$SourceDescription
) {
  $builder = New-Object Text.StringBuilder
  [void]$builder.AppendLine("# $Title")
  [void]$builder.AppendLine()
  [void]$builder.AppendLine("This is a verbatim transcript. Prompt and response text is copied directly from the named raw source; spelling, grammar, timestamps, code, command output, and corrections are preserved. Added headings and source labels are editorial metadata only.")
  [void]$builder.AppendLine()
  [void]$builder.AppendLine("$SourceDescription")
  [void]$builder.AppendLine()
  return $builder
}

function Add-AiDeclaration([Text.StringBuilder]$Builder) {
  [void]$Builder.AppendLine("AI Declaration: The preceding document was generated and organised with the assistance of ChatGPT-Web[GPT-5.6 Sol (high)] and Codex[GPT-5.6 Sol (high)].")
  [void]$Builder.AppendLine()
}

function Write-CodexRawExport(
  [object[]]$Turns,
  [int]$CompletedTurnCount
) {
  $builder = New-Object Text.StringBuilder
  [void]$builder.AppendLine("# Codex Agent Session")
  [void]$builder.AppendLine()
  [void]$builder.AppendLine("This file is a verbatim export of user-visible messages recovered from the local Codex session log for this repository. Hidden reasoning, system/developer instructions, tool calls, and tool outputs are excluded. Commentary and final-answer labels describe the original visible message phase; they are not part of the message text.")
  [void]$builder.AppendLine()
  [void]$builder.AppendLine("The export stops after recorded turn $CompletedTurnCount. The request that generated this export is not included because its response was still in progress when the files were generated.")
  [void]$builder.AppendLine()

  for ($index = 0; $index -lt $CompletedTurnCount; $index++) {
    $turn = $Turns[$index]
    [void]$builder.AppendLine("## Turn $($turn.Number)")
    [void]$builder.AppendLine()
    [void]$builder.AppendLine("### User prompt")
    [void]$builder.AppendLine()
    [void]$builder.AppendLine($turn.Prompt)
    [void]$builder.AppendLine()
    [void]$builder.AppendLine("### Assistant response")
    [void]$builder.AppendLine()

    foreach ($message in $turn.Messages) {
      $label = if ($message.Phase -eq "final_answer") {
        "Final answer"
      } else {
        "Commentary"
      }

      [void]$builder.AppendLine("#### $label")
      [void]$builder.AppendLine()
      [void]$builder.AppendLine($message.Text)
      [void]$builder.AppendLine()
    }
  }

  Write-Utf8File `
    (Join-Path $rawDirectory "Codex-Agent-Session.md") `
    $builder.ToString()
}

$nextSourceName = "ChatGPT-Next.js TypeScript Setup.md"
$developmentSourceName = "ChatGPT-COMS3011A Todo App Development.md"
$testingSourceName = "ChatGPT-Project Handover Steps.md"

$nextExchanges = Get-WebExchanges (Join-Path $rawDirectory $nextSourceName)
$developmentExchanges = Get-WebExchanges (Join-Path $rawDirectory $developmentSourceName)
$testingExchanges = Get-WebExchanges (Join-Path $rawDirectory $testingSourceName)
$codexTurns = @(Get-CodexTurns $CodexSessionPath)

foreach ($additionalPath in $AdditionalCodexSessionPath) {
  $codexTurns += @(Get-CodexTurns $additionalPath)
}

for ($index = 0; $index -lt $codexTurns.Count; $index++) {
  $codexTurns[$index].Number = $index + 1
}

$completedCodexTurnCount = 75

if ($nextExchanges.Count -ne 48) {
  throw "Expected 48 exchanges in $nextSourceName; found $($nextExchanges.Count)."
}

if ($developmentExchanges.Count -ne 25) {
  throw "Expected 25 exchanges in $developmentSourceName; found $($developmentExchanges.Count)."
}

if ($testingExchanges.Count -ne 11) {
  throw "Expected 11 exchanges in $testingSourceName; found $($testingExchanges.Count)."
}

if ($codexTurns.Count -lt $completedCodexTurnCount) {
  throw "Expected at least $completedCodexTurnCount Codex turns; found $($codexTurns.Count)."
}

Write-CodexRawExport $codexTurns $completedCodexTurnCount

$transcript01 = New-Transcript `
  "AI Usage Transcript 01: Initial Next.js, Git, and GitHub Setup" `
  "Source coverage: all setup exchanges before SQLite work in ``raw files/$nextSourceName`` (original exchanges 1-21)."
$displayNumber = 0
foreach ($exchange in $nextExchanges[0..20]) {
  $displayNumber++
  Add-WebExchange $transcript01 $nextSourceName $exchange $displayNumber
}
Add-AiDeclaration $transcript01
Write-Utf8File `
  (Join-Path $transcriptDirectory "01-initial-nextjs-and-git-setup.md") `
  $transcript01.ToString()

$transcript02 = New-Transcript `
  "AI Usage Transcript 02: Database Design, SQLite, and Connection Setup" `
  "Source coverage: all SQLite, schema, connection, database-check, documentation, and development-handover exchanges in ``raw files/$nextSourceName`` (original exchanges 22-48)."
$displayNumber = 0
foreach ($exchange in $nextExchanges[21..47]) {
  $displayNumber++
  Add-WebExchange $transcript02 $nextSourceName $exchange $displayNumber
}
Add-AiDeclaration $transcript02
Write-Utf8File `
  (Join-Path $transcriptDirectory "02-database-design-and-connection.md") `
  $transcript02.ToString()

$transcript03 = New-Transcript `
  "AI Usage Transcript 03: Initial Task Feature Development" `
  "Source coverage: all exchanges in ``raw files/$developmentSourceName`` (original exchanges 1-25)."
$displayNumber = 0
foreach ($exchange in $developmentExchanges) {
  $displayNumber++
  Add-WebExchange $transcript03 $developmentSourceName $exchange $displayNumber
}
Add-AiDeclaration $transcript03
Write-Utf8File `
  (Join-Path $transcriptDirectory "03-initial-feature-development.md") `
  $transcript03.ToString()

$transcript04 = New-Transcript `
  "AI Usage Transcript 04: Single-Page UI Redesign and Follow-up UI Work" `
  "Source coverage: completed Codex turns 1-12 and 18-37 from ``raw files/Codex-Agent-Session.md``. These cover repository inspection, the UI redesign, demo data, builds and server control, sorting enhancements, layout correction, status synchronization, styling, commits, and pushes."
$displayNumber = 0
$uiTurnIndexes = @(0..11) + @(17..36)
foreach ($index in $uiTurnIndexes) {
  $displayNumber++
  Add-CodexTurn $transcript04 $codexTurns[$index] $displayNumber
}
Add-AiDeclaration $transcript04
Write-Utf8File `
  (Join-Path $transcriptDirectory "04-ui-redesign.md") `
  $transcript04.ToString()

$transcript05 = New-Transcript `
  "AI Usage Transcript 05: Testing, CI, Documentation, and Setup Troubleshooting" `
  "Source coverage: all exchanges in ``raw files/$testingSourceName`` (original exchanges 1-11), followed by Codex turns 13-17 and 38-75 from ``raw files/Codex-Agent-Session.md``."
$displayNumber = 0
foreach ($exchange in $testingExchanges) {
  $displayNumber++
  Add-WebExchange $transcript05 $testingSourceName $exchange $displayNumber
}
$testingTurnIndexes = @(12..16) + @(37..74)
foreach ($index in $testingTurnIndexes) {
  $displayNumber++
  Add-CodexTurn $transcript05 $codexTurns[$index] $displayNumber
}
Add-AiDeclaration $transcript05
Write-Utf8File `
  (Join-Path $transcriptDirectory "05-testing-and-ci.md") `
  $transcript05.ToString()

function Assert-ContainsExactText(
  [string]$Content,
  [string]$Expected,
  [string]$Description
) {
  if (-not $Content.Contains($Expected)) {
    throw "Generated transcript is missing exact text for $Description."
  }
}

function Assert-ExchangeCount(
  [string]$Content,
  [int]$Expected,
  [string]$Description
) {
  $actual = [regex]::Matches(
    $Content,
    "(?m)^## Exchange [0-9]+\r?$"
  ).Count

  if ($actual -ne $Expected) {
    throw "Expected $Expected exchanges in $Description; found $actual."
  }
}

$content01 = Read-Utf8File (
  Join-Path $transcriptDirectory "01-initial-nextjs-and-git-setup.md"
)
$content02 = Read-Utf8File (
  Join-Path $transcriptDirectory "02-database-design-and-connection.md"
)
$content03 = Read-Utf8File (
  Join-Path $transcriptDirectory "03-initial-feature-development.md"
)
$content04 = Read-Utf8File (
  Join-Path $transcriptDirectory "04-ui-redesign.md"
)
$content05 = Read-Utf8File (
  Join-Path $transcriptDirectory "05-testing-and-ci.md"
)
$codexRawContent = Read-Utf8File (
  Join-Path $rawDirectory "Codex-Agent-Session.md"
)

Assert-ExchangeCount $content01 21 "transcript 01"
Assert-ExchangeCount $content02 27 "transcript 02"
Assert-ExchangeCount $content03 25 "transcript 03"
Assert-ExchangeCount $content04 32 "transcript 04"
Assert-ExchangeCount $content05 54 "transcript 05"

foreach ($exchange in $nextExchanges[0..20]) {
  Assert-ContainsExactText $content01 $exchange.Prompt "transcript 01 prompt $($exchange.Number)"
  Assert-ContainsExactText $content01 $exchange.Response "transcript 01 response $($exchange.Number)"
}

foreach ($exchange in $nextExchanges[21..47]) {
  Assert-ContainsExactText $content02 $exchange.Prompt "transcript 02 prompt $($exchange.Number)"
  Assert-ContainsExactText $content02 $exchange.Response "transcript 02 response $($exchange.Number)"
}

foreach ($exchange in $developmentExchanges) {
  Assert-ContainsExactText $content03 $exchange.Prompt "transcript 03 prompt $($exchange.Number)"
  Assert-ContainsExactText $content03 $exchange.Response "transcript 03 response $($exchange.Number)"
}

foreach ($exchange in $testingExchanges) {
  Assert-ContainsExactText $content05 $exchange.Prompt "transcript 05 web prompt $($exchange.Number)"
  Assert-ContainsExactText $content05 $exchange.Response "transcript 05 web response $($exchange.Number)"
}

for ($index = 0; $index -lt $completedCodexTurnCount; $index++) {
  $turn = $codexTurns[$index]
  Assert-ContainsExactText $codexRawContent $turn.Prompt "Codex raw prompt $($turn.Number)"

  foreach ($message in $turn.Messages) {
    Assert-ContainsExactText $codexRawContent $message.Text "Codex raw response $($turn.Number)"
  }
}

foreach ($index in $uiTurnIndexes) {
  $turn = $codexTurns[$index]
  Assert-ContainsExactText $content04 $turn.Prompt "transcript 04 prompt $($turn.Number)"

  foreach ($message in $turn.Messages) {
    Assert-ContainsExactText $content04 $message.Text "transcript 04 response $($turn.Number)"
  }
}

foreach ($index in $testingTurnIndexes) {
  $turn = $codexTurns[$index]
  Assert-ContainsExactText $content05 $turn.Prompt "transcript 05 Codex prompt $($turn.Number)"

  foreach ($message in $turn.Messages) {
    Assert-ContainsExactText $content05 $message.Text "transcript 05 Codex response $($turn.Number)"
  }
}

Write-Output "Exact transcripts generated and source-validated successfully."
