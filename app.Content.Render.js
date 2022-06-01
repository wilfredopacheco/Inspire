/**
 * App.RenderContent.js
 * @directory App/Actions
 * @build 2022.01.20
 * @author Wilfredo Pacheco
 */

import RenderModal from './src/Actions/Modal.Render.js'
import { AlertInit } from './src/Components/Alert.js'
import { ReplaceLocation } from './src/Actions/History.Set.js'
import SetPageLinks from './src/Actions/PageLinks.Set.js'
import HomeContent from './src/Views/Home.js'
import SettingsContent from './src/Views/Settings.js'
import AdminTab from './src/Views/Administrator/Tab.js'
// import ListSettingsTab from './src/Views/ListSettings.js'
import Log from './src/Views/Log/Tab.js'

// import StaffRoster from '../Views/StaffRoster/Tab.js'
// import AERPProjectsTab from '../Views/AERPProjects/Tab.js'
// import Groups from '../Views/Groups/Tab.js'
// import OrgStructure from '../Components/OrgStructure.js'
// import ReccurringTasks from '../Views/RecurringTasks/Tab.js'
// import ComplexityCalculator from '../Views/CMDComplexityCalculator/Tab.js'
// import Reports from '../Views/Reports/Tab.js'
// import Organization from '../Views/Organization/Tab.js'
// import Leadership from '../Views/Leadership/Tab.js'

export default async function RenderContent(App){
    
    const { User } = App;
    const { hash, origin } = location;
    const HASH = '#';

    RenderModal(App);  // Modal;
    SetPageLinks(App); // Dynamically set page ext (.html, .aspx);
    HomeContent(App);  // Render Application Content;
    /** Start - Tab Views */
   
    /** End - Tab Views */
    SettingsContent(App);
    
    if (User.isAdmin 
    || User.isDeveloper) AdminTab(App);

    AlertInit(); /** Renders the container for application alerts; */

    /** Selects the tab if using a URL string; */
    if (hash)
    {
        const TabIdStr = hash.replace(HASH, '').toLowerCase();
        const TabElement = document.querySelector(`${HASH}v-pills-${TabIdStr}-tab`);
        TabElement?.click();
    }
    
    /** Selects the tab where the user left off; */
    else if (sessionStorage.getItem(origin)) document.querySelector(HASH + sessionStorage.getItem(origin)).click();

    /** Handle URL parameters added when modal is shown; */
    $(App.modalElementId).on('hidden.bs.modal', function (event) {

        /**
         * Since the css for the Task progress from AERP v2.0 messes with bootstrap css,
         * this is will empty the modal body everytime its closed; 20220401
         * @author Wilfredo Pacheco
         */
        $(App.modalBodyId).empty();

        const tokens = ['GUID', 'Id', 'ID'];
        const url = new URL(location);
        tokens.forEach(token => {
            if (url.searchParams.get(token)) url.searchParams.delete(token);
        });

        ReplaceLocation(url);
    });
}