'use strict';

describe('Complaints E2E Tests:', function () {
  describe('Test Complaints page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/complaints');
      expect(element.all(by.repeater('complaint in complaints')).count()).toEqual(0);
    });
  });
});
