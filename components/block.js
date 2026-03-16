polarity.export = PolarityComponent.extend({
  details: Ember.computed.alias('block.data.details'),

  cvssColorClass: Ember.computed('details.cvssScore', function () {
    const score = this.get('details.cvssScore');
    if (score >= 9.0) return 'rq-score-critical';
    if (score >= 7.0) return 'rq-score-high';
    if (score >= 4.0) return 'rq-score-medium';
    return 'rq-score-low';
  }),

  statusClass: Ember.computed('details.status', function () {
    const status = this.get('details.status') || '';
    return 'rq-status-' + status.toLowerCase().replace(/\s+/g, '-');
  }),

  hasStatus: Ember.computed('details.status', function () {
    const status = this.get('details.status');
    return status && status !== 'N/A';
  }),

  hasAssets: Ember.computed('details.assets', function () {
    const a = this.get('details.assets');
    return a && a.length > 0;
  }),

  hasTechniques: Ember.computed('details.techniques', function () {
    const t = this.get('details.techniques');
    return t && t.length > 0;
  }),

  hasSources: Ember.computed('details.sources', function () {
    const s = this.get('details.sources');
    return s && s.length > 0;
  }),

  init() {
    this._super(...arguments);
    if (!this.get('block._state')) {
      this.set('block._state', {
        showAssets: false,
        showTechniques: false,
        showSources: false,
        showTimeline: false
      });
    }
  },

  actions: {
    toggleSection(section) {
      const key = `block._state.show${section}`;
      this.set(key, !this.get(key));
    }
  }
});

