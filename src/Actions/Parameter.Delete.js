/**
 * Parameter.Remove.js
 * @author Wilfredo Pacheco
 */

import SetHistory from './History.Set.js';

export default function DeleteParameter(key){
    const url = new URL(location);
    if (url.searchParams.get(key)) url.searchParams.delete(key);
    // else if (!url.searchParams.get(key)) url.searchParams.append(key, value);
    return SetHistory(url.href, document.title);
}