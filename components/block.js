polarity.export = PolarityComponent.extend({
  details: Ember.computed.alias('block.data.details'),
  summary: Ember.computed.alias('block.data.summary'),

  cvssColorClass: Ember.computed('details.cvssScore', function () {
    const score = this.get('details.cvssScore');
    if (score >= 9.0) return 'rq-critical';
    if (score >= 7.0) return 'rq-high';
    if (score >= 4.0) return 'rq-medium';
    return 'rq-low';
  }),

  hasCriticalAssets: Ember.computed('details.criticalAssetsCount', function () {
    return this.get('details.criticalAssetsCount') > 0;
  }),

  statusClass: Ember.computed('details.status', function () {
    const status = this.get('details.status');
    if (!status || status === 'N/A') return '';
    return 'rq-status-' + status.toLowerCase().replace(/\s+/g, '-');
  }),

  hasStatus: Ember.computed('details.status', function () {
    const status = this.get('details.status');
    return status && status !== 'N/A';
  }),

  hasAssets: Ember.computed('details.assets', function () {
    const assets = this.get('details.assets');
    return assets && assets.length > 0;
  }),

  hasTechniques: Ember.computed('details.techniques', function () {
    const t = this.get('details.techniques');
    return t && t.length > 0;
  }),

  hasSources: Ember.computed('details.sources', function () {
    const s = this.get('details.sources');
    return s && s.length > 0;
  }),

  hasCompensatingControls: Ember.computed('details.compensatingControls', function () {
    const c = this.get('details.compensatingControls');
    return c && c.length > 0;
  })
});

