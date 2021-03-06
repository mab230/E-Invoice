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
    "ojs/ojchart",
    'ojs/ojanimation',
    'ojs/ojavatar',
    'ojs/ojlistview',
    'ojs/ojlistitemlayout'
], function(oj, ko, moduleHelper, data, app, appUtils, ArrayDataProvider) {
    function home(params) {
        var self = this;
        self.appUtilities = appUtils;
        self.toggleDrawer = app.toggleDrawer;
        self.parentRouter = params.parentRouter;
        self.scrollElem = document.body;
        //--------------------------------------------
        let monthsArr = Array.from({ length: 12 }, (item, index) => { return { label: index < 9 ? '0' + (index + 1) : index + 1, value: index < 9 ? '0' + (index + 1) : index + 1 } });
        let yearsArr = Array.from({ length: 20 }, (item, index) => { return { label: index + 2015, value: index + 2015 } });
        self.monthsADP = new ArrayDataProvider(monthsArr, { keyAttributes: "value" });
        self.yearsADP = new ArrayDataProvider(yearsArr, { keyAttributes: "value" });
        self.totalVatsValue = ko.observable();
        self.month = ko.observable();
        self.year = ko.observable();
        self.issuedInvIntialArr = [];
        self.issuedInvArr = ko.observableArray([]);
        self.issuedInvList = new ArrayDataProvider(self.issuedInvArr, { keyAttributes: 'id' });
        self.recievedInvArr = ko.observableArray([]);
        self.recievedInvList = new ArrayDataProvider(self.recievedInvArr, { keyAttributes: 'id' });
        self.vatsArr = ko.observableArray([]);
        self.vatsList = new ArrayDataProvider(self.vatsArr, { keyAttributes: 'id' });

        self.issuedSeriesDrillHandler = function(event) {
            const detail = event.detail;
            let series = event.detail.itemData.status_code;
            console.log(detail, series);
            localStorage.setItem('invInfo', JSON.stringify({ inv_type: "SENT", status: series, year: self.year(), month: self.month() }));
            app.goToInvoices(series);
        }

        self.recievedSeriesDrillHandler = function(event) {
            const detail = event.detail;
            let series = event.detail.itemData.status_code;
            console.log(detail, series);
            localStorage.setItem('invInfo', JSON.stringify({ inv_type: "RECEIVED", status: series, year: self.year(), month: self.month() }));
            app.goToInvoices(series);
        }

        self.vatsSeriesDrillHandler = function(event) {
            const detail = event.detail;
            console.log(detail.itemData.tax_code);
            let series = event.detail.series;
            console.log(detail, series);
            // localStorage.setItem('invInfo', JSON.stringify({ inv_type: 2, status: series, year: self.year(), month: self.month() }));
            // app.goToInvoices(series);
            localStorage.setItem('vatInfo', JSON.stringify({ 'vatType': series, year: self.year(), month: self.month(), tax_code: detail.itemData.tax_code }));
            app.router.go('vats');
        }

        self.connected = function() {
            app.isAuthenticated(true);
            if (app.monthSelected() && app.yearSelected()) {
                self.month(app.monthSelected());
                self.year(app.yearSelected());

            } else {
                const currentDate = new Date();
                const currentMonth = currentDate.getMonth() + 1 > 9 ? currentDate.getMonth() + 1 : '0' + (currentDate.getMonth() + 1);
                self.month(currentMonth);
                self.year(currentDate.getFullYear());
            }
            getInvoicesStatus(self.month() + '-' + self.year(), "SENT");
            getInvoicesStatus(self.month() + '-' + self.year(), "RECEIVED");
            getVats(self.month() + '-' + self.year());
            console.log("=======================================");
            console.log(app.monthSelected());
        };

        self.monthSelectedAction = function() {
            if (self.year()) {
                app.monthSelected(self.month());
                app.yearSelected(self.year());
                getInvoicesStatus(self.month() + '-' + self.year(), "SENT");
                getInvoicesStatus(self.month() + '-' + self.year(), "RECEIVED");
                getVats(self.month() + '-' + self.year());
            } else {}
        }

        self.yearSelectedAction = function() {
            if (self.month()) {
                app.yearSelected(self.year());
                app.monthSelected(self.month());
                getInvoicesStatus(self.month() + '-' + self.year(), "SENT");
                getInvoicesStatus(self.month() + '-' + self.year(), "RECEIVED");
                getVats(self.month() + '-' + self.year());
            } else {}
        }

        function getInvoicesStatus(inv_date, invType) {
            data.get(`https://windis.tk/ords/wtax_hub/WTAXHUB/invoice_chart?doc_type=${invType}&create_date=${inv_date}`)
                .then(response => {
                    if (invType == "SENT") {
                        if (response.items.length) {
                            self.issuedInvArr(response.items);
                        } else {
                            self.issuedInvArr([]);
                        }
                    } else if (invType == "RECEIVED") {
                        if (response.items.length) {
                            self.recievedInvArr(response.items);
                        } else {
                            self.recievedInvArr([]);
                        }
                    }
                }).catch(err => {
                    console.log(err);
                });
        }

        self.scrollUp = function() {
            let pageContent = document.getElementById("pageContent");
            pageContent.scrollTop += 100;
        }

        self.scrollDown = function() {
            let pageContent = document.getElementById("pageContent");
            pageContent.scrollTop -= 100;
        }

        function getVats(inv_date) {
            data.get(`https://windis.tk/ords/wtax_hub/WTAXHUB/taxes_chart?inv_date=${inv_date}`).then(response => {
                if (response.items.length) {
                    self.totalVatsValue('Total ' + response.items.reduce((a, b) => a + (b['total_vat'] || 0), 0) + '$');
                    self.vatsArr(response.items);
                } else {
                    self.vatsArr([]);
                }
            }).catch(err => {
                console.log(err);
            });
        }

    }
    return home;
});