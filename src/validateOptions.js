/*
 * Copyright (c) 2024, Polarity.io, Inc.
 */
const fp = require('lodash/fp');
const reduce = require('lodash/fp/reduce').convert({ cap: false });

/**
 * Validates that the given string options are non-empty.
 * @param {Object} stringOptionsErrorMessages - map of option key → error message
 * @param {Object} options - the options object from Polarity
 * @param {Array} otherErrors - existing errors to append to
 * @returns {Array} accumulated validation errors
 */
const validateStringOptions = (stringOptionsErrorMessages, options, otherErrors = []) =>
  reduce((agg, message, optionName) => {
    const isString = typeof options[optionName].value === 'string';
    const isEmptyString = isString && fp.isEmpty(options[optionName].value);

    return !isString || isEmptyString
      ? agg.concat({ key: optionName, message })
      : agg;
  }, otherErrors)(stringOptionsErrorMessages);

/**
 * Validates that the given URL option is a well-formed URL and has no trailing slash.
 * @param {string} url
 * @param {Array} otherErrors
 * @returns {Array} accumulated validation errors
 */
const validateUrlOption = (url, otherErrors = []) => {
  const endWithError =
    url && url.endsWith('/')
      ? otherErrors.concat({
          key: 'baseUrl',
          message: 'Your Base URL must not end with a /'
        })
      : otherErrors;

  if (endWithError.length) return endWithError;

  if (url) {
    try {
      new URL(url);
    } catch (_) {
      return otherErrors.concat({
        key: 'baseUrl',
        message: 'This URL is invalid. You must provide a valid URL.'
      });
    }
  }

  return otherErrors;
};

module.exports = { validateStringOptions, validateUrlOption };
