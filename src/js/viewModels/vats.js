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
    'ojs/ojknockout',
    'ojs/ojanimation',
    'ojs/ojavatar',
    'ojs/ojlistview',
    'ojs/ojlistitemlayout'
], function(oj, ko, moduleHelper, data, app, appUtils, ArrayDataProvider) {
    function vats(params) {
        var self = this,
            handleSectionClick;
        self.appUtilities = appUtils;
        self.toggleDrawer = app.toggleDrawer;
        self.parentRouter = params.parentRouter;
        self.scrollElem = document.body;
        //----------------------------------------------
        self.vatType = null;
        self.invVatArr = ko.observableArray([]);
        self.invVatsList = new ArrayDataProvider(self.invVatArr, { keyAttributes: 'id' });


        self.navBack = function() {
            app.router.go('home');
        }

        self.prefetch = function() {}

        self.connected = function() {
            app.isAuthenticated(true);
            getInvoiceVats();
        };

        self.transitionCompleted = function() {};


        self.disconnected = function() {}

        function getInvoiceVats(invType, vatType) {

            let vatInfo = JSON.parse(localStorage.getItem('vatInfo'));
            if (vatInfo) {
                self.vatType = vatInfo.vatType;
                console.log(vatInfo);
                // data.get(`https://windis.tk/ords/etax_mobile/etax/invoice_vats?vat_type=${vatInfo.vatType}&inv_date=${vatInfo.month + '-' + vatInfo.year}`).then((response) => {
                data.get(`https://windis.tk/ords/wtax_hub/WTAXHUB/vat_detail?tax_type_code=${vatInfo.tax_code}&inv_date=${vatInfo.month + '-' + vatInfo.year}`).then((response) => {
                    console.log(response);
                    // self.invArr([]);
                    self.invVatArr(response.items);
                }).catch((err) => {
                    console.log(err);
                });
            } else {
                app.router.go('home');
            }
        };

    }

    return vats;
});