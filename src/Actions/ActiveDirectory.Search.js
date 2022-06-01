/**
 * ActiveDirectory.Search.js
 * @directory App/Actions
 * @build 2021.01.05
 * (C) 2021 Wilfredo Pacheco
 */

import CreateElement from "./Element.Create.js";

function createSearchPayload(queryString, options){
    
    const defaultOptions = {
        AllowEmailAddresses: false,
        AllowMultipleEntities: true,
        AllUrlZones: false,
        ForceClaims: false,
        MaximumEntitySuggestions: 15,
        PrincipalSource: 15,
        PrincipalType: 5,
        Required: true,
        SharePointGroupID: 0,
        UrlZone: 0,
        UrlZoneSpecified: false,
        WebApplicationID: '{00000000-0000-0000-0000-000000000000}',
    }

    options = Object.assign(defaultOptions, options)

    return '<Request xmlns="http://schemas.microsoft.com/sharepoint/clientquery/2009" SchemaVersion="15.0.0.0" LibraryVersion="15.0.0.0" ApplicationName="Javascript Library">' +
            '<Actions>' +
                '<StaticMethod TypeId="{de2db963-8bab-4fb4-8a58-611aebc5254b}" Name="ClientPeoplePickerSearchUser" Id="0">' +
                    '<Parameters>' +
                        '<Parameter TypeId="{ac9358c6-e9b1-4514-bf6e-106acbfb19ce}">' +
                            '<Property Name="AllowEmailAddresses" Type="Boolean">' + options.AllowEmailAddresses + '</Property>' +
                            '<Property Name="AllowMultipleEntities" Type="Boolean">' + options.AllowMultipleEntities + '</Property>' +
                            '<Property Name="AllUrlZones" Type="Boolean">' + options.AllUrlZones + '</Property>' +
                            '<Property Name="EnabledClaimProviders" Type="Null" />' +
                            '<Property Name="ForceClaims" Type="Boolean">' + options.ForceClaims + '</Property>' +
                            '<Property Name="MaximumEntitySuggestions" Type="Number">' + options.MaximumEntitySuggestions + '</Property>' +
                            '<Property Name="PrincipalSource" Type="Number">' + options.PrincipalSource + '</Property>' +
                            '<Property Name="PrincipalType" Type="Number">' + options. PrincipalType + '</Property>' +
                            '<Property Name="QueryString" Type="String">' + queryString + '</Property>' +
                            '<Property Name="Required" Type="Boolean">' + options.Required + '</Property>' +
                            '<Property Name="SharePointGroupID" Type="Number">' + options.SharePointGroupID + '</Property>' +
                            '<Property Name="UrlZone" Type="Number">' + options.UrlZone + '</Property>' +
                            '<Property Name="UrlZoneSpecified" Type="Boolean">' + options.UrlZoneSpecified + '</Property>' +
                            '<Property Name="Web" Type="Null" />' +
                            '<Property Name="WebApplicationID" Type="String">' + options.WebApplicationID + '</Property>' +
                        '</Parameter>' +
                    '</Parameters>' +
                '</StaticMethod>' +
            '</Actions>' +
            '<ObjectPaths />' +
        '</Request>';
}

var XHR = null;

export default async function SearchActiveDirectory(event){
    
    const element = event.target
    const buttonId = element.getAttribute('data-add-id')
    const App = element.getApp()

    // Check for JUST 'Enter' button;
    if (event.keyCode === 13)
    {
        event.preventDefault()
        return document.querySelector(buttonId)?.click()
    }

    // Check for 'Enter', 'Up', 'Down' buttons;
    if (event.keyCode !== 13 
    && event.keyCode !== 40 
    && event.keyCode !== 38)
    {
        // Check element value is not an empty string;
        if (element.value !== "")
        {
            // **** Note: Our POST request can tell if the data is Obj or Str, your welcome;
            const requestData = createSearchPayload(element.value);
            const Url = App.Web.Url + '/_vti_bin/client.svc/ProcessQuery';
            const ReqDigest = await App.Route.GetRequestDigest();

            // Abort any request in progress;
            if (XHR) XHR.abort();

            // Always keep a log of the request;
            XHR = App.Route.Post(Url, requestData, ReqDigest);

            $(element).autocomplete({
                source: await XHR.catch(e => { /* console.info(e) */ })
                .then(data => {
                    try { // Returns an array of results;
                        return JSON.parse(data[2]).map(account => {
                
                                const { Description } = account;
        
                                // Drop Down data shown under the element;
                                return {
                                    label: Description, // User display title;
                                    value: Description, // User key;
                                    data: account, // Active Directory Object;
                                    getAction: element.liAction // callback;
                                }
                            })
                        }

                    catch (e) { // Catches errors that are a result from a broken promise;
                        return new Array()
                    }
                }),
                open: function(event){

                    const element = this; // This will give us access to 'this' within the forEach;
                    const ElementData = $(element).autocomplete().data(); // Call uiAutocomplete for the element;

                    // bindings is an iterable & can give us all the elements we need;
                    Array.from(ElementData.uiAutocomplete.bindings).forEach(item => {

                        // Since the global 'window' is part of this list, we need to just get HTML elements;
                        if (item.children 
                        && Array.from(item.children).length)
                        {
                            // This is an <li> element with children <div>s holding text assigned by uiAutocomplete;
                            Array.from(item.children).forEach(li => {
                                
                                // Array of results holding .data from Active Directory;
                                const AccountSource = ElementData.uiAutocomplete.options.source;

                                // Object holding the required account data;
                                const result = AccountSource.find(item => item.label === li.innerText); // Item
                                const MissingEmailValue = result?.data?.EntityData?.Email === '';
                                
                                if (result)
                                {
                                    try { // This catches null results for the <li>;
                                        const SpanOptions = MissingEmailValue ? 
                                        {
                                            tag: 'span',
                                            classList: 'text-danger',
                                            innerHTML: /*html*/
                                            ` -- <em class="f12"> ${result.data.DisplayText}</em> ${
                                                document.getIcon('exclamation-circle').outerHTML
                                            }`
                                        } : {
                                            tag: 'span',
                                            innerHTML: /*html*/`
                                             -- <em class="f12"> ${result.data.DisplayText}</em>`
                                        }

                                        const DisplayTextElement = CreateElement(SpanOptions);
                                        li.setAttribute('title', result.data.EntityData.Email);
                                        li.querySelector('div').append(DisplayTextElement);
    
                                    } catch(e){ }
                                }
                            })
                        }
                    })
                },
                // **** Note: This is calling the App.Account.set
                select: function(event, li){
                    li.item.getAction(li.item.data, element, buttonId);
                }
            })

            if (element.isInModal)
            {
                $([...$(element).autocomplete().data().uiAutocomplete.bindings].find(element => $(element).hasClass('ui-front'))).attr('style', 'z-index:2147483647;');
            }

            // The autocomplete is asked to search results after call returns;
            return $(element).autocomplete('search');
        }
    }
}