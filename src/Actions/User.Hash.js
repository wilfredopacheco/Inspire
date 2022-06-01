/**
 * User.Hash.js
 * @directory App/src/Actions
 * @author Wilfredo Pacheco
 * (C) 2020 WP
 */

export default function CreateHash(queryString){
    return sha256(encodeURIComponent(queryString));
}