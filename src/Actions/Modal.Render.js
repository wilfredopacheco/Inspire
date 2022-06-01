/**
 * App.RenderModal.js
 * @directory App/Actions
 * @build 2021.01.05
 * @author Wilfredo Pacheco
 */

import LogActions from './Actions.Log.js'
import CreateModal from './Modal.Create.js'

export default function RenderModal(App){

    const Modal = CreateModal();

    document.querySelector('body').append(Modal);
    
    App.modalElementId = '#app-modal';
    App.modalTitleId = '#modal-title';
    App.modalBodyId = '#modal-body';
    App.modalFooterId = '#modal-footer';

    // Tasker App Specific Settings;
    $(App.modalElementId + ' div.modal-body').addClass('p-3');
    $(Modal).on('shown.bs.modal', function (event) {
        LogActions(event);
    });
}