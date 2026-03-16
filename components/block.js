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
  })
});
