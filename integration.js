/*
 * Copyright (c) 2024, Polarity.io, Inc.
 */
'use strict';

const createRequestWithDefaults = require('./src/createRequestWithDefaults');
const { validateStringOptions, validateUrlOption } = require('./src/validateOptions');
const { parseErrorToReadableJSON } = require('./src/dataTransformations');
const { getLookupResults } = require('./src/getLookupResults');

let Logger;
let requestWithDefaults;

const startup = async (logger) => {
  Logger = logger;
  requestWithDefaults = createRequestWithDefaults(Logger);
};

const doLookup = async (entities, options, cb) => {
  Logger.debug({ entities }, 'Entities');

  let lookupResults = [];
  try {
    lookupResults = await getLookupResults(entities, options, requestWithDefaults, Logger);
  } catch (error) {
    const err = parseErrorToReadableJSON(error);
    Logger.error({ error, formattedError: err }, 'RQ Lookup Failed');
    return cb({
      detail: error.message || 'RQ CVE lookup failed',
      err
    });
  }

  Logger.trace({ lookupResults }, 'Lookup Results');
  cb(null, lookupResults);
};

const validateOptions = async (options, callback) => {
  const stringOptionsErrorMessages = {
    baseUrl: 'You must provide a valid RQ Base URL.',
    apiKey: 'You must provide a valid RQ Personal Access Token.'
  };

  const stringValidationErrors = validateStringOptions(stringOptionsErrorMessages, options);
  const urlValidationErrors = validateUrlOption(options.baseUrl.value, stringValidationErrors);

  callback(null, urlValidationErrors);
};

module.exports = {
  startup,
  doLookup,
  validateOptions
};
