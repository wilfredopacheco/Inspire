/**
 * UserSettings.Get.js
 * @directory App/src/Actions
 * @author Wilfredo Pacheco
 */

var SettingsURL;

function CustomSettings(){
    this.DarkMode = false;
    this.Theme = null;
    return this;
}

export async function UpdateSettings(App, CurrentUserSettings){

    const { Route, Web, User } = App;
    const List = Web.getListDetails('UserSettings');
    const ReqDigest = await Route.GetRequestDigest();
    
    return Route.Patch(SettingsURL, {
        UserKey: User.KeyChain[0],
        Settings: JSON.stringify(CurrentUserSettings),
        __metadata: { type: List.ListItemEntityTypeFullName }
    }, ReqDigest);
}

export async function CreateUserSettings(App, CurrentUserSettings){

    const { Route, Web, User } = App;
    const List = Web.getListDetails('UserSettings');
    const ReqDigest = await Route.GetRequestDigest();
    return Route.Post(`${List.__metadata.uri}/Items`, {
        UserKey: User.KeyChain[0],
        Settings: JSON.stringify(CurrentUserSettings),
        __metadata: { type: List.ListItemEntityTypeFullName }
    }, ReqDigest).then(data => {
        SettingsURL = data.d.__metadata.uri;
    });
}

export default function GetUserSettings(App){
    if (!App.Web) return [];
    const { Route, Web, User } = App;
    const { Url } = Web;
    const ListUrl = `${Url}/_api/Web/Lists/getByTitle('UserSettings')`;
    
    return Route.Get(`${ListUrl}/Items`, {
        $select: '*',
        $top: 1,
        $filter: `UserKey eq '${User.KeyChain[0]}'`
    })
    .then(data => {
        
        let CurrentUserSettings;

        if (data.results.length) 
        { /** If a result is found, that item is assigned; */
            const SettingsValue = Object.assign(new CustomSettings(), data.results[0]);
            SettingsURL = SettingsValue.__metadata.uri;
            CurrentUserSettings = JSON.parse(SettingsValue.Settings);
        }

        else 
        { /** An item for this user is created; */
            CurrentUserSettings = new CustomSettings();
            CreateUserSettings(App, CurrentUserSettings);
        }

        /** @returns CurrentUserSettings with proxy that will update the list item when updated; */
        return new Proxy(CurrentUserSettings, {
            
            /** Track changes to the current user's custom settings; */
            set: function(target, key, value){

                /** The timeout allows the method to run, and update the new value on the list; */
                setTimeout(function(){
                    UpdateSettings(App, CurrentUserSettings);
                }, 200);
                
                target[key] = value;
                return true;
            }
        });
    })
    .catch(e => {
        console.info(e); 
        return {};
    });
}