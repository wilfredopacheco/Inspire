/**
 * Delete.js
 * src/Actions
 * @author Wilfredo Pacheco
 */

import RequestFailed from "../Components/Alert.RequestFailed.js"
import Alert from "../Components/Alert.js"

export default async function DeleteItem(event){

    event.preventDefault();
    
    const Element = event.target;
    const App = Element.getApp();
    const Callback = Element.UpdateTable;
    const Url = Element.getAttribute('href');
    const ReqDigest = await App.Route.GetRequestDigest();

    if (confirm('Would you like to delete this item?'))
    {
        await App.Route.Delete(Url, ReqDigest)
        .fail(RequestFailed)
        .done((data, textStatus, xhr) => {
            if (xhr.status === 200)
            {    
                $(Element.closest('.modal')).modal('hide');

                Alert({
                    Title: 'Complete', 
                    TitleTimestamp: '', 
                    Body: 'Successfully Removed ', 
                    AutoHide: false,
                    Classes: 'bg-success text-white',
                    Type: textStatus
                });

                if (!!Callback) return Callback();
            }
        });
    }
}