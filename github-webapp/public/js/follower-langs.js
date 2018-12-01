
var followerQueue = [];
var followerRepoQueue = [];
var followerLanguageQueue = [];
var langs = [];
var authUserLangs = [];
var authUserRepoQueue = [];
var authUserLanguageQueue = [];
//var sumLanguageFrequencies;
var topFollowerLangs;

$(document).ready(function() {

    //DOM manipulation code

});

$(document).ajaxStop(function() {

topFollowerLangs = getTopLanguages(langs);
topUserLangs = getTopLanguages(authUserLangs);
console.log(JSON.stringify(topFollowerLangs));
console.log(JSON.stringify(topUserLangs));
constructDonutChart(topFollowerLangs, "Across your follower's repos");
constructDonutChart(topUserLangs, "Across your repos");


});

function getFollowers() {

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
               getReposLinks(followerQueue, followerRepoQueue, followerLanguageQueue, langs);
           },
           error: function(jqXHR, textStatus, errorThrown) {
              console.log(errorThrown);
           }
       });

       if (i == 20)
       {
         i = authUser.followers.length;
       }

    }

}

function  getReposLinks(userQueue, repoQueue, languageQueue, languageStore) {

    while (userQueue.length > 0)
    {
      var currentFollower = userQueue.shift();
       for (var j = 0; j < currentFollower.repos.length; j++)
       {
         var currentRepo = currentFollower.repos[j].url;
         repoQueue.push(currentRepo);
         getLanguages(repoQueue, languageQueue, languageStore);
         console.log(currentRepo);

       }
    }
}

function  getLanguages(repoQueue, languageQueue, languageStore) {

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


          languageQueue = $.map(languages,function(v,k) { return k; });
          while (languageQueue.length > 0)
          {
            var currentLang = languageQueue.shift();
            languageStore.push(currentLang);
            console.log(currentRepo);
            console.log(currentLang);
          }

        },
        error: function(jqXHR, textStatus, errorThrown) {
           console.log(errorThrown);
        }
    });

  }
}

function getTopLanguages(data) {

  var frequency = getFrequency(data);
  var languageKeys = frequency[0];
  var languageFrequencies = frequency[1];
  //sumLanguageFrequencies = languageFrequencies.reduce((a, b) => a + b, 0);
  var languageFreqObj = languageKeys.map(function (x, i) {
                          return [x, languageFrequencies[i]]
                      });
   var sortedLangFrequency = languageFreqObj.sort((a, b) => b[1] - a[1]);
   console.log(JSON.stringify(sortedLangFrequency));
   if (sortedLangFrequency.length >= 12)
   {
   return sortedLangFrequency.slice(0, 12);
    }
     else
     {
       return sortedLangFrequency
     }

}

function getFrequency(arr) {
    var a = [], b = [], prev;

    arr.sort();
    for ( var i = 0; i < arr.length; i++ ) {
        if ( arr[i] !== prev ) {
            a.push(arr[i]);
            b.push(1);
        } else {
            b[b.length-1]++;
        }
        prev = arr[i];
    }

    return [a, b];
}


function getAuthUserRepoLinks()
{
  var userQueue = [authUser];
  getReposLinks(userQueue, authUserRepoQueue, authUserLanguageQueue, authUserLangs);

}
