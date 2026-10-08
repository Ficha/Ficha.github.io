# Nonconformity log

Process errors that reached a file, a task or a deliverable. Newest on top. The rule goes in the general `CLAUDE.md`: "Every error that reaches a file, a task or a deliverable gets logged in this log".

Format: `date · project · what happened · cause · fix · what changes so it doesn't repeat · status` (open / closed).

## Open
- [YYYY-MM-DD] · [project] · [what happened] · cause: [why] · fix: [what was done] · prevention: [which rule or check changes] · open

## Closed
- Example · migration · A batch script kept going after failing on a step · cause: the error handling didn't break out inside the loop · fix: each folder was checked by hand · prevention: batches that move or write files run one at a time, or with an error check at every step · closed
