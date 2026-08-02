# AI Development Transcript Index

## Purpose

This folder documents how AI tools were used throughout the complete development of the COMS3011A Todo App. The numbered files are organised by development phase rather than by chat session, because work moved between ChatGPT web chats and Codex repository sessions.

The transcripts are deliberately transparent. They include:

- the user's requirements and questions;
- recommendations made by the AI;
- decisions confirmed or changed by the user;
- commands and code changes;
- incorrect suggestions and later corrections;
- failed tests, failed CI attempts, and diagnostic dead ends;
- commits, pushes, and verification results.

They do not claim to reproduce hidden model reasoning. They record visible prompts, visible responses, repository evidence, and tool output.

## Numbered development record

1. [Initial Next.js and Git setup](./01-initial-nextjs-and-git-setup.md)
2. [Database design and SQLite connection](./02-database-design-and-connection.md)
3. [Initial feature development](./03-initial-feature-development.md)
4. [Single-page UI redesign](./04-ui-redesign.md)
5. [Automated testing and CI repair](./05-testing-and-ci.md)

## Raw source exports

The following ChatGPT web exports are preserved without rewriting in the `raw files` folder so the original prompt/response sequences remain available:

- [ChatGPT-Next.js TypeScript Setup.md](<raw files/ChatGPT-Next.js TypeScript Setup.md>)
- [ChatGPT-COMS3011A Todo App Development.md](<raw files/ChatGPT-COMS3011A Todo App Development.md>)
- [ChatGPT-Project Handover Steps.md](<raw files/ChatGPT-Project Handover Steps.md>)

The numbered transcripts combine those exports with later Codex work. Where a transcript summarises a long code response, the corresponding raw export provides the original full response.

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
