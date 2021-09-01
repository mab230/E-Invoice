'use strict';
define(['jquery', 'appConfig'], function($, appConfig) {

    var baseUrl = appConfig.backendUrl;
    var registrationUrl = appConfig.registrationUrl;

    // Note, the appConfig contains a Basic Authentication header. The use of Basic Auth is
    // not recommended for production apps.
    var baseHeaders = appConfig.backendHeaders;

    var localUrl = 'localData/';

    var useMobileBackend = true;

    function setUseMobileBackend(use) {
        useMobileBackend = use;
    }

    let busyRequest = undefined;
    $(document).ajaxStart(function(event) {
        var done = oj.Context.getPageContext().getBusyContext().addBusyState({
            description: event
        });
        busyRequest = done;
    });
    $(document).ajaxStop(function(event) {
        busyRequest && busyRequest();
        busyRequest = undefined;
    });


    function getCustomers() {
        if (useMobileBackend)
            return $.ajax({
                type: 'GET',
                dataType: 'text',
                headers: baseHeaders,
                url: baseUrl + 'customers'
            });
        else {
            return $.ajax(localUrl + 'customers.txt');
        }
    }

    function createCustomer(customer) {
        return $.ajax({
            type: 'POST',
            dataType: 'text',
            headers: baseHeaders,
            data: JSON.stringify(customer),
            url: baseUrl + 'customers',
            contentType: 'application/json; charset=UTF-8'
        });
    }

    function getCustomer(id) {
        if (id) {
            if (useMobileBackend) {
                return $.ajax({
                    type: 'GET',
                    dataType: 'text',
                    headers: baseHeaders,
                    url: baseUrl + 'customers/' + id
                });
            } else {

                var promise = new Promise(function(resolve, reject) {
                    $.get(localUrl + 'customers.txt').done(function(response) {
                        var customers = JSON.parse(response).result;
                        var customer = customers.filter(function(customer) { return customer.id === id; });
                        resolve(JSON.stringify(customer[0]));
                    }).fail(function(response) {
                        reject(response);
                    });
                });

                return promise;
            }
        }

        return $.when(null);
    }

    function getUserProfile() {
        if (useMobileBackend)
            return $.ajax({
                type: 'GET',
                dataType: 'text',
                headers: baseHeaders,
                url: baseUrl + 'users/~'
            });
        else {
            return $.get(localUrl + 'users.txt');
        }
    }

    function updateUserProfile(user) {
        return $.ajax({
            type: 'PATCH',
            headers: baseHeaders,
            url: baseUrl + 'users/~',
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify(user)
        });
    }

    async function getAccountData(accNum) {
        var accounts;
        await $.get(localUrl + 'accounts.txt', function(data) {
            accounts = JSON.parse(data);
        });
        var account = await accounts.filter(acc => acc.account_number == accNum)[0];
        return account;
    }

    /**
     * get operation
     * @param {*} postUrl 
     * @param {*} requestBody 
     */
    function get(url) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: url,
                type: "GET",
                headers: baseHeaders,
                timeout: appConfig.timeout,
                contentType: "application/json; charset=utf-8",
                success: function(response) {
                    resolve(response);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    reject(textStatus, errorThrown);
                }
            })
        });
    };

    /**
     * Post operation
     * @param {*} postUrl 
     * @param {*} requestBody 
     */
    function post(url, requestBody) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: url,
                type: "POST",
                timeout: appConfig.timeout,
                headers: baseHeaders,
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(requestBody),
                success: function(response) {
                    resolve(response);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    reject(textStatus, errorThrown);
                }
            })
        });
    }

    /**
     * Put operation
     * @param {*} postUrl 
     * @param {*} requestBody 
     */
    function put(url, requestBody) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: url,
                type: "PUT",
                timeout: appConfig.timeout,
                headers: baseHeaders,
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(requestBody),
                success: function(response) {
                    resolve(response);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    reject(textStatus, errorThrown);
                }
            })
        });
    }

    return {
        get: get,
        post: post,
        put: put,
        getCustomers: getCustomers,
        getCustomer: getCustomer,
        getUserProfile: getUserProfile,
        updateUserProfile: updateUserProfile,
        setUseMobileBackend: setUseMobileBackend,
        getAccountData: getAccountData
    };

});