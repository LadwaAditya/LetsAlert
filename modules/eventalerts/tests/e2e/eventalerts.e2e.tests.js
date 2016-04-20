'use strict';

describe('Eventalerts E2E Tests:', function () {
  describe('Test Eventalerts page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/eventalerts');
      expect(element.all(by.repeater('eventalert in eventalerts')).count()).toEqual(0);
    });
  });
});
