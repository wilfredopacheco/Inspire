/**
 * App.User.KeyChain.js
 * @directory App/Actions
 * @build 2021.01.05
 * (C) 2020 Wilfredo Pacheco
 */

import CreateHash from "./App.User.Hash.js";

export default function CreateUserKeyChain(CurrentUser){

    function User(LoginName){
        this.Entity = encodeURIComponent(LoginName);
        this.KeyChain = [CreateHash(LoginName)];
        this.isAdmin = false;
    }

    return new User(CurrentUser.LoginName);
}