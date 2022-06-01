/**
 * App.User.Set.js
 * @directory App/src/Actions
 * @build 2022.02.07
 * @author Wilfredo Pacheco
 * (C) 2020 WP
 */

import User from "../Models/User.js";
import CreateHash from "./User.Hash.js";

var CurrentUser;

export default function SetUser(SiteData, ADResult){

    if (SiteData && ADResult)
    {
        CurrentUser = new User(SiteData.CurrentUser.LoginName, ADResult);
        
        ADResult.forEach(account => {

            const KeyHash = CreateHash(account.Key);
            const MailHash = CreateHash(account.EntityData.Email);
            const HeaderStr = account.DisplayText.split(' ');

            HeaderStr.pop() // Removes (US) from title;
            HeaderStr.pop() // Removes Command: RHC-C from title;
            HeaderStr.pop() // Removes MEDCOM from title;

            CurrentUser.Title = account.DisplayText;
            CurrentUser.HeaderTitle = HeaderStr.join(' ');
            CurrentUser.KeyChain.push(KeyHash);
            CurrentUser.KeyChain.push(MailHash);

            if (encodeURIComponent(account.Key) === CurrentUser.Entity) CurrentUser.Account = account;
        })
        
        /** Provides a unique array of keys; */
        CurrentUser.KeyChain = Array.from(new Set(CurrentUser.KeyChain)); // Provides a unique array of keys;
    }

    else CurrentUser = new User();

    return CurrentUser;
}