/**
 * SessionState.Set.js
 * @author Wilfredo Pacheco
 */

import LogActions from "./Actions.Log.js";

export default function SetSessionState(event){
    
    /** Sets the hash on the url so users can copy past a link; */
    location.hash = event.currentTarget.title;

    LogActions(event);

    /** This sets the session storage to where the user left off; */
    return sessionStorage.setItem(location.origin, event.currentTarget.id);
}