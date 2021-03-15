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

// Application level setup including router, animations and other utility methods

'use strict';
define(['ojs/ojcore', 'knockout', 'dataService', 'appUtils', 'mapping', 'OfflineController',
  'ConnectionDrawer', 'ModuleHelper', 'ImageHelper', 'ojs/ojarraydataprovider',
  'ojs/ojmodule-element', 'ojs/ojknockout', 'ojs/ojnavigationlist', 'ojs/ojoffcanvas', 'ojs/ojrouter',
  'ojs/ojmoduleanimations', 'ojs/ojmessages', 'ojs/ojavatar'],
  function (oj, ko, data, appUtils, mapping, OfflineController, ConnectionDrawer, moduleHelper, imageHelper, ArrayDataProvider) {

    oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();

    var router = oj.Router.rootInstance;

    // Root router configuration
    router.configure({
      'tour': { label: 'Tour' },
      'signin': { label: 'Sign In', isDefault: true },
      'home': { label: 'Home' },
      'account': { label: 'account' },
      'notification': { label: 'notification' },
      'customers': { label: 'Customers' },
      'profile': { label: 'Profile' },
      'about': { label: 'About' },
      'invoices': { label: 'Invoices' },
      'lines': { label: 'Lines' },
      'vats': { label: 'Vats' },
      'requestInvoice': { label: 'Request Invoice' },
    });

    var darkBackgroundViews = ["tour", "signin"];

    function AppControllerViewModel() {
      ko.mapping = mapping;
      var self = this;
      this.isAuthenticated = ko.observable(false);
      // Nav Bar
      var navData = [
        {
          name: 'Home', id: 'home',
          iconClass: 'fas fa-home nav-bottom'
        },
        {
          name: 'Request Invoice', id: 'requestInvoice',
          iconClass: 'fas fa-money-check-alt nav-bottom'
        }
      ];
      this.navDataSource = new ArrayDataProvider(navData, { idAttribute: 'id' });
      this.navBarChange = function (event) {
        if (event.detail.value != null) {
          if (platform === 'android') {
            pendingAnimationType = 'fade';
          } else {
            // pendingAnimationType = null;
          }
        }
      }

      //offline controller
      self.offlineController = new OfflineController(self);

      self.connectionDrawer = new ConnectionDrawer(self);

      self.router = router;

      // App messages holder
      self.appMessages = ko.observableArray();
      self.appMsgPos = ko.observable({
        'my': { 'vertical': 'top', 'horizontal': 'end' },
        'at': { 'vertical': 'top', 'horizontal': 'end' },
        'of': 'window'
      });

      // drill in and out animation
      var platform = oj.ThemeUtils.getThemeTargetPlatform();

      // disable buttons for post/patch/put
      self.isReadOnlyMode = true;

      // set default connection to Oracle Mobile Hub backend
      self.usingMobileBackend = ko.observable();
      self.usingMobileBackend.subscribe(function (newValue) {
        data.setUseMobileBackend(newValue);
      });

      // Assume online mode to start with
      self.usingMobileBackend(false);

      // Load user profile
      self.userProfileModel = ko.observable();
      var initialProfile;

      self.getUserProfile = function () {
        return new Promise(function (resolve, reject) {

          if (self.userProfileModel()) {
            resolve(self.userProfileModel);
          } else {
            data.getUserProfile().then(function (response) {
              processUserProfile(response, resolve, reject);
            }).catch(function (response) {
              oj.Logger.warn('Failed to connect to MCS. Loading from local data.');
              self.usingMobileBackend(false);
              //load local profile data
              data.getUserProfile().then(function (response) {
                processUserProfile(response, resolve, reject);
              });
            });
          }
        });
      };

      self.getUserProfileAndClearBusyContext = function () {
        self.getUserProfile().then(function () {
          appUtils.resolvePageBusyContext();
        });
      };

      self.isDeviceOnline = function () {
        return self.connectionDrawer.isOnline();
      }

      self.subscribeForDeviceOnlineStateChange = function (callback) {
        return self.connectionDrawer.isOnline.subscribe(callback);
      }

      function processUserProfile(response, resolve, reject) {
        var result = JSON.parse(response);

        if (result) {
          initialProfile = result;
          self.userProfileModel(ko.mapping.fromJS(result));
          resolve(self.userProfileModel);
          return;
        }

        // This won't happen in general, because then that means the entire offline data loading is broken.
        var message = 'Failed to load user profile both online and offline.';
        oj.Logger.error(message);
        reject(message);
      }

      self.updateProfileData = function (updatedModel) {
        imageHelper.loadImage(updatedModel().photo())
          .then(function (base64Image) {
            updatedModel().photo = base64Image;
            initialProfile = ko.mapping.toJS(updatedModel);
            return data.updateUserProfile(initialProfile)
          })
          .then(function () {
            self.userProfileModel(undefined);
          })
          .catch(function (response) {
            oj.Logger.error(response);
            self.connectionDrawer.showAfterUpdateMessage('Failed to save user profile');
          });
      };

      // Revert changes to user profile
      self.revertProfileData = function () {
        self.userProfileModel(ko.mapping.fromJS(initialProfile));
      };

      self.goToCustomers = function (id) {
        self.router.go('customers');
      };

      self.goToSignIn = function () {
        self.router.store('color');
        self.router.go('signin');
      };

      self.goToAccount = function () {
        self.router.go('account');
      }
      self.goToNotification = function () {
        self.router.go('notification');
      }

      self.goToInvoices = function (status) {
        self.router.go('invoices', { params: { statusc: status } });

      }

      self.toggleDrawer = function () {
        self.getUserProfile().then(function () {
          oj.OffcanvasUtils.toggle({ selector: '#navDrawer', modality: 'modal', content: '#pageContent' });
        })
      };

      self.validNavListStates = ['customers', 'profile', 'account', 'about'];


      self.beforeCloseDrawer = function (event, vm) {
        var key = event.detail.key;

        if (key === 'signout') {
          event.preventDefault()
          self.isAuthenticated(false)
          vm.goToSignIn();
          vm.signIn();
          return;
        }

        if (self.validNavListStates.indexOf(key) === -1) {
          event.preventDefault();
          vm.closeDrawer();
          return;
        }
      };

      self.closeDrawer = function () {
        oj.OffcanvasUtils.close({ selector: '#navDrawer', modality: 'modal', content: '#pageContent' });
      };

      self.bottomDrawer = { selector: '#bottomDrawer', modality: 'modal', content: '#pageContent', displayMode: 'overlay' };

      var bottomDrawerOpen = false;

      self.isBottomDrawerOpen = function () {
        return bottomDrawerOpen;
      }

      self.openBottomDrawer = function (imageObject) {
        bottomDrawerOpen = true;
        self.updateProfilePhoto = function (sourceType) {
          photoSelection = true;
          // Save image as file and share the URL by default.
          // We do not want to load many base64 images into memory and suffocate the app.
          var cameraOptions = {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: sourceType,
            encodingType: 0,     // 0=JPG 1=PNG
            correctOrientation: true,
            targetHeight: 2000,
            targetWidth: 2000
          };

          navigator.camera.getPicture(function (imgData) {
            photoSelection = false;
            imageObject(imgData)
          }, function (err) {
            photoSelection = false;
            oj.Logger.error(err);
          }, cameraOptions);

          return self.closeBottomDrawer();
        };


        return oj.OffcanvasUtils.open(self.bottomDrawer)
          .catch(function () {
            bottomDrawerOpen = false;
            return Promise.reject();
          });
      };

      self.closeBottomDrawer = function () {
        return oj.OffcanvasUtils.close(self.bottomDrawer).then(function () {
          bottomDrawerOpen = false;
          return Promise.resolve(true);
        });
      };

      // Setup moduleConfig
      var moduleParams = {
        'parentRouter': self.router
      }

      var applyStausBarStyle = function (stateId) {
        // For android the default status bar is sufficient.
        // There is a reserved space above the app which has black bg in case of Android.
        if (!window.StatusBar || (device && device.platform === 'Android'))
          return;
        var styleFunction = 'styleDefault';
        if (darkBackgroundViews.indexOf(stateId) > -1)
          styleFunction = 'styleLightContent';

        if (self.currentStatusBarStyle === styleFunction)
          return;

        self.currentStatusBarStyle = styleFunction;
        window.StatusBar[styleFunction]();
      }

      // moduleHelper.setupModuleCaching(self);
      moduleHelper.setupModuleWithObservable(self, 'moduleConfig', self.router.stateId, moduleParams);

      // Setup module animations
      self.customersAnimation = ko.observable();

      self.moduleTransitionStarted = function (event) {
        var topElems = document.getElementsByClassName('oj-applayout-fixed-top');
        for (var i = 0; i < topElems.length; i++)
          topElems[i].style.zIndex = 0;
      }

      self.moduleTransitionEnded = function (event) {
        var topElems = document.getElementsByClassName('oj-applayout-fixed-top');
        for (var i = 0; i < topElems.length; i++)
          topElems[i].style.zIndex = '';
      }

      var animationOptions = {
        'tour': null,
        'signin': null,
        'customers': self.customersAnimation,
        'profile': null,
        'about': null,
      };

      moduleHelper.setupModuleAnimations(self, animationOptions, self.router.stateId, 'tour');
      self.initLocalAuth();
    }

    AppControllerViewModel.prototype.setPageContentModuleVisibility = function (visible) {
      this.pageContentModuleDisplay(visible ? '' : 'none');
    };

    AppControllerViewModel.prototype.enqueMessage = function (message) {
      this.appMessages.push(message);
    };

    AppControllerViewModel.prototype.appMessageClosed = function (event, vm) {
      vm.appMessages.remove(event.detail.message);
    };

    AppControllerViewModel.prototype.onLoginSuccess = function () {
      //  this.router.go('incidents/incidentsTabDashboard')
      this.router.go('home')
        .then(function () {
          this.setPageContentModuleVisibility(true);
        }.bind(this));
    };

    AppControllerViewModel.prototype.signIn = function () {
      if (!this.localFlow) {
        this.goToSignIn();
        return;
      }

      var self = this;
      self.localFlow.getManager().getEnabled()
        .then(function (enabled) {
          if (enabled.length > 0) {
            self.setPageContentModuleVisibility(false);
            return self.localFlow.login();
          }

          return Promise.reject("Local authentication not configured.");
        })
        .then(self.onLoginSuccess.bind(self))
        .catch(self.localLoginCompleted.bind(self));
    };

    AppControllerViewModel.prototype.initLocalAuth = function () {
      var self = this;
      this.pageContentModuleDisplay = ko.observable('none');
      if (!window.cordova || !window.cordova.plugins || !window.cordova.plugins.IdmAuthFlows) {
        self.setPageContentModuleVisibility(true);
        return;
      }

      self.localAuthBuilder = ko.observable(new window.cordova.plugins.IdmAuthFlows.LocalAuthPropertiesBuilder().id("LocalAuthDemo"));
      var cca = document.getElementById("localAuth");
      oj.Context.getContext(cca).getBusyContext().whenReady()
        .then(function () {
          return cca.getFlowPromise();
        })
        .then(function (flow) {
          self.localFlow = flow;
          self.signIn();
        }).catch(self.signIn.bind(self));
    };

    return new AppControllerViewModel();
  });
