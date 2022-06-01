/**
 * Uninstall.js
 * @author Wilfredo Pacheco
 */

import CreateElement from "./Element.Create.js";

export function UninstallAction(event){

    const Element = event.target.getApp ? 
    event.target : 
    event.target.closest('button');

    $(Element)
    .attr('disabled', '') // Disable button;
    .html(/*html*/`
    <span class="spinner-border spinner-border-sm" 
          role="status" 
          aria-hidden="true">
    </span> Uninstall Requested`);
    
    return Element.getApp().Uninstall.init();
}

export default function UninstallButton(App){
    return CreateElement({
        tag: 'button',
        classList: 'btn btn-sm btn-outline-danger ml-3 float-right',
        events:[{ name: 'click', action: UninstallAction }],
        customProperties: [{ prop: 'getApp', value: () => App }],
        innerHTML: /*html*/`<!-- Uninstall Button -->
        <img src="/_layouts/15/images/favicon.ico?rev=23" onerror="$(this).fadeOut()"> Uninstall Application`
    });
}

/** Creates li element to fit with administrator theme; */
export function UninstallButtonli(App, parent){

    const li = CreateElement({
        tag: 'li',
        classList: 'nav-item',
        parent
    });

    CreateElement({
        tag: 'a',
        classList: 'nav-link',
        attributes: [
            { name: 'href', value: 'javascript:;' },
            { name: 'role', value: 'tab' },
            { name: 'aria-selected', value: 'false' }
        ],
        events: [{ name: 'click', action: UninstallAction }],
        customProperties: [{ prop: 'getApp', value: () => App }],
        parent: li,
        innerHTML: /*html*/`<!-- Uninstall Button -->
        <img width="16" src="/_layouts/15/images/favicon.ico?rev=23" onerror="$(this).fadeOut()" /> Uninstall Application`
    }).render();

    return li;
}