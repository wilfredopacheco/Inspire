/**
 * Component.Social.js
 * @description Used to define the user's social status on SharePoint, requires jQuery;
 * @author Wilfredo Paheco
 */

/**
 * Social
 * @param {string} SiteCollectionUrl Foot url;
 * @param {object} Route Method used to call REST Api;
 * @returns Object of methods used to get the user's social details;
 */
export default function Social(SiteCollectionUrl, Route){
    return {

        /** Sites & Documents; */
        getFollowing: function getFollowing(){
            return Route.Get(`${
                SiteCollectionUrl
            }/_api/social.following`)
            .catch(response => response);
        },
        
        /** Get the people who are following the current user; */
        getFollowers: function getFollowers(){
            return Route.Get(`${
                SiteCollectionUrl
            }/_api/social.following/my/Followers`)
            .catch(response => response);
        },
        
        /** Get the people who the current user is following; */
        getFollowed: function getFollowed(types){

            // User =       (ActorType = 0)
            // Document =   (ActorType = 1)
            // ----- the items below are disabled.....---------//
            // Site =       (ActorType = 2)
            // Tag =        (ActorType = 3)

            return Route.Get(`${
                SiteCollectionUrl
            }/_api/social.following/my/Followed(types=${
                types
            })`)
            .catch(response => response);
        },
        
        /** Get the count of people who the current user is following; */
        getFollwedCount: function getFollwedCount(types){

            types = types ? 
            types : 
            1;

            return Route.Get(`${
                SiteCollectionUrl
            }/_api/social.following/my/FollowedCount(types=${
                types
            })`)
            .catch(response => response);
        },

        /** Get the people who the current user might want to follow; */
        getSuggestions: function getSuggestions(){
            return Route.Get(`${
                SiteCollectionUrl
            }/_api/social.following/my/Suggestions`)
            .catch(response => response);
        },

        /** Get the people who are following a particular user; */
        getFollwersFor: function getFollwersFor(account){
            /** @example: SharepointApi.Social.getFollwersFor('<domain>\\<first>.<last>') */
            return Route.Get(`${
                SiteCollectionUrl
            }/_api/sp.userprofiles.peoplemanager/getfollowersfor(accountName=@v)?@v='${
                account
            }'`)
            .catch(response => response)
            .then(data => data.results);
        },

        /** Finds out whether the People I'm Following list for the current user is public; */
        IsMyPeopleListPublic: function IsMyPeopleListPublic(){
            return Route.Get(`${
                SiteCollectionUrl
            }/_api/sp.userprofiles.peoplemanager/ismypeoplelistpublic`)
            .catch(response => response);
        },

        /** New method: GetUserProfilePropertyFor */
        /** @example 
         * await Route.Social.GetUserProfilePropertyFor(App.User.Entity, 'AccountName'); 
         * 
         * this works too:
         * await Route.Get(`${App.Web.Url}/_api/SP.UserProfiles.PeopleManager/GetMyProperties`, {$select: 'AccountName,PictureUrl'})
         * await Route.Get(`${App.Web.Url}/_api/SP.UserProfiles.PeopleManager/GetMyProperties`, {$select: 'Email,AccountName,PictureUrl,Title'})
         */
        GetUserProfilePropertyFor: function GetUserProfilePropertyFor(LoginName, propertyname = 'PictureURL'){
            return Route.Get(`${
                SiteCollectionUrl
            }/_api/sp.userprofiles.peoplemanager/getuserprofilepropertyfor(accountName=@v, propertyname='${
                propertyname
            }')?@v='${
                LoginName /** LoginName should be encoded; */
            }'`)
            .catch(response => response);
        },

        // $.ajax({
        //     url: "http://<site url>/_api/sp.userprofiles.peoplemanager
        //       /setmyprofilepicture",
        //     type: "POST",
        //     data: arrayBuffer,
        //     processData: false,
        //     headers: {
        //       "accept": "application/json;odata=verbose",
        //       "X-RequestDigest": $("#__REQUESTDIGEST").val(),
        //       "content-length": arrayBuffer.byteLength
        //    },
        //     success: successHandler,
        //     error: errorHandler
        //   });

        init: function init(){
            return Promise.all([
                this.getFollowing(),
                this.getFollowers(),
                this.getFollwedCount(),
                this.IsMyPeopleListPublic(),
            ])
            .then(data => {
                return {
                    Following: data[0],
                    Followers: data[1],
                    FollowedCount: data[2],
                    IsMyPeopleListPublic: [3],
                }
            });
        },
    }
}