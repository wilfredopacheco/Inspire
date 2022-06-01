/**
 * Comment.Save.js
 * @directory App/Actions
 * @build 2021.01.05
 * @author Wilfredo Pacheco
 */

import RequestFailed from "../Components/Alert.RequestFailed.js"
import Alert from "../Components/Alert.js"
import RenderTaskComments from "./Comments.Render.js"

export default async function SaveComment(event){

    const element = event.target;
    // const App = element.getApp()
    const Task = element.getData();
    // const CheckboxContainer = element.getCheckboxContainer()
    const { Route, Web } = element.getApp();

    const textareaElement = element.getFormElement();
    const List = Web.getListDetails('Comments');
    // const CheckboxInputs = Array.from(CheckboxContainer.querySelectorAll('input'))

    // const EmailArray = CheckboxInputs
    // .map(contact => { // List of input elements;
    //     if ( contact.checked ){ return CheckboxContainer.Emails[contact.name] }
    // })
    // .filter(result => !!result).join(' ')

    // const UniqueEmails = EmailArray.split(';')
    // .map(email => email.trim())
    // .filter(contact => !!contact)

    const request = {
        __metadata: { type: List.ListItemEntityTypeFullName },
        // FK_TaskerNr: Task.TaskerNr,
        FK_GUID: Task.GUID,
        User: document.User.Account.Key.split('\\')[1],
        UserTitle: document.User.Title,
        UserComment: textareaElement.value,
        // SendTo: [... new Set(UniqueEmails)].join('; ') + ';'
    }

    // Disable submit button;
    $(element)
    .attr('disabled', '')
    .html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending Request');

    // Disable textarea element;
    textareaElement.setAttribute('disabled', '');

    const RequestDigest = await Route.GetRequestDigest(App.Web.Url);

    await Route.Post(List.Items.__deferred.uri, request, RequestDigest)
    .fail(RequestFailed)
    .done(( data, status, xhr ) => {

        textareaElement.removeAttribute('disabled');
        element.removeAttribute('disabled');
        element.innerText = 'Save Comment';

        if ( xhr.status >= 200 && xhr.status < 300 ){

            Alert({
                Title: 'Complete', 
                TitleTimestamp: '', 
                Body: 'Comment Added to Tasker: #' + Task.TaskerNr, 
                AutoHide: false,
                Classes: 'bg-success text-white',
                Type: status
            });

            // Hide the comment section and clear the text area;
            element.getHideElement().click();
            textareaElement.value = '';

            RenderTaskComments(element.getDisplayElement());
        }
    });
}