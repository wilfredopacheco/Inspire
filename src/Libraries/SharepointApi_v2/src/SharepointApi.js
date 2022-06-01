/**
 * SharepointApi.js
 * @author Wilfredo Pacheco
 */

import WebTools from './Component.WebUtilities.js'
import Social from './Component.Social.js';

export const Title = 'SharepointApi';
export const Version = '2.2';
export const Author = 'Wilfredo Pacheco';
export const Copyright = '\u{00A9} 2020 Wilfredo Pacheco';
export const WebPath = '/_api/Web';

export default function SharepointApi(Options){

    const { SiteCollectionUrl, Route, AjaxMethods, method, verbose } = Options;

    /** Details */
    this.Title = Title;
    this.Version = Version;
    this.Author = Author;
    this.Copyright = Copyright;

    /** Site Info */
    this.Options = Options;
    this.SiteCollectionUrl = SiteCollectionUrl;

    /** Components */
    this.Headers = Headers;

    /** This method is only available when using jQuery; */
    this.Social = method === 'jQuery' ? 
    Social(SiteCollectionUrl, Route) : 
    null;

    this.getMethods = function getMethods(){
        return AjaxMethods;
    }

    this.showAvailableMethods = function showAvailableMethods(){
        return console.table(this.getMethods());
    }

    this.init = function init(options, Url){
        
        /**
        * @param {Web} Holdes all application information
        * FirstUniqueAncestorSecurableObject:
        * RoleAssignments: List of all possible groups available in Sharepoint;
        * AllProperties:
        * AssociatedMemberGroup:
        * AssociatedOwnerGroup:
        * AssociatedVisitorGroup:
        * AvailableContentTypes:
        * AvailableFields:
        * ContentTypes:
        * CurrentUser: Details of user currently logged in;
        * EventReceivers:
        * Features:
        * Fields:
        * Folders: List of available folders from application root;
        * Lists: All available List (tables) in application;
        * ListTemplates:
        * Navigation:
        * ParentWeb: Details of application parent directory;
        * PushNotificationSubscribers: *Will break application if not defined and called;
        * RecycleBin: Collection of any deleted item, folder, list item, file, etc...;
        * RegionalSettings: User regional time settings;
        * RoleDefinitions: List of all roles/permissions and details available to a user;
        * RootFolder: Details for application root folder;
        * SiteGroups: All available groups in Sharepoint;
        * SiteUserInfoList:
        * SiteUsers: All available users in Sharepoint;
        * ThemeInfo: (self explanitory)
        * UserCustomActions:
        * Webs:
        * WebInfos:
        * WorkflowAssociations:
        * WorkflowTemplates:
        */

        options = options ? 
        options : 
        new Object();

        /** Load the site based on the URL passed; */
        Url = Url ? 
        Url + WebPath : 
        SiteCollectionUrl + WebPath;

        /** @returns xhr request; */
        return Route.Get(Url, options)
        .catch(response => {
            const { status, statusText } = response;
            console.info(`Sharepoint Api Error! | ${status} | ${statusText}`)
        })
        .then(data => Object.assign(data, WebTools));
    }

    return new Proxy(this, {
        set: function(target, key, value){
            if (verbose) console.log(`${key} set to:`, value);
            target[key] = value;
            return true;
        },
        get: function(obj, prop){

            /** FIXME: This needs to be completed; */

        //     /** Count every time the get method is called; */
        //     obj.CallCount++

        //     /** If the property on this object is not available create an error to capture the stack; */
        //     if (typeof obj[prop] !== 'boolean' 
        //     && !obj[prop])
        //     {    
        //         const message = new Error();
        //         const StackArray = message.stack.split(' ');
        //         StackArray.shift();

        //         /** Array listing stack; */
        //         const CallerStack = StackArray.filter(str => !!str && str !== 'at').map(str => str.trim());
        //         if (Verbose)
        //         {
        //             console.info(prop, obj[prop])
        //             console.info(CallerStack)
        //         }
        //     }

            /** @returns Value of property called; */
            return obj[prop];
        }
    });
}