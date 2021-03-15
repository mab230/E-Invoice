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

 // view model for the tour content with filmstrip
 'use strict';
 define(['knockout', 'ojs/ojfilmstrip', 'ojs/ojpagingcontrol', 'ojs/ojknockout'], function(ko) {
   function tourContent(params) {
     var self = this;

     self.pagingModel = ko.observable(null);
     self.filmStripOptionChange = params.filmStripOptionChange;

     // todo: need to fix the animation so that the paging model is set before the transition occurs
     self.connected = function() {
       var filmStrip = document.getElementById("filmStrip");
       oj.Context.getContext(filmStrip).getBusyContext().whenReady().then(function () {
         self.pagingModel(filmStrip.getPagingModel());
       });
     }

     self.steps = [
       {
         'title': 'About Us',
         'description': 'WIND Information System is an enterprise-focused solution provider dedicated to develop technology based services, business process automation and digitalization throughout Middle East & Africa. We are an international leading provider of high quality, innovative software solutions and services with a solid expertise.',
         'headingColorClass': 'oj-text-color-primary',
         'iconClass': 'css/images/about.png'
       },
       {
         'title': 'Mission',
         'description': 'Our mission is to become a leading IT solution & Service provider through continuous improvement and excellence in projects, and employee development, defining high quality solutions that create value and competitive advantage to customers.',
         'headingColorClass': 'oj-text-color-primary',
         'iconClass': 'css/images/mission.png'
       },
       {
         'title': 'Vision',
         'description': 'Our vision is to become your partner of choice by sharing expertise, and delivering high value projects throughout the Middle East and African markets on-time and always.',
         'headingColorClass': 'oj-text-color-primary',
         'iconClass': 'css/images/vision.png'
       },
       {
         'title': 'Values',
         'description': 'Simplicity - Accountability - Collaboration - Respect - Integrity',
         'headingColorClass': 'oj-text-color-primary',
         'iconClass': 'css/images/values.png'
       }
     ];

     self.getItemInitialDisplay = function(index) {
       return index < 1 ? '' : 'none';
     };

   }
   return tourContent;
 });
