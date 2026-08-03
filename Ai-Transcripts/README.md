# AI Development Transcript Index

## Purpose

This folder documents how AI tools were used throughout the complete development of the COMS3011A Todo App. The numbered files are organised by development phase rather than by chat session, because work moved between ChatGPT web chats and Codex repository sessions.

The five numbered files are verbatim prompt/response transcripts, not narrative handovers. They preserve the original spelling, grammar, timestamps, explanations, code, command output, incorrect suggestions, corrections, and failed approaches. The only added text is structural metadata such as transcript titles, exchange numbers, source labels, and labels distinguishing Codex commentary from its final answer.

They include:

- the user's requirements and questions;
- recommendations made by the AI;
- decisions confirmed or changed by the user;
- commands and code changes;
- incorrect suggestions and later corrections;
- failed tests, failed CI attempts, and diagnostic dead ends;
- commits, pushes, and verification results.

They do not claim to reproduce hidden model reasoning. Codex system/developer instructions, hidden reasoning, tool calls, and raw tool outputs are excluded. Only the user-visible prompts and assistant messages are treated as conversation transcript content.

## Numbered development record

1. [Initial Next.js and Git setup](./01-initial-nextjs-and-git-setup.md)
2. [Database design and SQLite connection](./02-database-design-and-connection.md)
3. [Initial feature development](./03-initial-feature-development.md)
4. [Single-page UI redesign and follow-up UI work](./04-ui-redesign.md)
5. [Testing, CI, documentation, and setup troubleshooting](./05-testing-and-ci.md)

Tool and model attribution for the numbered transcripts and untouched raw exports is recorded in [AI Attribution](./AI-Attribution.md).

## Raw source exports

The following ChatGPT web exports supplied by the user are preserved without rewriting in the `raw files` folder:

- [ChatGPT-Next.js TypeScript Setup.md](<raw files/ChatGPT-Next.js TypeScript Setup.md>)
- [ChatGPT-COMS3011A Todo App Development.md](<raw files/ChatGPT-COMS3011A Todo App Development.md>)
- [ChatGPT-Project Handover Steps.md](<raw files/ChatGPT-Project Handover Steps.md>)

The later Codex session was recovered from the local session log and converted into the same visible prompt/response format:

- [Codex-Agent-Session.md](<raw files/Codex-Agent-Session.md>)

That export contains the first 70 recorded Codex turns for this repository, including the interrupted PDF-reading attempt. It stops before the request to commit and push the completed work, because that response was still in progress when the export was built.

## Exact source coverage

| Numbered transcript | Verbatim source exchanges |
|---|---|
| `01` | Next.js setup export, exchanges 1-21 |
| `02` | Next.js setup export, exchanges 22-48 |
| `03` | COMS3011A development export, exchanges 1-25 |
| `04` | Codex session turns 1-12 and 18-37 |
| `05` | Project handover/testing export, exchanges 1-11; Codex turns 13-17 and 38-70 |

Together, the numbered files contain every exchange from all three user-supplied raw exports and every recorded Codex turn through turn 70. Each exchange includes the complete prompt and complete visible response; long code responses are no longer summarized.

## Reproducible split

[`build-exact-transcripts.ps1`](./build-exact-transcripts.ps1) performs the mechanical split. It reads the three preserved ChatGPT exports and a Codex session JSONL path, checks the expected source exchange counts, writes the raw Codex export, and regenerates the five numbered files without paraphrasing message text.

## Commit timeline

| Commit | Development phase |
|---|---|
| `d936c33` | Initial Next.js TypeScript scaffold |
| `7b86380` | Initial task schema |
| `1beb1e6` | SQLite dependencies |
| `5fbf418` | SQLite connection and diagnostic route |
| `ce1c6fe` | Database design documentation |
| `10f4dfe` | Task models and database operations |
| `b73d68b` | Task creation and active list |
| `d34ecdc` | Task editing workflow |
| `06922f9` | Archiving and archived view |
| `b0da01d` | Sorting and overdue indicators |
| `487b3ee` | Automated behaviour tests |
| `3171575` | Project documentation and CI workflow |
| `6399ad2` through `8fc1b05` | Unsuccessful testing/CI repair attempts |
| `6eaeeb9` | Single-page task-workspace redesign |
| `808823f` | Partial CI Node-version correction |
| `86db49f` | Final passing Node 24 CI fix |
| `9e75935` | Per-list due-date sorting and transcript collection |
| `e2647c1` | Topic sorting and row-by-row card ordering |
| `9cd1ffd` | Inline status synchronization and consistent green styling |
| `f3334bc` | Exact AI transcripts and the three project guides |
| `b492050` | Simplified README and recorded clean-clone verification |
| `caf76c7` | Cross-platform setup and run instructions |
| `df03dcc` | Simplified software requirements |

AI Declaration: The preceding document was generated, reviewed and edited with the assistance of ChatGPT-Web[GPT-5.6 Sol (high)] and Codex[GPT-5.6 Sol (high)].
