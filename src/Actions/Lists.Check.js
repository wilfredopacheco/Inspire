/**
 * List.Check.js
 * @author Wilfredo Pacheco
 * (C) 2021 WP
 */

import PreloadListData from '../Components/PreloadListData.js'
import Factory, { getSiteCollectionLists } from '../Schema/Factory.js'

/** FIXME: In the future this should be a redirect to the install.html page; */
const SiteCollectionLists = getSiteCollectionLists();

export default async function ListsCheck(App, ListArray){
 
    const { Name, Web } = App;
    /** @example - This is how you would add lists not included in the first version of the application; */
    // if (!App.Web.getListDetails('Categories')) await CreateCategoriesList(App);

    /** Look for missing lists from the SharePoint Web Object; */
    const TotalMissingLists = ListArray.map(ListTitle => !Web.getListDetails(ListTitle)).filter(MissingList => !!MissingList).length;
    const SomeListsAreMissing = (Web.getAllLists().length - 6) < SiteCollectionLists.length;
    const MissingLists = SiteCollectionLists.filter(ListObj => {
        if (!Web.getListDetails(ListObj.List.Title)) return ListObj;
    });

    async function install(AlertMessage){
        App.NeedsInstall = true;
        App.InstallSuccessful = false;
        if (confirm(AlertMessage))
        {
            /** The factory creates all required lists for this application; */
            await Factory(App);
            App.InstallSuccessful = true;
        }

        else
        {
            // document.write(`<div>The application ${App.Title} requires installation.</div>`)
        }
    }
    
    /** 
     * @description Based on the required ListArray passed, if the Web Object is missing any or all the lists,
     * the user is asked if they would like to start the install. Factory is called if the users
     * confirms the install.
     */
    if (SomeListsAreMissing 
    || (ListArray.length && TotalMissingLists >= ListArray.length))
    { await install((`Would you like to install ${Name}?`)); }

    else if (MissingLists.length)
    { await install(`${MissingLists.length} Lists are missing, would you like to install them?`); }

    App.Uninstall = {
        SiteCollectionLists: SiteCollectionLists,
        init: async function(){
            const { Route, Web } = App;
            if (confirm('Are you sure you want to delete all Lists, Columns, & Data?'))
            {
                const ReqDigest = await Route.GetRequestDigest();
                for (const ListDefinition of SiteCollectionLists)
                {
                    const { List } = ListDefinition;
                    const InstalledList = Web.getListDetails(List.Title);
                    await Route.Delete(InstalledList.__metadata.uri, ReqDigest);
                }
                alert('Your application successfully uninstalled! Redirecting to Site Contents!');
                return location.replace(`${Web.Url}/_layouts/15/viewlsts.aspx`);
            }
            else console.warn('Uninstall was cancelled!');
        }
    }
    
    await PreloadListData(App, ListArray);
}