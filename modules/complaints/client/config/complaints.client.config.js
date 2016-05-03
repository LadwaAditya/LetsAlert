(function () {
  'use strict';

  angular
    .module('complaints')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Complaints',
      state: 'complaints',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'complaints', {
      title: 'List Complaints',
      state: 'complaints.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'complaints', {
      title: 'Create Complaint',
      state: 'complaints.create',
      roles: ['user']
    });
  }
})();
