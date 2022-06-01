/**
 * Parameter.Set.js
 * @author Wilfredo Pacheco
 */

import SetHistory from './History.Set.js';

export default function SetParameter(key, value){
    const url = new URL(location);
    if (url.searchParams.get(key)) url.searchParams.set(key, value);
    else if (!url.searchParams.get(key)) url.searchParams.append(key, value);
    return SetHistory(url.href, document.title);
}