/**
 * App.Modal.Create.js
 * @directory App/Actions
 * @build 2021.01.05
 * @author Wilfredo Pacheco
 */

import CreateElement from "./Element.Create.js"

// div.modal.show { transition: opacity 75ms linear; }

export function MakeDraggable(ModalHeader){
    
    // Give the header the cursor: move; inform user know it can be dragged;
    ModalHeader.setAttribute('style', 'cursor: move;');
    
    $(ModalHeader).on("mousedown", function(mousedownEvt) {
        var $draggable = $(this);
        var x = mousedownEvt.pageX - $draggable.offset().left,
            y = mousedownEvt.pageY - $draggable.offset().top;
        $("body").on("mousemove.draggable", function(mousemoveEvt) {
            $draggable.closest(".modal-dialog").offset({
                "left": mousemoveEvt.pageX - x,
                "top": mousemoveEvt.pageY - y
            });
        });
        $("body").on("mouseup", function() {
            $("body").off("mousemove.draggable");
        });
        $draggable.closest(".modal").on("hidden.bs.modal", function(event){
            $("body").off("mousemove.draggable");
            // Reset the modal since it is used throught the application;
            $draggable.closest(".modal-dialog").css({
                top: 0,
                left: 0
            });
        });
    });

    // TODO: Start resize feature for modal;
    // overflow: scroll;
    // $(ModalHeader).closest('.modal-content').resizable({
    //     alsoResize: '.modal-header, .modal-body, .modal-footer'
    // })
}

export default function CreateModal(options){

    const defaultOptions = { modalId: 'app-modal', isDraggable: true };

    options = options || defaultOptions;

    const { isDraggable } = options;
    const modalConent = CreateElement({tag: 'div', classList: 'modal-content'});
    const modalHeader = CreateElement({tag: 'div', classList: 'modal-header'});
    
    const modalFooter = CreateElement({
        tag: 'div',
        classList: 'modal-footer',
        attributes: [{ name: 'id', value: 'modal-footer' }]
    });
    
    const modalBody = CreateElement({
        tag: 'div',
        classList: 'modal-body',
        attributes: [{ name: 'id', value: 'modal-body' }]
    });

    const modalContainer = CreateElement({
        tag: 'div',
        classList: 'modal fade',
        attributes: [
            { name: 'id', value: options.modalId },
            { name: 'tabindex', value: '-1' },
            { name: 'role', value: 'dialog' },
            { name: 'aria-labelledby', value: 'app-modalLabel' },
            { name: 'aria-hidden', value: 'true' }
        ]
    });

    const modalDialog = CreateElement({
        tag: 'div',
        classList: 'modal-dialog modal-xl',
        // classList: 'modal-dialog modal-dialog-zoom modal-xl',
        attributes: [{ name: 'role', value: 'document' }]
    });

    const Title = CreateElement({
        tag: 'div',
        classList: 'modal-title',
        attributes: [{ name: 'id', value: 'modal-title' }]
    });

    const CloseBtn = CreateElement({
        tag: 'button',
        classList: 'close',
        innerHTML: '<span aria-hidden="true">&times;</span>',
        attributes: [
            { name: 'type', value: 'button' },
            { name: 'data-dismiss', value: 'modal' },
            { name: 'aria-label', value: 'Close' }
        ]
    });
            
    modalHeader.append(Title);
    modalHeader.append(CloseBtn);
    modalConent.append(modalHeader);
    modalConent.append(modalBody);
    modalConent.append(modalFooter);
    modalDialog.append(modalConent);
    modalContainer.append(modalDialog);

    if (isDraggable) MakeDraggable(modalHeader);

    return modalContainer;
}