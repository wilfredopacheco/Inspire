/**
 * App.js
 * @author Wilfredo Pacheco
 */

import { 
    doSomething, 
    doSomethingElse
} from "../Components/Modules.js";

export default function Application(properties, Route, USER){

    /** The following variables are defined on the index.js; */
    const { 
        Name, 
        Build, 
        Icon, 
        ThemeDetails, 
        Verbose, 
        TrackUser, 
        useASPX, 
        Copyright,
        Web
    } = properties;

    this.Name = Name;
    this.Build = Build;
    this.Icon = Icon;
    this.Verbose = Verbose;
    this.TrackUser = TrackUser;
    this.useASPX = useASPX;
    this.Copyright = Copyright;

    /** Utilities; */
    this.doSomething = doSomething;
    this.doSomethingElse = doSomethingElse;
    this.ThemeDetails = ThemeDetails;
    this.Route = Route || null;
    this.User = USER;
    this.Web = Web;
   
    this.Settings = new Object();
    return this;
}