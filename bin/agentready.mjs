#!/usr/bin/env node

const baseUrl = (process.env.AGENTREADY_BASE_URL || 'https://www.agentready.me').replace(/\/+$/, '')
const args = process.argv.slice(2)
const command = args.shift()
const json = args.includes('--json')
const noBrowser = args.includes('--no-browser')
const publishReport = args.includes('--publish-report')
const url = args.find((arg) => !arg.startsWith('--'))

function usage() {
  console.log('AgentReady.me — agent journey audits and verified fixes')
  console.log('')
  console.error('Usage: agentready scan <url> [--json] [--no-browser] [--publish-report]')
  console.error('       agentready report <report-id> [--json]')
  console.error('')
  console.error('Scans stay private unless --publish-report is explicitly supplied.')
}

if (command === '--help' || command === '-h' || command === 'help') {
  usage()
} else if (command === '--version' || command === '-v') {
  console.log('0.1.0')
} else if (!['scan', 'report'].includes(command) || !url) {
  usage()
  process.exitCode = 2
} else {
  const endpoint = command === 'scan'
    ? `${baseUrl}/api/v1/scan`
    : `${baseUrl}/api/v1/report?id=${encodeURIComponent(url)}`
  const response = await fetch(endpoint, command === 'scan'
    ? { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ url, includePlaywright: !noBrowser, publishReport }) }
    : { headers: { accept: 'application/json' } })
  let payload
  try { payload = await response.json() } catch { payload = { error: `AgentReady returned HTTP ${response.status}` } }
  if (json) {
    console.log(JSON.stringify(payload, null, 2))
  } else if (response.ok) {
    if (command === 'scan') console.log(`${payload.url || url}: ${payload.score}/${payload.maxScore ?? 100}`)
    else console.log(`${payload.url || url}: ${payload.score}/${payload.maxScore ?? 100} (${payload.scannedAt || 'saved report'})`)
    if (payload.executiveSummary) console.log(payload.executiveSummary)
  } else {
    console.error(payload.detail || payload.error || `AgentReady returned HTTP ${response.status}`)
  }
  if (!response.ok) process.exitCode = 1
}
