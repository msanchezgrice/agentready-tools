# @agentready/cli

Dependency-free command-line client for **AgentReady.me — agent journey audits and verified fixes**. The package calls only AgentReady&apos;s current public, unauthenticated scan and opted-in report surfaces. npm registry publication is still pending.

## Try from this repository

```sh
node packages/cli/bin/agentready.mjs scan example.com
node packages/cli/bin/agentready.mjs scan example.com --json --no-browser
node packages/cli/bin/agentready.mjs scan example.com --publish-report
node packages/cli/bin/agentready.mjs report opaque-report-id --json
```

After npm publication, the intended interface is:

```sh
npx @agentready/cli scan example.com
npx @agentready/cli scan example.com --json --no-browser
```

## Privacy and authority boundary

`scan` calls `POST /api/v1/scan`; `--no-browser` sets `includePlaywright: false`. Scans remain private to the caller unless `--publish-report` explicitly creates an unlisted report. `report` calls `GET /api/v1/report?id=...`. Add `--json` for machine-readable output. Set `AGENTREADY_BASE_URL` to point at a self-hosted or preview deployment.

Published reports contain public scan evidence, expire after 30 days, and retain at most 12 observations. These endpoints do not grant access to private projects, repository credentials, billing, or delegated write actions. Future protected resources may add narrowly scoped authorization.

## Use the hosted MCP server instead

Agents that support Streamable HTTP can connect directly to:

```text
https://www.agentready.me/api/mcp
```

Claude Code setup:

```sh
claude mcp add --transport http agentready https://www.agentready.me/api/mcp
```

The public MCP tools are `scan_url`, `get_fix_pack`, `verify_fixes`, and `get_public_report`. The normal loop is scan → select fixes → implement with repository-specific review → deploy → verify the same stable finding IDs.

## Publication status

The narrow public companion repository is [msanchezgrice/agentready-tools](https://github.com/msanchezgrice/agentready-tools). It contains only this public CLI and the AgentReady audit skill; the private application, account, analytics, and billing code are excluded. npm registry publication is still pending verified `@agentready` scope access.
