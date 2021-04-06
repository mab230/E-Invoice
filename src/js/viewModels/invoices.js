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
define(['ojs/ojcore', 'knockout', 'ModuleHelper',
  'dataService',
  'appController',
  'appUtils',
  'ojs/ojarraydataprovider',
  'ojs/ojvalidationgroup',
  'ojs/ojselectsingle',
  'ojs/ojformlayout',
  'ojs/ojknockout',
  'ojs/ojanimation',
  "ojs/ojbutton",
  'ojs/ojavatar',
  'ojs/ojlistview',
  'ojs/ojlistitemlayout',
  "ojs/ojinputtext",
  'ojs/ojdialog'], function (oj, ko, moduleHelper, data, app, appUtils, ArrayDataProvider) {
    function invoices(params) {
      var self = this;
      self.appUtilities = appUtils;
      self.toggleDrawer = app.toggleDrawer;
      self.parentRouter = params.parentRouter;
      self.scrollElem = document.body;
      //-------------------------------------------------------------
      self.currentInvoice = { inv_type: 1, status: 'Pending' };
      let monthsArr = Array.from({ length: 12 }, (item, index) => { return { label: index < 9 ? '0' + (index + 1) : index + 1, value: index < 9 ? '0' + (index + 1) : index + 1 } });
      let yearsArr = Array.from({ length: 20 }, (item, index) => { return { label: index + 2015, value: index + 2015 } });
      self.monthsADP = new ArrayDataProvider(monthsArr, { keyAttributes: "value" });
      self.yearsADP = new ArrayDataProvider(yearsArr, { keyAttributes: "value" });
      self.month = ko.observable();
      self.year = ko.observable();
      self.invArr = ko.observableArray([]);
      self.invList = new ArrayDataProvider(self.invArr, { keyAttributes: 'id' });
      self.invStatus = null;
      self.invType = null;
      self.selectedInvId = null;
      self.selectedInvoice = ko.observable();

      self.monthSelectedAction = function () {
        if (self.year()) {
          console.log('self.invStatus ', self.invStatus, ' self.invType ', self.invType, ' Date ', self.month() + '-' + self.year());
          getInvoices(self.invType, self.month() + '-' + self.year());
        } else {

        }
      }

      self.yearSelectedAction = function () {
        if (self.month()) {
          getInvoices(self.invType, self.month() + '-' + self.year());
        } else {

        }
      }

      self.invListSelectedChanged = function (event) {
        const selectedItems = event.detail.value._keys;
        console.log(selectedItems);
        if (selectedItems.size) {
          let invoiceId = selectedItems.values().next().value;
          console.log(invoiceId);
        }
      }

      self.prefetch = function () { }

      self.connected = function () {
        const invInfo = localStorage.getItem('invInfo');
        if (invInfo) {
          let invoiceInfo = JSON.parse(invInfo);
          console.log(invoiceInfo);
          self.month(invoiceInfo.month);
          self.year(invoiceInfo.year);
          self.invStatus = invoiceInfo.status;
          self.invType = invoiceInfo.inv_type;
          getInvoices(invoiceInfo.inv_type, invoiceInfo.month + '-' + invoiceInfo.year);
        } else // go to home
          leftClickAction();
      };

      function getInvoices(invType, invDate) {
        data.get(`https://windis.tk/ords/etax_mobile/etax/invoices?inv_status=${self.invStatus}&inv_type=${invType}&inv_date=${invDate}`).then((response) => {
          console.log(response);
          self.invArr([]);
          response.items.forEach(item => {
            console.log(item);
            if (item.inv_json) self.invArr.push(JSON.parse(item.inv_json));
          });
        }).catch((err) => {
          console.log(err);
        })
      };

      function updateInvoiceStatus(invStatusObj) {
        data.put('https://windis.tk/ords/etax_mobile/etax/invoices_status', invStatusObj).then((response) => {
          console.log(response);
          getInvoices(self.invType, self.month() + '-' + self.year());
        }).catch((err) => {
          console.log(err);
        })
      }

      self.approveAction = function () {
        console.log('Approve');
        self.closeActionMenu();
        updateInvoiceStatus({ invoice_id: self.selectedInvId, new_status: 'Approved', current_status: self.invStatus });
      }

      self.rejectAction = function () {
        console.log('Reject');
        self.closeActionMenu();
        updateInvoiceStatus({ invoice_id: self.selectedInvId, new_status: 'Rejected', current_status: self.invStatus });
      }


      self.needMoreInfoAction = function () {
        console.log("Need more info");
        document.getElementById('needMoreInfoDialog').open();
        self.closeActionMenu();

      }

      self.needMoreInfoConfirm = function () {
        if (!self.isFormValid('needMoreInfoGroup')) {
          return;
        }
        updateInvoiceStatus({ invoice_id: self.selectedInvId, new_status: 'NeedMoreInfo', current_status: self.invStatus });
        document.getElementById('needMoreInfoDialog').close();
      }

      self.cancelNeedMoreInfo = function () {
        document.getElementById('needMoreInfoDialog').close();
      }

      self.showActionMenu = function () {
        let selectedItems = self.selectedInvoice()._keys;
        if (selectedItems.size) {
          self.selectedInvId = selectedItems.values().next().value;
          console.log(' self.selectedInvId ', self.selectedInvId);
        }
        document.getElementById('actionMenuId').classList.add('showOverlay');
      }

      self.closeActionMenu = function () {
        document.getElementById('actionMenuId').classList.remove('showOverlay');
      }

      self.showLines = function (invId) {
        let selectedInv = self.invArr().find(inv => inv.id == invId);
        let invInfo = localStorage.getItem('invInfo');
        if (invInfo) {
          let invInfoObj = JSON.parse(invInfo);
          localStorage.setItem('invInfo', JSON.stringify({ ...invInfoObj, ...selectedInv }));
          app.router.go('lines');
        }
      }



      /**
       * check if form is valid
       * @param {*} formId 
       */
      self.isFormValid = function (formId) {
        var tracker = document.getElementById(formId);
        if (tracker.valid === "valid") {
          return true;
        } else {
          tracker.showMessages();
          tracker.focusOn("@firstInvalidShown");
          return false;
        }
      };

      self.transitionCompleted = function () { };

      // profile page header
      var leftBtnLabel = ko.computed(function () {
        return 'Back';
      });

      var rightBtnLabel = ko.computed(function () {
        return 'Edit';
      });

      var rightClickAction = function () {

      };

      var leftClickAction = function () {
        app.router.go("home");
      };

      var icons = ko.computed(function () {
        return 'oj-ux-ico-arrow-left oj-ux-icon-size-6x';
      });

      var headerViewModelParams = {
        title: 'Invoices',
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
          display: 'none',
          label: rightBtnLabel,
          icons: '',
          visible: false,
          disabled: app.isReadOnlyMode ? self.editMode : false
        }
      };

      moduleHelper.setupStaticModule(self, 'headerConfig', 'basicHeader', headerViewModelParams);

      self.disconnected = function () {
      }
    }

    return invoices;
  });
