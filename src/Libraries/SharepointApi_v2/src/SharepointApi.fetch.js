/**
 * Sharepoint.fetch.js
 * @description Header definitions for REST Api calls to Microsoft SharePoint Site Collections.
 * @author Wilfredo Pacheco
 */

import ActiveDirectory from './Component.ActiveDirectory.js';
import ErrorMessage from './Component.ErrorMessages.js'

const Route = {
    method: 'fetch'
}

export default function SP_Fetch(HeaderDefinitions, SiteCollectionUrl, AjaxOptions){

    if (!HeaderDefinitions) throw new Error(ErrorMessage.MissingHeaders);

    Route.Headers = HeaderDefinitions;
    Route.ActiveDirectory = ActiveDirectory(Route, SiteCollectionUrl);

    Route.GetRequestDigest = function GetRequestDigest(Url){
        Url = Url || SiteCollectionUrl + '/_api/contextinfo';
        return fetch(Url, {
            method: 'POST',
            headers: { "Accept": "application/json; odata=verbose" }
        })
        .then(data => data.json())
        .then(data => data.d.GetContextWebInformation.FormDigestValue);
    }

    Route.Get = function Get(Url, Options){
        if (Options 
        && typeof Options === 'object')
        {
            Url = `${Url}?${
                Object.entries(Options)
                .map(e => `${e[0]}=${e[1]}`)
                .join('&')
            }`
        }

        return fetch(Url , {
            method: 'GET',
            // body: Options,
            headers: HeaderDefinitions.GET
        })
        .then(data => data.json())
        .then(data => data.d);
    }

    Route.Post = function Post(Url, data, RequestDigest){

        data = typeof(data) === 'string' ? 
        data : 
        JSON.stringify(data);

        if (!RequestDigest) throw new Error(ErrorMessage.MissingRequestDigest);

        const HEADER = HeaderDefinitions.POST;
        HEADER["X-RequestDigest"] = RequestDigest;

        return fetch(Url, {
            method: 'POST',
            body: data,
            headers: HEADER
        })
        .then(data => data.json());
    }

    Route.Patch = function Patch(Url, data, RequestDigest){

        if (!RequestDigest) throw new Error(ErrorMessage.MissingRequestDigest);

        data = typeof(data) === 'string' ? 
        data : 
        JSON.stringify(data);

        const HEADER = HeaderDefinitions.PATCH;
        HEADER["X-RequestDigest"] = RequestDigest;

        return fetch(Url, {
            method: 'POST',
            body: data, // body data type must match "Content-Type" header
            headers: HEADER
        });
        // .then(data => data.json());
    }

    Route.Delete = function DELETE(Url, RequestDigest){
        
        if (!RequestDigest) throw new Error(ErrorMessage.MissingRequestDigest);

        const HEADER = HeaderDefinitions.DELETE;
        HEADER["X-RequestDigest"] = RequestDigest;
        
        return fetch(Url, {
            method: 'POST',
            headers: HEADER
        });
    }

    return Route;
}