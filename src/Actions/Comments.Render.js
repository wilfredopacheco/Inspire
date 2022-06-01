/**
 * Comments.Render.js
 * @directory App/Actions
 * @build 2021.01.05
 * @author Wilfredo Pacheco
 */

import CommentElement from "../Components/Comment.Element.js"

export default async function RenderTaskComments(ContainerElement){

    const App = ContainerElement.getApp();
    const FK_GUID = ContainerElement.getAttribute('task-guid');
    const { Route, Web } = App;
    const List = Web.getListDetails('Comments');

    return Route.Get(List.Items.__deferred.uri, {
        $select: 'User,UserTitle,Created,UserComment,Author/Title,Author/Id',
        $expand: 'Author/Id',
        $orderby: 'Id desc',
        $filter: `FK_GUID eq '${FK_GUID}'`
    })
    .then(data => {
        const ItemComments = data.results;
        if (!ItemComments.length) ContainerElement.innerText = 'N/A';
        else ContainerElement.innerHTML = '';
        return ItemComments.forEach(comment => ContainerElement.append(CommentElement(comment, Web.CurrentUser.Id)))
    });
}