/**
 * Actions.Log.js
 * @description Used to track user views grouped by SessionId (UUID) & when stat is set (SessionState.Set.js);
 * @author Wilfredo Pacheco
 */

const App = new Object();
const ListTitle = 'Log';

export async function SetApp(app){
    return Object.assign(App, app);
}

export function DisplayVerbose(params){
    const { isDevMode, VerboseColor, SharePointOptions, ApplicationSettings } = params;
    console.info(`%cDevMode: ${isDevMode}`, VerboseColor);
    console.info(`%cjQuery Version | ${$.fn.jquery}`, VerboseColor);
    console.info(`%cBootstrap Version | ${$.fn.tooltip.Constructor.VERSION}`, VerboseColor);
    console.info(`%cDataTable Version | ${$.fn.DataTable.version}`, VerboseColor);
    console.info(`%cjs-sha256 loaded.`, VerboseColor);
    console.info(`%cpace-js loaded.`, VerboseColor);
    console.info('%c---------------------------- SharePoint REST Api Options ---------------------------------', VerboseColor);
    console.info(SharePointOptions);
    console.info('%c------------------------------- Application Settings -------------------------------------', VerboseColor);
    console.info(ApplicationSettings);
}

export default async function LogActions(event){

    const { Route, UUID, User, TrackUser, Verbose, Web, NeedsInstall } = App;
    
    if (NeedsInstall 
    || !Web?.getListDetails) return;
    
    const List = Web.getListDetails(ListTitle); // List the request is going to;
    if (!List) return; /** If the Log list is not installed, then kill the method; */

    const message = new Error();                // Creates a stack trace;
    const Url = `${List.__metadata.uri}/Items`; // Url used for request;
    const StackTrace = message.stack;
    const RequestBody = {
        __metadata: { type: List.ListItemEntityTypeFullName },
        SessionId: UUID,
        UserKey: User.Entity,
        Message: location.href,
        StackTrace: StackTrace.replace('Error', 'Log'),
    }

    if (TrackUser)                              // Set on index.js;
    {
        const ReqDigest = await Route.GetRequestDigest();
        return Route.Post(Url, RequestBody, ReqDigest)
        .then(data => {
            console.info('Route logged.');
            if (Verbose)                        // Set on index.js;
            {
                console.info(event);
                console.info(data.d);
            }
        })
        .catch(e => {
            console.info(e);
            console.info('Route NOT logged.');
        });
    }
}