/**
 * CreateElement.js
 * @author Wilfredo Pacheco
 * (C) 2021 WP
 */

/**
 * @name CreateElement
 * @description This method uses document.createElement to return an element based on the arguments passed.
 * 
 * @param {Object} element Options defined by user to create a DOM element.
 * @returns Element object;
 */
export default function CreateElement(arg){

    const message = new Error(); // Used to find caller;

    const {
        tag, // String
        classList, // String
        attributes, // Array
        events, // Array
        customProperties, // Array;
    } = arg;
    
    // Create Elmement;
    const Element = arg.constructor.name === 'Object' ? 
    document.createElement(tag) : 
    arg;


    if (arg.constructor.name === 'Object')
    {
        // Add classes;
        !!classList ? 
        Element.classList = classList : 
        '';
    
        // Add Element properties;
        !!attributes ? 
        attributes.forEach(prop => Element.setAttribute(prop.name, prop.value)) : 
        '';
    
        // Add Element events;
        !!events ? 
        events.forEach(item => Element.addEventListener(item.name, item.action)) : 
        '';
    
        // Fill either the innerText or innerHTML;
        !!arg.innerHTML ? 
        Element.innerHTML = arg.innerHTML : 
        '';
    
        !!arg.innerText ? 
        Element.innerText = arg.innerText : 
        '';
    }

    /**
     * @name SetCustomProperty 
     * @description Used to add custom properties and property values to element; 
     */
    const SetCustomProperty = function SetCustomProperty(prop, value){
        Element[prop] = value;
        return Element;
    }

    /** 
     * @name render
     * @description Used to render the element to the parent defined in the options or the parent passed; 
     * @returns Element object;
     */
    const render = function render(parent){

        if (!!parent 
        && typeof parent === 'object') parent.append(Element);

        else if (!!arg.parent 
        && typeof arg.parent === 'object') arg.parent.append(Element);

        return Element;
    }

    const getOriginalOptions = function getOriginalOptions(){
        return arg;
    }

    /** 
     * @name getCallStack
     * @description Used to get caller information and help developers trouble shoot; 
     * @returns Array;
     */
    const getCallStack = function getCallStack(){
        
        const StackArray = message.stack.split(' '); // Split the string on the space;
        StackArray.shift(); // Remove the error string from the front of the array;

        /** Create a new array from the valid strings; */
        const CallerStack = StackArray.filter(str => !!str && str !== 'at').map(str => {
            str = str.trim().replace(/[()]/gi, '') // Replace the paren from the js file url;

            /** Return the end of the array which includes the file name, col no, line no; */
            if (str.includes('/')) return str.split('/').pop();

            /** Just return the string; */
            else return str;
        });

        /** @returns an filtered array of objects; */
        return CallerStack.map((str, index) => {
            if (!str.includes(':')) return {
                caller: str,
                file: CallerStack[index + 1],
                location: StackArray.find(str => str.includes(CallerStack[index + 1]))?.trim()?.replace(/[()]/gi, '')
            }            
        }).filter(item => !!item)
    }

    !! customProperties ? 
    customProperties.forEach(function(item){
        SetCustomProperty(item.prop, item.value);
    }) : 
    '';

    // Element.SetCustomProperty = SetCustomProperty;
    Element.setCustomProperty = SetCustomProperty;
    Element.render = render;
    Element.getOriginalOptions = getOriginalOptions;
    Element.getCallStack = getCallStack;

    return Element;
}

export function CreateElementNode(element){

    const {
        tag,
        classList,
        attributes,
        events,
    } = element;

    const Element = document.createElementNS('http://www.w3.org/2000/svg', tag)

    // Add classes;
    !!classList ? Element.classList = classList : ''

    // Add Element properties;
    !!attributes ? attributes.forEach(prop => Element.setAttribute(prop.name, prop.value)) : ''

    // Add Element events;
    !!events ? events.forEach(item => Element.addEventListener(item.name, item.action)) : ''

    // Fill either the innerText or innerHTML;
    !!element.innerHTML ? Element.innerHTML = element.innerHTML : ''
    !!element.innerText ? Element.innerText = element.innerText : ''

    return Element;
}