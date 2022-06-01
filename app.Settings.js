/**
 * App.Settings.js
 * @author Wilfredo Pacheco
 */

import * as colorpalette from './src/Components/ColorPalette.js'

const { origin, hostname, port, pathname } = location;
const useASPX = pathname.includes('.aspx');

/** NOTE: This has been hardcoded to true in order to provide access to the App Object in console; */
export const isDevMode = 
hostname === '127.0.0.1' 
|| port === '8080' 
|| origin.includes('localhost');

export const Copyright = '(C) 2022 SAIC';
export const Version = '2.0';
export const Theme = colorpalette.DHA;
export const VerboseColor = 'color: dodgerblue;';
export const ext = useASPX ? 'aspx' : 'html';
// export const BootstrapVersion = $?.fn?.tooltip?.Constructor?.VERSION;
export const GitHubLink = 'https://github.com/w-pacheco';

/** This is to render an expanded nav bar element; */
export const NavbarExpand = false;

/** Application Icon; */
export const Icon = 'code-slash';

/** Application Name; */
export const Name = 'Template (Lite)';

/** Application Settings; */
export const ApplicationSettings = {
    Build: Version,
    Icon,
    Name,
    ThemeDetails: new Object({...Theme}),
    useASPX,
    Copyright
}

export default async function LoadSettings(){
    
    /** Set page title; */
    document.title = Name;
}