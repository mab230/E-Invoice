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
    'ModuleHelper',
    'ojs/ojarraydataprovider',
    'ojs/ojknockout',
    'ojs/ojanimation',
    'ojs/ojavatar',
    "ojs/ojcollapsible",
    'ojs/ojlistview',
    'ojs/ojlistitemlayout',
    "ojs/ojinputtext",
    'ojs/ojformlayout',
    'ojs/ojdialog',
    'ojs/ojvalidationgroup',
], function(oj, ko, data, app, appUtils, moduleHelper, ArrayDataProvider) {
    function lines(params) {
        var self = this,
            handleSectionClick;
        self.appUtilities = appUtils;
        self.toggleDrawer = app.toggleDrawer;
        self.parentRouter = params.parentRouter;
        self.scrollElem = document.body;
        //------------------------------------------------
        self.invoice = null;
        self.invStatus = ko.observable();
        self.linesArr = ko.observableArray([]);
        self.linesList = new ArrayDataProvider(self.linesArr, { keyAttributes: 'document_id' });
        self.commentForReject = ko.observable();
        //------------------------------------------------

        self.onInvHeaderIconClicked = function() {
            document.getElementById('invBodyId').classList.toggle('hideInvBody');
            if (document.getElementById('invHeaderIcondId').classList.contains('fa-angle-up')) {
                document.getElementById('invHeaderIcondId').classList.remove('fa-angle-up');
                document.getElementById('invHeaderIcondId').classList.add('fa-angle-down');
            } else {
                document.getElementById('invHeaderIcondId').classList.remove('fa-angle-down');
                document.getElementById('invHeaderIcondId').classList.add('fa-angle-up');
            }
        }

        self.connected = function() {
            const invInfo = localStorage.getItem('invInfo');
            if (invInfo) {
                let invInfoObj = JSON.parse(invInfo);
                self.invoice = invInfoObj;
                self.invStatus(self.invoice.status);
                self.linesArr(self.invoice.line);
            } else {
                app.router.go('invoices');
            }
        };

        self.showActionMenu = function() {
            document.getElementById('actionMenuId').classList.add('showOverlay');
        }

        self.closeActionMenu = function() {
            document.getElementById('actionMenuId').classList.remove('showOverlay');
        }


        self.approveAction = function() {
            console.log('Approve');
            self.closeActionMenu();
            updateInvoiceStatus({ doc_id: self.invoice.document_id, user_by: 'Ahmed', code_submit: 1 });
        }

        self.rejectAction = function() {
            console.log('Reject');
            updateInvoiceStatus({ doc_id: self.invoice.document_id, user_by: 'Ahmed', code_submit: 2, doc_comment: self.commentForReject() });
            self.commentForReject("");
            self.closeActionMenu();

        }

        self.needMoreInfoAction = function() {
            console.log("Need more info");
            document.getElementById('needMoreInfoDialog').open();
            self.closeActionMenu();
        }

        self.needMoreInfoConfirm = function() {
            if (!self.isFormValid('needMoreInfoGroup')) {
                return;
            }
            updateInvoiceStatus({ doc_id: self.invoice.document_id, user_by: 'Ahmed', code_submit: 2, doc_comment: self.commentForReject() });
            self.commentForReject("");
        }

        self.cancelNeedMoreInfo = function() {
            document.getElementById('needMoreInfoDialog').close();
        }


        function updateInvoiceStatus(invStatusObj) {
            data.put('https://windis.tk/ords/wtax_hub/WTAXHUB/document_header_mobile', invStatusObj).then((response) => {
                console.log(response);
                app.router.go('home');
            }).catch((err) => {
                console.log(err);
            });
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

        self.disconnected = function() {}

        var leftClickAction = function() {
            app.router.go("invoices");
        };

        var leftBtnLabel = ko.computed(function() {
            return 'Back';
        });

        var icons = ko.computed(function() {
            return 'oj-ux-ico-arrow-left oj-ux-icon-size-6x';
        });

        var rightBtnLabel = ko.computed(function() {
            return 'Edit';
        });

        var rightClickAction = function() {};

        var headerViewModelParams = {
            title: 'Lines',
            startBtn: {
                id: 'backBtn',
                click: leftClickAction,
                display: 'icons',
                label: leftBtnLabel,
                icons: icons,
                visible: true,
                disabled: false
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

        self.truncateText = function(text) {
            return (text.length > 10) ? text.substr(0, 10 - 1) + '...' : text;
        }

        moduleHelper.setupStaticModule(self, 'headerConfig', 'basicHeader', headerViewModelParams);
    }

    return lines;
});