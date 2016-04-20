(function () {
  'use strict';

  angular
    .module('eventalerts')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Events',
      state: 'eventalerts',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'eventalerts', {
      title: 'List Events of this department',
      state: 'eventalerts.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'eventalerts', {
      title: 'Create Events',
      state: 'eventalerts.create',
      roles: ['user']
    });

    Menus.addSubMenuItem('topbar', 'eventalerts', {
      title: 'List all Events',
      state: 'eventalerts.listall',
      roles: ['user']
    });
  }
})();
