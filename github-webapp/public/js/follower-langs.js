
var followerQueue = [];
var repoQueue = [];
var languageQueue = [];

$(document).ready(function() {

    //DOM manipulation code

});

$(document).ajaxStop(function() {

});

function getAuthUserFollowers() {

    $.ajax({
        url: "https://api.github.com/user/followers",
        method: "GET",
        data: {
            "access_token": sessionStorage.getItem('token')
        },
        success: function(followers) {
            authUser.followers = followers;
            console.log("got followers");
            getFollowerRepos();
        },
        error: function(jqXHR, textStatus, errorThrown) {
           console.log(errorThrown);
        }
    });
}

function  getFollowerRepos() {

    for (var i = 0; i < authUser.followers.length; i++)
    {


       var follower = {
         username:  authUser.followers[i].login,
         repos: null,
         thumbnail:  authUser.followers[i].avatar_url
       }

       console.log(follower.username);

       $.ajax({
           url: "https://api.github.com/users/" + follower.username + "/repos",
           method: "GET",
           data: {
               "access_token": sessionStorage.getItem('token')
           },
           success: function(repos) {
               follower.repos = repos;
               console.log("got follower repos");
               followerQueue.push(follower);
               getReposLinks();
           },
           error: function(jqXHR, textStatus, errorThrown) {
              console.log(errorThrown);
           }
       });

    }
      console.log("hello");

}

function  getReposLinks() {

    while (followerQueue.length > 0)
    {
      var currentFollower = followerQueue.shift();
       var language = {
         name:  null,
         usage: null
       }
       for (var j = 0; j < currentFollower.repos.length; j++)
       {
         var currentRepo = currentFollower.repos[j].url;
         repoQueue.push(currentRepo);
         getLanguages();
         console.log(currentRepo);

       }
    }
}

function  getLanguages() {

  while (repoQueue.length > 0)
  {
      var currentRepo= repoQueue.shift();

    $.ajax({
        url: currentRepo + "/languages",
        method: "GET",
        data: {
            "access_token": sessionStorage.getItem('token')
        },
        success: function(languages) {

        
          var keys = $.map(languages,function(v,k) { return k; });

          languageQueue.push(languages);
          var lang = languages.Java;
          console.log(keys[0]);

        },
        error: function(jqXHR, textStatus, errorThrown) {
           console.log(errorThrown);
        }
    });


  }




}
