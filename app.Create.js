/**
 * App.Create.js
 * @description Creates application;
 * @author Wilfredo Pacheco
 * @build 2021.12.10
 */

import Application from "./src/Models/Application.js"
// import RenderDOM from './app.DOM.Render.js';

/** 
 * SharepointApi
 * @description This is custom library created for this application,
 * jQuery is prefered and will switch to fetch if not found. This can be
 * substituted by the developer by any method BUT must be done before 
 * development starts to prevent errors.
 */
import SharepointApi from "./src/Libraries/SharepointApi_v2/src/App.js";

var USER = null;

export default async function CreateApp(properties, Options, Route){
    
    const { Name } = properties;
    
    /** NOTE: This method COULD also be defined from the app.js; */
    Route = Route || SharepointApi({
        method: 'jQuery',
        verbose: false
    });

    // **** Note: This is a SharepointWeb Object;
    const SiteData = await Route.init(Options).catch(data => null);
    USER = SiteData?.CurrentUser;
    properties.Web = SiteData;
    
    const App = new Application(properties, Route, USER);
    /** 
     * Note: 
     * The user object is added to the DOM and frozen securing the data and allowing global access when needed;
     * Adding the user Object to the DOM may no longer be necessary;
     */
    document.User = USER;
    document.Title = Name;
    document.SiteId = SiteData.Id;
    /** Start Render DOM; */

    // This is where you would call your method to add elements on the DOM;
    // Example: RenderDOM();

    /** End Render DOM; */
    return App;
}