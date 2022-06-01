/**
 * Sharepoint.jQuery.min.js
 * @Description Header definitions for REST Api calls to Microsoft SharePoint Site Collections.
 * Microsoft Internet Explorer friendly, gets assigned to the global window Object.
 * @author Wilfredo Pacheco
 */


(function(Route, Headers){

    /** Start Header */
    var CONTENT_TYPE = 'Content-Type';
    var ACCEPT = 'Accept';
    var X_REQUESTDIGEST = 'X-RequestDigest'
    var X_HTTP_METHOD = 'X-HTTP-Method';
    var IF_MATCH = 'IF-MATCH';
    var DELETE = 'DELETE';

    /** Values */
    var CHARSETUTF8 = 'application/json; charset=UTF-8';
    var VERBOSE = 'application/json; odata=verbose';
    var MERGE = 'MERGE';
    var ASTERISK = '*';

    /** GET Headers */
    const SharepointGET_Headers = new Object();
    SharepointGET_Headers[CONTENT_TYPE] = CHARSETUTF8;
    SharepointGET_Headers[ACCEPT] = VERBOSE;

    /** POST Headers */
    const SharepointPOST_Headers = new Object();
    SharepointPOST_Headers[CONTENT_TYPE] = VERBOSE;
    SharepointPOST_Headers[ACCEPT] = VERBOSE;
    SharepointPOST_Headers[X_REQUESTDIGEST] = null;

    /** PATCH Headers */
    const SharepointPATCH_Headers = new Object();
    SharepointPATCH_Headers[CONTENT_TYPE] = VERBOSE;
    SharepointPATCH_Headers[ACCEPT] = VERBOSE;
    SharepointPATCH_Headers[X_HTTP_METHOD] = MERGE;
    SharepointPATCH_Headers[X_REQUESTDIGEST] = null;
    SharepointPATCH_Headers[IF_MATCH] = ASTERISK;

    /** DELETE Headers */
    const SharepointDELETE_Headers = new Object();
    SharepointDELETE_Headers[CONTENT_TYPE] = VERBOSE;
    SharepointDELETE_Headers[ACCEPT] = VERBOSE;
    SharepointDELETE_Headers[X_HTTP_METHOD] = DELETE;
    SharepointDELETE_Headers[X_REQUESTDIGEST] = null;
    SharepointDELETE_Headers[IF_MATCH] = ASTERISK;

    /** REQUEST DIGEST Headers */
    const SharepointREQUESTDIGEST_Headers = new Object();
    SharepointREQUESTDIGEST_Headers[ACCEPT] = VERBOSE;

    /** End Header */
    
    /** Start Route */
    Route = new Object();
    Headers = {
        GET: SharepointGET_Headers,
        POST: SharepointPOST_Headers,
        PATCH: SharepointPATCH_Headers,
        DELETE: SharepointDELETE_Headers,
        REQUEST_DIGEST: SharepointREQUESTDIGEST_Headers,
    }
    
    var Get,
        POST,
        Patch,
        DELETE,
        getRequestDigest,
        getWeb;

    var WebPath = '/_api/web';
    var contextinfoPath = '/_api/contextinfo';
    var URLTOKEN = '/SiteAssets'
    
    /** Properties */
    Route.Headers = Headers;

    getWeb = Route.getWeb = function getWeb(url, data){
        url = location.href.split(URLTOKEN) + WebPath;
        return $.ajax({
            url: url,
            method: 'GET',
            dataType: 'json',
            data: !data ? '' : data,
            headers: Headers.GET,
        });
    }

    getRequestDigest = Route.getRequestDigest = function getRequestDigest(url){
        return $.ajax({
            url: url + contextinfoPath,
            method: 'POST',
            dataType: 'json',
            headers: Headers.REQUEST_DIGEST,
        });
    }
    
    Get = Route.Get = function GET(url, data){
        return $.ajax({
            url: url,
            method: 'GET',
            dataType: 'json',
            data: !data ? '' : data,
            headers: Headers.GET,
        });
    }

    Post = Route.Post = function POST(url, data, RequestDigest){
        return getRequestDigest().done(function(data){
            var headers = Headers.POST;
            headers[X_REQUESTDIGEST] = data.d.GetContextWebInformation.FormDigestValue;
            return $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: typeof(data) === 'string' ? data : JSON.stringify(data),
                headers: headers,
            });
        });
    }

    Patch = Route.Patch = function PATCH(url, data, RequestDigest){
        return getRequestDigest().done(function(data){
            var headers = Headers.PATCH;
            headers[X_REQUESTDIGEST] = data.d.GetContextWebInformation.FormDigestValue;
            return $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: typeof(data) === 'string' ? data : JSON.stringify(data),
                headers: headers,
            });
        });
    }

    DELETE = Route.Delete = function DELETE(url){
        return getRequestDigest().done(function(data){
            var headers = Headers.DELETE;
            headers[X_REQUESTDIGEST] = data.d.GetContextWebInformation.FormDigestValue;
            return $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: typeof(data) === 'string' ? data : JSON.stringify(data),
                headers: headers,
            });
        });            
    }

    /**
     * @reference: https://docs.microsoft.com/en-us/previous-versions/office/developer/sharepoint-rest-reference/dn531432(v=office.15)
     */
    function getQueryStringParameter(paramToRetrieve) {
        var params =
            document.URL.split("?")[1].split("&amp;");
        var strParams = "";
        for (var i = 0; i < params.length; i = i + 1) {
          var singleParam = params[i].split("=");
          if (singleParam[0] == paramToRetrieve)
            return singleParam[1];
        }
    }

    window.Route = Route;
})();