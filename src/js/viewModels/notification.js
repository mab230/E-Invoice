'use strict';
define(['ojs/ojcore', 'knockout', 'ModuleHelper', 'dataService', 'appController', 'appUtils', 'ojs/ojarraydataprovider',
'ojs/ojtable', 'ojs/ojdialog', 'ojs/ojinputtext', 'ojs/ojformlayout', 'ojs/ojlabel', 'ojs/ojlabelvalue','ojs/ojbutton','ojs/ojcollapsible', 'ojs/ojlistview','ojs/ojlistitemlayout'
],function(oj, ko, moduleHelper, data, app, appUtils, ArrayDataProvider) {
    function notification(params) {
        var context = this, handleSectionClick;
        self.toggleDrawer = app.toggleDrawer;
        self.parentRouter = params.parentRouter;
        self.scrollElem = document.body;
        var notification_data_array=[{"system_id":"FT20110001511447","release":"26/11/2020","type":"New","status":"Pending","ccy":"EGP","ammount":"10","users":[{"full_name":"Ahmed Sherif Mahmoud","date_and_time":"Oct 7,2020 4:10:27 AM EET","description":"Inputter"},{"full_name":"Ahmed Sherif Mahmoud","date_and_time":"Oct 7,2020 4:10:27 AM EET","description":"Controller"},{"full_name":"Ahmed Sherif Mahmoud","date_and_time":"Oct 7,2020 4:10:27 AM EET","description":"Releaser"}]},{"system_id":"FT20110001511448","release":"04/11/2020","type":"New","status":"Done","ccy":"EGP","ammount":"20","users":[{"full_name":"Ahmed Sherif Mahmoud","date_and_time":"Nov 30,2020 6:24:33 PM EET","description":"Inputter"},{"full_name":"Ahmed Sherif Mahmoud","date_and_time":"Nov 30,2020 6:24:33 PM EET","description":"Controller"},{"full_name":"Ahmed Sherif Mahmoud","date_and_time":"Nov 30,2020 6:24:33 PM EET","description":"Releaser"}]},{"system_id":"FT20110001511449","release":"05/11/2020","type":"New","status":"Done","ccy":"EGP","ammount":"30","users":[{"full_name":"Sherif Rateb Bashar","date_and_time":"Nov 29,2020 6:25:33 PM EET","description":"Inputter"},{"full_name":"Sherif Rateb Bashar","date_and_time":"Nov 29,2020 6:25:33 PM EET","description":"Controller"},{"full_name":"Sherif Rateb Bashar","date_and_time":"Nov 29,2020 6:25:33 PM EET","description":"Releaser"}]},{"system_id":"FT20110001511440","release":"11/11/2020","type":"New","status":"Done","ccy":"EGP","ammount":"40","users":[{"full_name":"Sherif Rateb Bashar","date_and_time":"Sep 29,2020 7:25:33 PM EET","description":"Inputter"},{"full_name":"Sherif Rateb Bashar","date_and_time":"Sep 29,2020 7:25:33 PM EET","description":"Controller"},{"full_name":"Sherif Rateb Bashar","date_and_time":"Sep 29,2020 7:25:33 PM EET","description":"Releaser"}]}]
        self.system_id=ko.observable(params.system_id ? params.system_id:"FT20110001511447" );
        self.transaction=ko.observable(notification_data_array.filter(transaction=>{return transaction.system_id==self.system_id()})[0]);
        self.users=new ArrayDataProvider(self.transaction().users);
    }

    return notification;
});