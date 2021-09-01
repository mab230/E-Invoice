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
    'ojs/ojkeyset',
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
    'ojs/ojdialog'
], function(oj, ko, moduleHelper, data, app, appUtils, ArrayDataProvider, ojkeyset_1) {
    function invoices(params) {
        var self = this;
        self.appUtilities = appUtils;
        self.toggleDrawer = app.toggleDrawer;
        self.parentRouter = params.parentRouter;
        self.scrollElem = document.body;
        self.commentForRejectDilog = ko.observable();
        self.expanded = new ojkeyset_1.ExpandAllKeySet();
        let selectItemData;
        //-------------------------------------------------------------
        self.currentInvoice = { inv_type: "SENT", status: 'Pending' };
        let monthsArr = Array.from({ length: 12 }, (item, index) => { return { label: index < 9 ? '0' + (index + 1) : index + 1, value: index < 9 ? '0' + (index + 1) : index + 1 } });
        let yearsArr = Array.from({ length: 20 }, (item, index) => { return { label: index + 2015, value: index + 2015 } });
        self.monthsADP = new ArrayDataProvider(monthsArr, { keyAttributes: "value" });
        self.yearsADP = new ArrayDataProvider(yearsArr, { keyAttributes: "value" });
        self.month = ko.observable();
        self.year = ko.observable();
        self.invArr = ko.observableArray([]);
        self.invList = new ArrayDataProvider(self.invArr, { keyAttributes: 'document_id' });
        self.invStatus = null;
        self.invType = null;
        self.selectedInvId = null;
        let invoiceId;
        self.selectedInvoice = ko.observable();
        self.commentForReject = ko.observable();
        self.rejectResult = ko.observable("");
        self.errorMessage = ko.observable("");
        self.canReject = ko.observable();
        self.commentForCancle = ko.observable();

        self.monthSelectedAction = function() {
            if (self.year()) {
                console.log('self.invStatus ', self.invStatus, ' self.invType ', self.invType, ' Date ', self.month() + '-' + self.year());
                getInvoices(self.invType, self.month() + '-' + self.year());
            } else {

            }
        }

        self.yearSelectedAction = function() {
            if (self.month()) {
                getInvoices(self.invType, self.month() + '-' + self.year());
            } else {

            }
        }

        self.invListSelectedChanged = function(event) {
            const selectedItems = event.detail.value._keys;
            console.log("############");
            console.log(event.detail.items);
            if (selectedItems.size) {
                console.log(selectedItems);
                invoiceId = selectedItems.values().next().value;
                console.log("FFFFFFFFFFFFF" + invoiceId);
            }
        }

        self.prefetch = function() {}

        self.connected = function() {
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
            // self.invStatus
            data.get(`https://windis.tk/ords/wtax_hub/WTAXHUB/invoice?doc_dirc=${invType}&inv_date=${invDate}&status_code=${self.invStatus}`)
                .then((response) => {
                    console.log(response);
                    self.invArr([]);
                    response.items.forEach(item => {
                        console.log(item);
                        self.invArr.push(item);
                    });
                }).catch((err) => {
                    console.log(err);
                })
        };

        function updateInvoiceStatus(invStatusObj) {
            data.put('https://windis.tk/ords/wtax_hub/WTAXHUB//document_header_mobile', invStatusObj).then((response) => {
                console.log(response);
                getInvoices(self.invType, self.month() + '-' + self.year());
            }).catch((err) => {
                console.log(err);
            })
        }

        function rejectInvoiceAPi(invStatusObj) {
            data.post('https://windis.tk/ords/wtax_hub/WTAXHUB/reject_document', invStatusObj).then((response) => {
                console.log(response);
                console.log(response.error_message);
                self.errorMessage(response.error_message);
                self.rejectResult(response.reject_result);
                document.getElementById('responsRejectDialog').open();
                getInvoices(self.invType, self.month() + '-' + self.year());
            }).catch((err) => {
                console.log(err);
            })
        }

        function cancleInvoiceAPi(invStatusObj) {
            data.post('https://windis.tk/ords/wtax_hub/WTAXHUB/cancle_document', invStatusObj).then((response) => {
                console.log(response);
                console.log(response.error_message);
                self.errorMessage(response.error_message);
                self.rejectResult(response.reject_result);
                document.getElementById('responsRejectDialog').open();
                getInvoices(self.invType, self.month() + '-' + self.year());
            }).catch((err) => {
                console.log(err);
            })
        }
        self.approveAction = function() {
            console.log('Approve');
            console.log("hhhhhhhhhhhhhhh" + self.selectedInvId.document_id);
            console.log("hhhhhhhhhhhhhhh" + self.selectedInvId);
            updateInvoiceStatus({ doc_id: invoiceId, user_by: 'Ahmed', code_submit: 1 });
            self.closeActionMenu();

        }
        self.rejectAction = function(uuid) {
            console.log('Reject');
            document.getElementById('RejectDialog').open();
            console.log(self.commentForReject());
            self.closeActionMenu();
        }


        self.needMoreInfoAction = function() {
            console.log("Need more info");
            document.getElementById('needMoreInfoDialog').open();
            self.closeActionMenu();

        }

        self.rejectConfirm = function() {

            if (!self.isFormValid('rejectConfirmGroup')) {
                return;
            }
            console.log(self.commentForRejectDilog());
            rejectInvoiceAPi({ uuid: selectItemData.etax_issued_doc_id, reject_reson: self.commentForRejectDilog() });
            document.getElementById('RejectDialog').close();
            self.commentForRejectDilog("");

        }

        self.needMoreInfoConfirm = function() {

            if (!self.isFormValid('needMoreInfoGroup')) {
                return;
            }
            console.log(self.commentForReject());
            updateInvoiceStatus({ doc_id: invoiceId, user_by: 'Ahmed', code_submit: 2, doc_comment: self.commentForReject() });
            self.commentForReject("");
            document.getElementById('needMoreInfoDialog').close();
        }

        self.cancelNeedMoreInfo = function() {
            document.getElementById('needMoreInfoDialog').close();
        }
        self.cancelReject = function() {
            document.getElementById('RejectDialog').close();
            self.commentForRejectDilog("");
        }
        self.cancelDocumentAction = function() {
            document.getElementById('cancleDialog').open();
            self.closeActionMenu();
        }
        self.cancleConfirm = function() {

            if (!self.isFormValid('cancleGroup')) {
                return;
            }
            console.log(self.commentForRejectDilog());
            cancleInvoiceAPi({ uuid: selectItemData.etax_issued_doc_id, cancel_reson: self.commentForCancle() });
            document.getElementById('cancleDialog').close();
            self.commentForCancle("");

        }
        self.cancletionCancle = function() {
            document.getElementById('cancleDialog').close();
            self.commentForCancle("")
        }

        self.showActionMenu = function(event, context) {

            selectItemData = context.data;
            self.canReject(selectItemData.can_reject);
            console.log(selectItemData);
            let selectedItems = self.selectedInvoice()._keys;
            console.log(self.selectedInvoice())
            if (selectedItems.size) {
                self.selectedInvId = selectedItems.values().next().value;
                console.log(' self.selectedInvId ', self.selectedInvId);
            }
            document.getElementById('actionMenuId').classList.add('showOverlay');
        }

        self.closeActionMenu = function() {
            document.getElementById('actionMenuId').classList.remove('showOverlay');
        }

        self.showLines = function(invId) {
            let selectedInv = self.invArr().find(inv => inv.document_id == invId);
            console.log(selectedInv);
            let invInfo = localStorage.getItem('invInfo');
            if (invInfo) {
                let invInfoObj = JSON.parse(invInfo);
                console.log(invInfoObj)
                localStorage.setItem('invInfo', JSON.stringify({...invInfoObj, ...selectedInv }));
                app.router.go('lines');
            }
        }
        self.responsRejectDialogclose = function() {
            document.getElementById('responsRejectDialog').close();
        }


        /**
         * check if form is valid
         * @param {*} formId 
         */
        self.isFormValid = function(formId) {
            var tracker = document.getElementById(formId);
            if (tracker.valid === "valid") {
                return true;
            } else {
                tracker.showMessages();
                tracker.focusOn("@firstInvalidShown");
                return false;
            }
        };

        self.transitionCompleted = function() {};

        // profile page header
        var leftBtnLabel = ko.computed(function() {
            return 'Back';
        });

        var rightBtnLabel = ko.computed(function() {
            return 'Edit';
        });

        var rightClickAction = function() {

        };

        var leftClickAction = function() {
            app.router.go("home");
        };

        var icons = ko.computed(function() {
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

        self.disconnected = function() {}
    }

    return invoices;
});