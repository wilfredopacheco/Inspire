/**
 * Lists.GetCurrentItemCount.js
 * @directory App/src/Actions
 * @build 2021.01.05
 * (C) 2021 Wilfredo Pacheco
 */

export default async function GetCurrentItemCount(Route, List){

    const { uri } = List.__metadata;
    
    return await Route.Get(`${uri}/ItemCount`)
    .then(data => data.ItemCount)
    .catch(response => console.info(response));
}