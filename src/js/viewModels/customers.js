/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
'use strict';
define(['ojs/ojcore', 'knockout',
        'dataService',
        'appController',
        'appUtils',
        'ojs/ojarraydataprovider',
        'ojs/ojknockout',
        'ojs/ojanimation',
        'ojs/ojavatar',
        'ojs/ojlistview',
        'ojs/ojlistitemlayout'], function(oj, ko, data, app, appUtils,ArrayDataProvider){
  function customers(params) {
    var self = this, handleSectionClick;
    self.appUtilities = appUtils;
    self.toggleDrawer = app.toggleDrawer;
    self.parentRouter = params.parentRouter;
    self.scrollElem = document.body;

    self.prefetch = function() {

    }


    self.connected = function() {
          var data = [{ "id": 1, "name": "Chris Black", "title": "1", "image": "css/images/1.jpg" },
          { "id": 2, "name": "Christine Cooper", "title": "Senior Principal Escalation Manager", "image": "css/images/2.jpg" },
          { "id": 3, "name": "Chris Benalamore", "title": "Area Business Operations Director EMEA & JAPAC", "image": "css/images/3.jpg" },
          { "id": 4, "name": "Christopher Johnson", "title": "Vice-President HCM Application Development", "image": "css/images/4.jpg" },
          { "id": 5, "name": "Samire Christian", "title": "Consulting Project Technical Manager", "image": "css/images/5.jpg" },
          { "id": 6, "name": "Kurt Marchris", "title": "Customer Service Analyst", "image": "css/images/6.jpg" },
          { "id": 7, "name": "Zelda Christian Cooperman", "title": "Senior Principal Escalation Manager", "image": "css/images/7.jpg" },{ "id": 8, "name": "Chris Black", "title": "Oracle Cloud Infrastructure GTM Channel Director EMEA", "image": "css/images/8.jpg" },
          { "id": 9, "name": "Christine Cooper", "title": "Senior Principal Escalation Manager", "image": "css/images/9.jpg" },
          { "id": 10, "name": "Chris Benalamore", "title": "Area Business Operations Director EMEA & JAPAC", "image": "css/images/10.jpg" },
          { "id": 11, "name": "Christopher Johnson", "title": "Vice-President HCM Application Development", "image": "css/images/11.jpg" },
          { "id": 12, "name": "Samire Christian", "title": "Consulting Project Technical Manager", "image": "css/images/12.jpg" }
      ];
          
          this.dataProvider = new ArrayDataProvider(data, { keyAttributes: 'id' });
    };

    self.transitionCompleted = function() {
    };

    self.disconnected = function() {
    }
  }

  return customers;
});
