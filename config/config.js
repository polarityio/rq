/*
 * Copyright (c) 2024, Polarity.io, Inc.
 */
module.exports = {
  name: 'RQ',
  acronym: 'RQ',
  description:
    'Query the RQ platform by CVE identifier to retrieve affected assets and financial risk data, including CVSS/EPSS scores, exploitability status, and estimated contributory financial impact.',
  entityTypes: ['cve'],
  defaultColor: 'light-blue',
  styles: ['./styles/styles.less'],
  onDemandOnly: false,
  block: {
    component: {
      file: './components/block.js'
    },
    template: {
      file: './templates/block.hbs'
    }
  },
  request: {
    cert: '',
    key: '',
    passphrase: '',
    ca: '',
    proxy: '',
    // Set to false for environments using self-signed/internal CA certs (e.g. UAT)
    rejectUnauthorized: false
  },
  logging: {
    level: 'info' // trace, debug, info, warn, error, fatal
  },
  options: [
    {
      key: 'baseUrl',
      name: 'RQ Base URL',
      description:
        'The base URL for your RQ instance (e.g. https://your-org.rq.example.com). Do not include a trailing slash.',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'apiKey',
      name: 'Personal Access Token',
      description: 'Your RQ Personal Access Token used for Bearer token authentication.',
      default: '',
      type: 'password',
      userCanEdit: false,
      adminOnly: true
    }
  ]
};
