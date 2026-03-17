/*
 * Copyright (c) 2024, Polarity.io, Inc.
 */
const { transformRqResult } = require('./dataTransformations');

/**
 * Queries the RQ CVE risk endpoint for each entity and returns
 * formatted Polarity lookup results.
 *
 * Results with no data (404 / empty body) are returned as { data: null }
 * so Polarity suppresses the overlay for that entity.
 *
 * @param {Array}    entities           - Polarity entity objects
 * @param {Object}   options            - User-configured integration options
 * @param {Function} requestWithDefaults - Pre-configured HTTP request function
 * @param {Object}   Logger             - Polarity logger
 * @returns {Promise<Array>} Polarity-formatted lookup results
 */
// RQ enforces a concurrency limit — more than 2 simultaneous CVE requests causes failures.
// We process entities sequentially with a 500ms pause between each request.
const INTER_REQUEST_DELAY_MS = 500;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getLookupResults = async (entities, options, requestWithDefaults, Logger) => {
  const lookupResults = [];

  for (let i = 0; i < entities.length; i++) {
    if (i > 0) {
      await sleep(INTER_REQUEST_DELAY_MS);
    }
    const result = await queryCveRiskData(entities[i], options, requestWithDefaults, Logger);
    lookupResults.push(result);
  }

  return lookupResults;
};

const queryCveRiskData = async (entity, options, requestWithDefaults, Logger) => {
  const cveId = entity.value.toUpperCase();

  Logger.trace({ cveId }, 'Querying RQ for CVE');

  let response;
  try {
    response = await requestWithDefaults({
      method: 'GET',
      uri: `${options.baseUrl}/export/v1/analysis/cve/${encodeURIComponent(cveId)}/riskData`,
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json'
      },
      options
    });
  } catch (error) {
    // 404 → no data for this CVE; suppress the overlay
    if (error.status === 404) {
      Logger.debug({ cveId }, 'CVE not found in RQ (404)');
      return { entity, data: null };
    }
    throw error;
  }

  const raw = response.body;

  // Empty / null body treated as no result
  if (!raw || (typeof raw === 'object' && Object.keys(raw).length === 0)) {
    return { entity, data: null };
  }

  const transformed = transformRqResult(raw);

  Logger.trace({ cveId, transformed }, 'RQ CVE Result');

  return {
    entity,
    data: {
      summary: buildSummary(transformed),
      details: transformed
    }
  };
};

/**
 * Builds the summary tags displayed in the Polarity overlay header.
 * Shows exploitability status, CVSS score, and affected asset counts.
 */
const buildSummary = (result) => {
  const tags = [];

  if (result.status && result.status !== 'N/A') {
    tags.push(result.status);
  }

  if (result.cvssScore !== 'N/A') {
    tags.push(`CVSS: ${result.cvssScore}`);
  }

  if (result.epssScore && result.epssScore !== 'N/A') {
    tags.push(`EPSS: ${result.epssScore}`);
  }

  if (result.assetsCount !== 'N/A') {
    tags.push(`Assets: ${result.assetsCount}`);
  }

  if (result.criticalAssetsCount !== 'N/A' && result.criticalAssetsCount > 0) {
    tags.push(`Critical: ${result.criticalAssetsCount}`);
  }

  if (result.contributoryEffect && result.contributoryEffect !== 'N/A') {
    tags.push(`Risk: ${result.contributoryEffect}`);
  }

  return tags;
};

module.exports = { getLookupResults };
