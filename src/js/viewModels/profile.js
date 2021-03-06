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
define(['knockout', 'appController', 'ModuleHelper', 'ImageHelper', 'appUtils',
  'ojs/ojmodule-element', 'ojs/ojknockout', 'ojs/ojinputtext', 'ojs/ojlabel', 'ojs/ojformlayout', 'ojs/ojavatar',  'ojs/ojlabelvalue'],

function(ko, app, moduleHelper, imageHelper, appUtils) {
  function profile(params) {
            
    var self = this;
    self.userProfileModel;

    function refreshUserModel(resolve) {
      app.getUserProfile().then(function(model) {
        self.userProfileModel = model;
        if (resolve)
          resolve();
      });
    }

    self.prefetch = function() {
      return new Promise(function(resolve, reject) {
        refreshUserModel(resolve);
      });
    }

    self.connected = function() {
      imageHelper.registerImageListeners(app, 'upload-profile-pic', self.userProfileModel().photo, self, 'changePhoto');
    }

    // adjust content padding
    self.transitionCompleted = function() {
      appUtils.adjustContentPadding();
    };

    self.editMode = ko.observable(false);

    // profile page header
    var leftBtnLabel = ko.computed(function(){
      return self.editMode() ? 'Back': 'Navigation Drawer';
    });

    var rightBtnLabel = ko.computed(function(){
      return self.editMode() ? 'Save': 'Edit';
    });

    var rightClickAction = function() {
      if (self.editMode()) {
       // app.updateProfileData(self.userProfileModel);
        self.editMode(false);
      } else {
        self.editMode(true);
      }
    };

    var leftClickAction = function() {
		console.log("here")
      if (self.editMode()) {
        //app.revertProfileData();
        //refreshUserModel();
        self.editMode(false);
      } else {
        app.toggleDrawer();
      }
    };

    var icons = ko.computed(function() {
      return self.editMode() ?
        'oj-ux-ico-arrow-left oj-ux-icon-size-6x' :
        'oj-ux-ico-menu oj-ux-icon-size-6x';
    });

    var headerViewModelParams = {
      title: 'Profile',
      startBtn: {
        id: 'backBtn',
        click: leftClickAction,
        display: 'icons',
        label: leftBtnLabel,
        icons: icons,
        visible: true
      },
      endBtn: {
        id: 'nextBtn',
        click: rightClickAction,
        display: 'all',
        label: rightBtnLabel,
        icons: '',
        visible: true,
        disabled: false
      }
    };

    moduleHelper.setupStaticModule(self, 'headerConfig', 'basicHeader', headerViewModelParams);
  }

  return profile;
});
