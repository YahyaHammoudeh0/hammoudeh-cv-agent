# RLM Guard Hook (project README)
Source: /Users/yahya/Documents/rlm-guard-hook/README.md

# RLM Guard Hook for Claude Code

A Claude Code hook that enforces RLM (Recursive Language Model) patterns for handling large contexts. Based on MIT CSAIL research (arXiv:2512.24601), this hook prevents context rot by automatically chunking large file reads.

## What It Does

The RLM Guard intercepts `Read` tool calls and:
- Files > 256KB: Blocks the read (exceeds Claude's limit) and suggests Bash alternatives
- Files 100-256KB: Auto-chunks to 500 lines with offset tracking
- Files < 100KB: Passes through normally

## Quick Install

```bash
./install.sh
```

Or manually:
```bash
mkdir -p ~/.claude/hooks
cp hooks/rlm-guard.py ~/.claude/hooks/
mkdir -p ~/.claude/agents && cp agents/rlm-processor.md ~/.claude/agents/
mkdir -p ~/.claude/skills/rlm-context-management
cp skills/rlm-context-management/SKILL.md ~/.claude/skills/rlm-context-management/
./hooks/rlm-enable.sh
```

## Configuration

Environment variables:
- `RLM_GUARD_DISABLED` (default 0) - Set to 1 to disable the hook
- `RLM_FILE_SIZE_LIMIT` (default 100000) - Soft limit in bytes (triggers auto-chunking)
- `RLM_CHUNK_LINES` (default 500) - Lines per chunk when auto-chunking

## Components

- Hook (`hooks/rlm-guard.py`): The core PreToolUse hook that intercepts Read operations.
- Agent (`agents/rlm-processor.md`): An Opus-powered agent for complex RLM tasks.
- Skill (`skills/rlm-context-management/SKILL.md`): Detailed methodology for applying RLM patterns manually. Invoke with `/rlm-context-management`.

## How RLM Works

Traditional LLM: `LLM(entire_large_file) -> context rot, forgetting, inconsistency`.
RLM: `LLM(probe_structure) -> LLM(chunk_1) -> LLM(chunk_2) -> aggregate`.

Key principles:
1. Probe before processing - understand structure before reading content
2. Chunk by structure - semantic units (functions, classes, sections)
3. Fresh context per chunk - subagents prevent context accumulation
4. Aggregate results - combine findings coherently

## License

MIT. Credits: Based on "RLM: Recursive Language Models" research from MIT CSAIL (arXiv:2512.24601).
