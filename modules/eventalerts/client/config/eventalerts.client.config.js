(function () {
  'use strict';

  angular
    .module('eventalerts')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Eventalerts',
      state: 'eventalerts',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'eventalerts', {
      title: 'List Eventalerts',
      state: 'eventalerts.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'eventalerts', {
      title: 'Create Eventalert',
      state: 'eventalerts.create',
      roles: ['user']
    });
  }
})();
