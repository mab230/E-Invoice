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
    'ojs/ojlistitemlayout',
    "ojs/ojcheckboxset",
    "ojs/ojdialog",
    "ojs/ojinputtext",
    'ojs/ojformlayout',
    'ojs/ojdialog',
    'ojs/ojvalidationgroup'
], function(oj, ko, moduleHelper, data, app, appUtils, ArrayDataProvider) {
    function requestInvoice(params) {
        var self = this,
            handleSectionClick;
        self.appUtilities = appUtils;
        self.toggleDrawer = app.toggleDrawer;
        self.parentRouter = params.parentRouter;
        self.scrollElem = document.body;
        //------------------------------------------------
        self.milestoneJustification = ko.observable();
        self.selectedMilestonesLength = ko.observable(0);
        self.selectedCustomer = ko.observable();
        self.selectedContract = ko.observable();
        self.selectedMilestone = ko.observable();
        self.selectedMilestones = ko.observableArray([]);
        self.customersArr = ko.observableArray([]);
        self.customersList = new ArrayDataProvider(self.customersArr, { keyAttributes: 'id' });
        self.customerContractsArr = ko.observableArray([]);
        self.customerContractList = new ArrayDataProvider(self.customerContractsArr, { keyAttributes: 'id' });
        self.milestonesArr = ko.observableArray([]);
        self.milestonesList = new ArrayDataProvider(self.milestonesArr, { keyAttributes: 'id' });

        // self.onCustomerSelect = function (customerId) {
        //   console.log('>>>>>>> ', customerId);
        //   if (customerId) {
        //     let customer = self.customersArr().find(customer => customer.id == customerId);
        //     console.log('customerId - ', customerId, customer);
        //     self.customerContractsArr(customer.contracts);
        //     document.getElementById('customersContainerId').classList.add('hideCustomersContainer');
        //     document.getElementById('contractsContianerId').classList.add('showContractsContianer');
        //     document.getElementById('contractsContianerId').classList.remove('hideContractContainer');
        //   }
        // }
        let customerIdSelected;
        self.onCustomerSelect = function(customerId) {
            console.log('>>>>>>> ', customerId);
            customerIdSelected = customerId;

            if (customerId) {
                let customer = self.customersArr().find(customer => customer.id == customerId);
                console.log('customerId - ', customerId, customer);
                document.getElementById('sendMilestoneDialog').open();
                // document.getElementById('customersContainerId').classList.add('hideCustomersContainer');
                // document.getElementById('contractsContianerId').classList.add('showContractsContianer');
                // document.getElementById('contractsContianerId').classList.remove('hideContractContainer');
            }
        }

        this.handleCustomerSelectedChanged = (event) => {

            self.selectedCustomer(event.detail.value);
            // console.log('selection handle -- ', event.detail.value._keys.values().next().value);
            // const selectedItems = event.detail.value._keys;
            // if (selectedItems.size) {
            //   let customerId = selectedItems.values().next().value;
            //   if (customerId) {
            //     let customer = self.customersArr().find(customer => customer.id == customerId);
            //     console.log('customerId - ', customerId, customer);
            //     self.customerContractsArr(customer.contracts);
            //     document.getElementById('customersContainerId').classList.add('hideCustomersContainer');
            //     document.getElementById('contractsContianerId').classList.add('showContractsContianer');
            //     document.getElementById('contractsContianerId').classList.remove('hideContractContainer');
            //   }
            // }
        };

        self.onBackContractSelect = function() {
            document.getElementById('customersContainerId').classList.remove('hideCustomersContainer');
            document.getElementById('contractsContianerId').classList.remove('showContractsContianer');
        }

        self.onForwardContractSelect = function(contractId) {
            if (contractId) {
                let contract = self.customerContractsArr().find(contract => contract.id == contractId);
                console.log('contractId - ', contractId, contract);
                self.milestonesArr(contract.milestones.map(milestone => {
                    milestone.selected = ko.observableArray();
                    return milestone;
                }));
                document.getElementById('milestonesId').classList.add('showMileStomeContianer');
                document.getElementById('contractsContianerId').classList.add('hideContractContainer');
                document.getElementById('milestonesId').classList.remove('hideMilestoneContainer');
            }
        }

        self.sendInvoice = function() {
            if (self.selectedMilestones().length) {
                document.getElementById('SendRequestInvoiceDialog').open();
            }
        }

        self.onMileStoneChecked = function(event) {
            const selectedItems = self.selectedMilestone()._keys;
            console.log(selectedItems);
            if (selectedItems.size) {
                let milestoneId = selectedItems.values().next().value;
                console.log(milestoneId, event.detail.value[0]);
                if (event.detail.value[0]) {
                    document.getElementById('sendMilestoneDialog').open();
                    self.milestoneJustification(null);
                } else {
                    self.selectedMilestones.remove(function(milestone) { return (milestone.id == milestoneId) });
                    self.selectedMilestonesLength(self.selectedMilestones().length);
                }
            }
        }

        self.requestInvoiceConfirm = function() {
            if (!self.isFormValid('sendMilestoneGroup')) {
                return;
            }
            // const selectedItems = self.selectedMilestone()._keys;
            self.selectedMilestones().push({ id: customerIdSelected, justification: self.milestoneJustification() });
            self.selectedMilestonesLength(self.selectedMilestones().length);
            document.getElementById('sendMilestoneDialog').close();
            // const selectedItems = self.selectedMilestone()._keys;
            // console.log(selectedItems);
            // if (selectedItems.size) {
            //     let milestoneId = selectedItems.values().next().value;
            //     self.selectedMilestones().push({ id: milestoneId, justification: self.milestoneJustification() });
            //     self.selectedMilestonesLength(self.selectedMilestones().length);
            // }
            self.milestoneJustification("");
        }

        self.cancelRequestInvoice = function() {
            document.getElementById('sendMilestoneDialog').close();
            // const selectedItems = self.selectedMilestone()._keys;
            // console.log(selectedItems);
            // if (selectedItems.size) {
            //     let milestoneId = selectedItems.values().next().value;
            //     let slelectedMilestone = self.milestonesArr().find(mileStone => mileStone.id == milestoneId);
            //     if (slelectedMilestone) {
            //         console.log(slelectedMilestone.selected()[0]);
            //         if (slelectedMilestone.selected()[0]) {
            //             slelectedMilestone.selected([]);
            //         }
            //     }
            // }

        }

        self.onMilestoneBack = function() {
            document.getElementById('milestonesId').classList.add('hideMilestoneContainer');
            document.getElementById('contractsContianerId').classList.add('showContractsContianer');
            document.getElementById('contractsContianerId').classList.remove('hideContractContainer');
        }

        self.acceptInvoiceConfirm = function() {
            document.getElementById('SendRequestInvoiceDialog').close();
            self.selectedMilestones([]);
            self.selectedMilestonesLength(0);
            document.getElementById('milestonesId').classList.add('hideMilestoneContainer');
            document.getElementById('customersContainerId').classList.remove('hideCustomersContainer');
            document.getElementById('customersContainerId').classList.add('showCustomersContainer');
        }

        self.cancelInvoiceConfirm = function() {
            self.milestoneJustification("");
            document.getElementById('SendRequestInvoiceDialog').close();
        }


        self.connected = function() {
            app.isAuthenticated(true);
            getCustomers();
        };

        self.transitionCompleted = function() {};

        self.disconnected = function() {}

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


        function getCustomers() {
            data.get(`https://windis.tk/ords/wtax_hub/WTAXHUB/recv_list`).then((response) => {
                console.log(response);
                response.items.forEach(item => {
                    self.customersArr.push(item);
                });
            }).catch((err) => {
                console.log(err);
            })
        };

    }

    return requestInvoice;
});