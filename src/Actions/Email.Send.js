/** 
 * Email.Send.js
 * 
 * @author Wilfredo Pacheco
 * 
 * NOTE: 
 * The following locations hold the service needed to run this method;
 * Both have been tested successfully;
 * 
 * /_vti_bin/client.svc/sp.utilities.utility.SendEmail
 * /_api/SP.Utilities.Utility.SendEmail
 */

export default async function SendEmail(App, Email){

    const { origin } = location;
    const { Web, Route } = App;

    const Url = `${
        origin + Web.ServerRelativeUrl
    }/_vti_bin/client.svc/sp.utilities.utility.SendEmail`;

    const ReqDigest = await Route.GetRequestDigest();
    const Request = { 
        properties: Email 
    };

    return Route.Post(Url, Request, ReqDigest)
    .fail(error => console.info(error));
}