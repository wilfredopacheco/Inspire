/**
 * CSS.Load.js
 * @author Wilfredo Pacheco
 */

import CreateElement from "./Element.Create.js";

function CreateLinkElement(href){
    return CreateElement({
        tag: 'link',
        attributes: [
            { name: 'rel', value: 'stylesheet' },
            { name: 'href', value: href }
        ]
    });
}

export default function LoadCSS(cssArray){

    if (!cssArray
    || typeof cssArray !== 'object' 
    || cssArray.length === 0) return;

    cssArray.forEach(function(file){
        document.head.prepend(CreateLinkElement(file));
    });
}