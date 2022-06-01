/**
 * PageLinks.Set.js
 * @description Used to set the page extentions used by this application;
 * @author Wilfredo Pacheco
 */

export var ErrorLink = 'src/Pages/Error.Graph.html';
export var MarkdownLink = 'src/Pages/MD.FileReader.html?File=README';

export default function SetPageLinks(App){
    const { useASPX } = App;
    if (useASPX)
    {
        ErrorLink = 'src/Pages/Error.Graph.aspx';
        MarkdownLink = 'src/Pages/MD.FileReader.aspx?File=README';
    }
}