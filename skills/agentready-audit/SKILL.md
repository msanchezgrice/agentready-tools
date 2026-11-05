---
name: agentready-audit
description: Audit a public website for AI-agent visibility, readability, operability, and safety using AgentReady, then implement and verify the fixes.
---

# AgentReady Audit

Use this skill when a user asks whether a public website is visible to AI agents (ChatGPT, Perplexity, AI Overviews), ready for browser/coding agents, or how to fix agent-readiness gaps.

## Preferred workflow (MCP)

If your environment supports MCP servers, connect directly and skip manual HTTP:

1. Add the server: `claude mcp add --transport http agentready https://www.agentready.me/api/mcp` (server card: https://www.agentready.me/.well-known/mcp.json).
2. Call `scan_url` with the site URL → report the 0–100 score and per-phase findings.
3. Reuse the `fixPack` already returned by `scan_url`. Call `get_fix_pack` only for a standalone fix-pack request or if the original response has no pack; it performs another scan. Resolve candidate targets against repository evidence, then implement authorized fixes highest severity first. Each v2 fix carries evidence, review gates, and fix-specific assertions; target paths are not exact until verified in the repository.
4. After deploying, call `verify_fixes` with the previous fix pack → report resolved/remaining ids and the score delta.

## Fallback workflow (HTTP)

1. Confirm the exact public URL with the user or infer it from the current task.
2. Send `POST https://www.agentready.me/api/v1/scan` with `Content-Type: application/json` and `{ "url": "https://example.com", "includePlaywright": true }`.
3. Report the overall score and each phase score separately. The response's `metadata.fixPack` contains the v2 implementation contract with stable ids, evidence, candidate targets, review gates, and fix-specific assertions.
4. Prioritize concrete fixes that improve both human accessibility and agent visibility/reliability.
5. Re-run the scan after changes deploy and compare `metadata.fixPack.fixes[].id` sets to show what resolved.

## Safety

- Scan only public URLs unless the user explicitly authorizes private access.
- Do not sign in, connect a repository, submit a form, or start payment without explicit user authorization.
- Never expose tokens, credentials, private repository content, or personal information.
- Treat the scan as best-effort diagnostics, not certification or a security guarantee.

## Canonical references

- Methodology: https://www.agentready.me/methodology
- MCP server card: https://www.agentready.me/.well-known/mcp.json
- OpenAPI: https://www.agentready.me/openapi.json
- Agent instructions: https://www.agentready.me/agents.md
