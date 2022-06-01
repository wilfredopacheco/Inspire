/**
 * Metatags.Add.js
 * @description Adds meta tag with attributes to prevent render errors on browsers including internet explorer;
 * @author Wilfredo Pacheco
 */

// export const SPACE = '\u0020';
export default function AddMetaTags(Version, Copyright){
    
    const head = document.querySelector('head');
    
    // NOTE: Not used in the carepoint environment;
    // const meta = document.createElement('meta');
    // meta.setAttribute('http-equiv', 'x-ua-compatible')
    // meta.setAttribute('content', 'IE=edge')
    // head.prepend(meta)

    const CopyrightComment = document.createComment(`${Copyright}`);
    const VersionComment = document.createComment(`version-${Version}`);

    head.prepend(CopyrightComment);
    head.prepend(VersionComment);

    return;
}