/**
 * app.js
 * @author Wilfredo Pacheco
 */

import './src/Libraries/jQuery/jquery-3.4.1.js'

/** This is where you would import all libraries if they support static import statements; */
// import './src/Libraries/jQuery-ui/jquery-ui.js'
// import './src/Libraries/Bootstrap/v4/js/bootstrap.bundle.min.js'
// import './src/Libraries/Chart-js/Chart.bundle.js'

import CreateApp from './app.Create.js'
import LoadSettings, { ApplicationSettings } from './app.Settings.js'

(function(){

    /** Application Options; */
    const Verbose = false;
    const TrackUser = false;

    /** Sharepoint REST Api Web Options passed to SharepoinApi library; */
    const SharePointOptions = new Object();
    SharePointOptions.$select = '*';
    SharePointOptions.$expand = 'Lists,RegionalSettings,CurrentUser,Lists/DefaultView,Folders';
    LoadSettings();

    async function init(){

        /** Verbose property handles application proxy; */
        ApplicationSettings.Verbose = Verbose;

        /** Tracks user views, creates log list items; */
        ApplicationSettings.TrackUser = TrackUser;

        /** Create Application; */
        const App = await CreateApp(ApplicationSettings, SharePointOptions, null);

        if (App)
        { 
            /** NOTE: This is your global App Object; */
            console.info(`***DEVELOPER: The App Object holds all the information and methods for your application, this is a global variable attached to the window Object on the browser. \n\nIt can be accessed by typing window.App or App.`);
            console.info('This is your global App Object:', App);

            /** If you would like to remove global access to the App Object, comment out line 49; */
            Object.assign(window, {App});
            return App;
        }
        else return console.log('%cApp Creation Failed!', 'color: red;');
    }

    window.onload = init;

})();