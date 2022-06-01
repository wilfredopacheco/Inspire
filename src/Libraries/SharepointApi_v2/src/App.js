/**
 * SharepointApi.js
 * @version 2.2.0
 * @author Wilfredo Pacheco
 */

import Headers from './Component.Headers.js';
import SP_jQuery from './Sharepoint.jQuery.js';
import SP_Fetch from './SharepointApi.fetch.js';
import SP_Ajax from './Sharepoint.xhr.js'
import SharepointApi from './SharepointApi.js'
import defaultOptions from './Component.DefaultOptions.js'

const UrlTokens = ['/SiteAssets', '/SitePages'];
var _jQuery, // _jQuery is defined in the export;
    _Fetch, // _Fetch is defined in the export;
    
    // AjaxMethods should ALWAYS be available;
    AjaxMethods = [{ 
        Title: 'ajax', 
        isAvailable: true 
    }];

function getUrl(UrlTokens){
    const { href } = location;
    let NewUrl = null;
    UrlTokens.forEach(token => {
        if (href.includes(token)) NewUrl = location.href.split(token)[0];
    });
    return NewUrl;
}

export default function (Options){

    Options = !!Options ? 
    Options : 
    defaultOptions;
    
    const SiteCollectionUrl = getUrl(UrlTokens);
    var Route = null;

    try
    { // Check for jQuery.ajax;
        if ($?.fn?.jquery) _jQuery = !!$.fn.jquery;
        if (Options.verbose) console.info(`jQuery Found! | Version: ${$.fn.jquery}`);
    }
    catch(e){ if (Options.verbose) console.warn('jQuery not available!'); }

    try 
    { // Check for fetch method;
        if (window?.fetch) _Fetch = !!window.fetch;
    }
    catch(e){ if (Options.verbose) console.warn('Fetch not available!'); }

    AjaxMethods.push({ Title: 'jQuery', isAvailable: !!_jQuery }); // Add jQuery results;
    AjaxMethods.push({ Title: 'fetch', isAvailable: !!_Fetch }); // Add Fetch results;

    if (Options.verbose) console.table(AjaxMethods); // Display methods array in console;

    function isMethodAvailable(queryString){
        return AjaxMethods.find(m => m.Title === queryString)?.isAvailable;
    }
    
    /** If jQuery is requested & available; */
    if (Options.method === 'jQuery' 
    && isMethodAvailable('jQuery')) Route = SP_jQuery(Headers, SiteCollectionUrl);

    /** If fetch is available && requested OR jquery is requested but not available; */
    else if (isMethodAvailable('fetch') 
    && Options.method === 'fetch' 
    || Options.method === 'jQuery' 
    && !isMethodAvailable('jQuery')) Route = SP_Fetch(Headers, SiteCollectionUrl);

    else if (Options.method === 'xhr' 
    || !isMethodAvailable('jQuery') && !isMethodAvailable('fetch'))
    {
        if (Options.verbose) console.info('Use Ajax!');
        Route = SP_Ajax;
    }

    /** Notify the user the method requested was not available, then assign what the app selected; */
    if (Options.method !== Route?.method)
    {
        console.warn(`${Options.method} was not available, your requests will use: ${Route?.method}!`);
        Options.method = Route.method;
    }

    Options.SiteCollectionUrl = SiteCollectionUrl;
    Options.Route = Route;
    Options.AjaxMethods = AjaxMethods;

    Route = Object.assign(new SharepointApi(Options), Route);
    
    console.info(`%c${
        Route.Title
    } | v${
        Route.Version
    } | ${
        Route.method
    } | ${
        Route.Copyright
    }`, 'color: orange;');
    // 'background: #222; color: #43CBFF;'

    return Route;
}