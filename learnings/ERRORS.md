# ERRORS.md - Recurring Error Patterns

## Pattern Library

### Sandbox Write Constraints
- **First seen:** 2026-02-28
- **Pattern:** Write operations using absolute `/workspace/...` paths fail with "Path escapes workspace root" error
- **Solution:** Use relative paths instead (e.g., `learnings/file.md` not `/workspace/learnings/file.md`)
- **Prevention:** Always use relative paths for workspace file operations
- **Status:** Resolved

### Tool Output Error Scanning
_(This section will be populated by post-tool-use hooks that scan for error patterns)_

## Error Categories

### File Operations
- Sandbox path issues (see above)

### Tool Execution
_(Patterns will be added as they're discovered)_

### API Failures
_(Patterns will be added as they're discovered)_

### Messaging Platform Issues
_(Patterns will be added as they're discovered)_

---

**Usage:** Add new error patterns as discovered. Include: pattern description, first occurrence date, solution, prevention strategy, and current status.
