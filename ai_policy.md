## COMS3011A AI Policy

## Brendan Griffiths

20 July 2026

The Artificial Intelligence policy for COMS3011A is in addition to the Wits AI policy which can be read in full detail here. When in conflict with this policy, you should default to the University policy and request clarification. We reserve the right to make clarifications and changes to this policy as needed throughout the semester, but under the expectation that you must comply after the date of change and they do not apply retroactively. Previous versions of the policy will remain available. [URL 🔗](https://www.wits.ac.za/ai-policies/)

The usage of AI tooling in COMS3011A is actively encouraged. You should be using some tool in some capacity for every aspect of the course. To this end, the expectation on you and the quality of work will be much higher than what might be expected without AI tools.

For transparency and developing your own usage, we will require that you be diligent about where you use AI and how you track it. academic integrity is an important priority for the course so you will need to document your usage of AI and correctly attribute it. When providing attribution, you need the following information:

- 1. What tool did you use: Claude Code, Codex, Qoder, ChatGPT Web, Claude Web, OpenClaw etc.

- 2. What model did you use: GPT-5.5, Claude Opus 4.8, Kimi K3 etc.

- 3. What you used it for: Generating code, editing your writing, review and discussion etc.

You will be held responsible for anything you submit. If an assisting AI hallucinates incorrect information, commits plagiarism, generates incoherent information or any similar activity, then you will be liable for the consequences. For group submissions, the entire group will be liable. A useful adage here may be “Trust, but verify”. Take the time to google a reference and make sure it exists, or read over a generated entity-relation diagram for any incoherence in hallucinated tables.

For more information, please read the below on AI in a specific context.

## Writing: Planning, Reviewing, Editing, and Generating

You may use AI for any of your writing. This includes reports, documentation, brainstorming, meetings etc.

Please be aware that AI tends to rely on specific writing patterns and does not always have the correct context to engage with a question at the required level. The subjective components of marking such as discussion or motivation may be impacted by an over-reliance of AI. You should take the time to avoid relying on the exact output of AI tooling and should rewrite it in your own voice as much as possible.

There are excellent resources available online that can assist you with this such as Wikipedia’s Signs of AI Writing. We will not actively penalise you for ‘AI Writing’. [URL 🔗](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)

If you use AI for your writing, you do not need to attribute every individual chunk you used it on. However, you must still include a note somewhere (for example: references or a footnote) in the document that states the following:


The preceding document was (reviewed / planned / edited / generated) with the assistance of the following: <tool>[<model>]

The specific formatting may change so long as the necessary information mentioned previously is visible.

If you used multiple different models and tools, you must include all of them.

The preceding document was (reviewed / planned / edited / generated) with the assistance of the following: <tool-one>[<model-one>], <tool-two>[<model-two>]

If you did not use AI, we will require that you actively make note of this in a similar way.

The preceding document was written without the assistance of AI.

Any document not featuring a usage or non-usage declaration will not be marked or considered as part of your final submission.

## Code

You may use AI for code generation.

When using AI for code generation you must include the necessary information previously mentioned as a commit.

// normal commit message specifying what was done

Assisted-by: <tool-one>[model-one], <tool-two>[model-two]

Example:

Assisted-by: Claude-Code[Claude Sonnet 5], ChatGPT-Web[GPT-5.5]

If you did not use AI for code gen of a specific, you do not need to declare it as part of the commit.

If at any point, you use a code generation tool, you must include this in the repository’s README. The use of AI auto-complete or in-line AI usage does not need to be declared every commit, but does require attribution in the README. The use of AI code review must be declared in the README. If unsure about a specific tool, contact the lecturer for clarification, but declare it in the README.

Non-usage for the specified tools must be indicated in the README, as of yet unidentified tools should be added after receiving clarification.

## Usage:

```
This repository makes use of AI code generation using the following tools: <code-gen-
tool-one>[<code-gen-model-one>], <code-gen-tool-two>[<code-gen-model-two>]. This repository makes use of AI in-line editing using the following tools: <inline-tool- one>[<inline-model-one>], <inline-tool-two>[<inline-model-two>]. This repository makes use of AI code-review using the following tools: <review-tool- one>[<review-model-one>], <review-tool-two>[<review-model-two>]
Non-Usage:
This repository does not use AI code generation.
This repository does not use AI in-line editing tools.
This repository does not use AI code review.
```

## Example:


This repository makes use of AI code generation using the following tools: Claude-

Code[Claude Sonnet 5]. This repository makes use of AI in-line editing using the following tools: VSCode- Copilot[GPT-5.5]. This repository does not use AI code review.

## Assessments

You may use AI during an assessment, unless stated otherwise.

You may be required to submit unedited transcripts of your usage during assessments as part of the assessment’s marking requirements. You must start a new session for each assessment. If your tool of choice does not have an export function for transcripts, you will be expected to provide a substitute such as the saved files of the tool.

The context of code-generation or document writing still requires the correct attribution even if in an assessment environment.

AI Declaration: The preceding document was reviewed and edited with: Claude-Web[Claude Opus 4.8]
