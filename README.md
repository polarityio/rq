# RQ — Polarity Integration

Query the **RQ** platform by CVE identifier to surface affected assets and financial risk data directly in Polarity overlays.

## Features

- Triggers on CVE entity types (e.g. `CVE-2025-14174`)
- Displays CVSS severity score, EPSS exploit probability, and exploitability status
- Shows estimated **contributory financial effect** (USD) for each CVE
- Lists total affected assets, critical assets, and contributing data sources
- Includes polarity-assistant `reducer.js` for AI-powered CVE risk Q&A

## Required Options

| Option | Type | Description |
|--------|------|-------------|
| **RQ Base URL** | text | Your RQ instance URL (no trailing slash) |
| **Personal Access Token** | password | Your RQ Bearer token |

## API

```
GET {baseUrl}/export/v1/analysis/cve/{cveId}/riskData
Authorization: Bearer {apiKey}
```

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure the integration in the Polarity admin panel with your **Base URL** and **Personal Access Token**.

## Linear Ticket

[PL-1495 — RQ CVE Risk Integration](https://linear.app/polarity/issue/PL-1495)
