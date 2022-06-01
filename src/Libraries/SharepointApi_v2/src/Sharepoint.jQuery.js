/**
 * Sharepoint.jQuery.js
 * @description Header definitions for REST Api calls to Microsoft SharePoint Site Collections.
 * @author Wilfredo Pacheco
 */

import ActiveDirectory from './Component.ActiveDirectory.js';
import ErrorMessage from './Component.ErrorMessages.js';

const beforeSend = function beforeSend(jqXHR, settings){
    console.info('sending | ' + this.type + ' | ' + this.url);
}
const error = function error(jqXHR, textStatus, errorThrown ){
    console.info(jqXHR, textStatus, errorThrown );
}

const complete = function complete(jqXHR, textStatus){
    console.info(textStatus + ' | ' + this.type + ' | ' + this.url);
}

// const blank = function blank(){};
const X_RequestDigest = 'X-RequestDigest'
const Route = {
    method: 'jQuery'
}

export default function SP_jQuery(Headers, SiteCollectionUrl, AjaxOptions){

    if (!Headers) throw new Error(ErrorMessage.MissingHeaders);

    Route.Headers = Headers;
    Route.ActiveDirectory = ActiveDirectory(Route, SiteCollectionUrl);
    // Route.Web = Web;
    // Route.beforeSend = AjaxOptions ? AjaxOptions.beforeSend : blank;
    // Route.error = AjaxOptions ? AjaxOptions.error : blank;
    // Route.complete = AjaxOptions ? AjaxOptions.complete : blank;

    Route.GetRequestDigest = function GetRequestDigest(url){

        const Request = new Object();
        Request.url = `${url || SiteCollectionUrl}/_api/contextinfo`;
        Request.method = 'POST';
        Request.dataType = 'json';
        Request.headers = this.Headers.REQUEST_DIGEST;

        return $.ajax(Request)
        .then(data => data.d.GetContextWebInformation.FormDigestValue);
    }

    Route.Get = function GET(url, data){

        const Request = new Object();
        Request.url = url;
        Request.method = 'GET';
        Request.dataType = 'json';
        Request.data = !data ? '' : data;
        Request.headers = this.Headers.GET;

        return $.ajax(Request)
        .then(data => data.d);
    }

    Route.Post = function POST(url, data, RequestDigest){

        data = typeof(data) === 'string' ? 
        data : 
        JSON.stringify(data);

        if (!RequestDigest) throw new Error(ErrorMessage.MissingRequestDigest);

        const Request = new Object();
        Request.url = url;
        Request.method = 'POST';
        Request.dataType = 'json';

        Request.data = typeof(data) === 'string' ? 
        data : 
        JSON.stringify(data);

        Request.headers = this.Headers.POST;
        Request.headers[X_RequestDigest] = RequestDigest;
        
        return $.ajax(Request);
    }

    Route.Patch = function PATCH(url, data, RequestDigest){
        
        data = typeof(data) === 'string' ? 
        data : 
        JSON.stringify(data);

        if (!RequestDigest) throw new Error(ErrorMessage.MissingRequestDigest);

        const Request = new Object();
        Request.url = url;
        Request.method = 'POST';
        Request.dataType = 'json';

        Request.data = typeof(data) === 'string' ? 
        data : 
        JSON.stringify(data);

        Request.headers = this.Headers.PATCH;
        Request.headers[X_RequestDigest] = RequestDigest;

        return $.ajax(Request);
    }

    Route.Delete = function DELETE(url, RequestDigest){

        if (!RequestDigest) throw new Error(ErrorMessage.MissingRequestDigest);

        const Request = new Object();
        Request.url = url;
        Request.method = 'DELETE';
        Request.headers = this.Headers.DELETE;
        Request.headers[X_RequestDigest] = RequestDigest;

        return $.ajax(Request);
    }

    return Route;
}