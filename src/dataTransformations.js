/*
 * Copyright (c) 2024, Polarity.io, Inc.
 */

/**
 * Safely serializes an Error object to a plain JSON-compatible object
 * so it can be logged or returned as a callback error.
 */
const parseErrorToReadableJSON = (error) =>
  JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)));

/**
 * Formats a numeric USD value as a currency string (e.g. $1,234,567.00).
 * Returns 'N/A' if the value is null/undefined.
 */
const formatUsd = (value) => {
  if (value == null) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};

/**
 * Formats a decimal probability as a percentage string (e.g. 0.042 → "4.20%").
 * Returns 'N/A' if the value is null/undefined.
 */
const formatPercent = (value) => {
  if (value == null) return 'N/A';
  return `${(value * 100).toFixed(2)}%`;
};

/**
 * Returns a human-readable ISO date string or 'N/A'.
 */
const formatDate = (value) => {
  if (!value) return 'N/A';
  try {
    return new Date(value).toISOString().split('T')[0];
  } catch (_) {
    return value;
  }
};

/**
 * Transforms the raw RQ API response into a display-ready object
 * for use in Handlebars templates and the polarity-assistant reducer.
 *
 * Real API response (confirmed against uat2.tcrqlabs.com) includes:
 *   assets[], techniques[], compensatingControls[] in addition to the
 *   summary fields originally documented.
 */
const transformRqResult = (raw) => {
  if (!raw) return null;

  return {
    cveName: raw.cveName || 'N/A',
    cvssScore: raw.cvssScore != null ? raw.cvssScore : 'N/A',
    epssScore: raw.epssScore != null ? formatPercent(raw.epssScore) : 'N/A',
    status: raw.status || 'N/A',
    contributoryEffect: raw.contributoryEffect != null ? formatUsd(raw.contributoryEffect) : 'N/A',
    sources: Array.isArray(raw.sources) ? raw.sources : [],
    assetsCount: raw.assetsCount != null ? raw.assetsCount : 'N/A',
    criticalAssetsCount: raw.criticalAssetsCount != null ? raw.criticalAssetsCount : 'N/A',
    publishDate: formatDate(raw.publishDate),
    updateDate: formatDate(raw.updateDate),
    // Confirmed in live API — full asset list with hostname, IPs, and risk score
    assets: Array.isArray(raw.assets)
      ? raw.assets.map((a) => ({
          name: a.name || 'Unknown',
          ips: a.ip ? a.ip.split(',').map((ip) => ip.trim()) : [],
          endpointScoring: a.endpointScoring != null ? Math.round(a.endpointScoring) : 'N/A'
        }))
      : [],
    // MITRE ATT&CK techniques associated with this CVE
    techniques: Array.isArray(raw.techniques)
      ? raw.techniques.map((t) => ({
          id: t.id || '',
          name: t.name || ''
        }))
      : [],
    // Compensating controls (may be empty)
    compensatingControls: Array.isArray(raw.compensatingControls)
      ? raw.compensatingControls
      : []
  };
};

module.exports = {
  parseErrorToReadableJSON,
  formatUsd,
  formatPercent,
  formatDate,
  transformRqResult
};
