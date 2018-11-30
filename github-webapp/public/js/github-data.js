var authUser = {
    username: sessionStorage.getItem('user'),
    data: null,
    repos: null,
    contributors: [],
    thumbnail: null,
    followers: null
}

var queueDefault = [1];
var repoQueue = [];
var contributorQueue = [authUser];
var numberOfContributors = 0;
const MAX_NUMBER_OF_CONTRIBUTORS = 12;
const NEW_USER = -1;
const DEFAULT = 1;


$(document).ready(function() {

    //DOM manipulation code

});

$(document).ajaxStop(function() {
    illustrateData();
});

function createSocialGraph()
{
  var loading = '<div class="loader"></div>';
  loading +=  '<p> Loading..this may take up to 60 seconds';
  $("#display").html(loading);

  populateUserData();

}

function populateUserData() {
    console.log("User data");

    $.ajax({
        url: "https://api.github.com/user",
        method: "GET",
        data: {
            "access_token": sessionStorage.getItem('token')
        },
        success: function(data)
        {
          authUser.data = data;
          authUser.thumbnail = data.avatar_url;
          getAuthUserRepos();
        },
        error: function(jqXHR, textStatus, errorThrown) {
           console.log(errorThrown);
        }
    });
}

function getAuthUserRepos() {

    $.ajax({
        url: "https://api.github.com/user/repos",
        method: "GET",
        data: {
            "access_token": sessionStorage.getItem('token')
        },
        success: function(repos) {
            authUser.repos = repos;
            console.log("got repos");
            getContributorsOfUsersInQueue();
        },
        error: function(jqXHR, textStatus, errorThrown) {
           console.log(errorThrown);
        }
    });
}

function getContributors(user) {
  console.log("get contributors");
  for(var i = 0; i < user.repos.length; i++) {
    var repo = user.repos[i];

    $.ajax({
        url: repo.contributors_url,
        method: "GET",
        data: {
            "access_token": sessionStorage.getItem('token')
        },
        success: function(contributors) {

            if (contributors == null)
            {
              return;
            }

            else
            {

              for (var j = 0; j < contributors.length; j++) {

                var contributor = {
                  username: contributors[j].login,
                  repos: null,
                  contributors: [],
                  thumbnail: contributors[j].avatar_url,
                }

                if (isNewContributor(contributor.username, user.contributors)
                    && contributor.username != user.username)
                {
                   user.contributors.push(contributor);
                   console.log("new contributor pushed");

                   if (limitNotReached(queueDefault))
                   {
                     repoQueue.push(contributor);
                   }
                }

              }

              getReposOfUsersInQueue();

            }

        },
        error: function(jqXHR, textStatus, errorThrown) {
           console.log(errorThrown);
        }

    });

  }

}

function isNewContributor(username, contributors) {
console.log("new con");
for (var i = 0; i < contributors.length; i++) {
     if (username === contributors[i].username)
         return false;
       }
 return true;
}

function getRepos(user) {

  $.ajax({
      url: "https://api.github.com/users/" + user.username + "/repos",
      method: "GET",
      data: {
          "access_token": sessionStorage.getItem('token')
      },
      success: function(repos) {
          user.repos = repos;

          if(limitNotReached(queueDefault)){
            contributorQueue.push(user);
            getContributorsOfUsersInQueue();
          }
      },
      error: function(jqXHR, textStatus, errorThrown) {
         console.log(errorThrown);

      }
  });
}


function getContributorsOfUsersInQueue()
{
  console.log("Con queue");
  while(limitNotReached(contributorQueue))
  {
    var user = contributorQueue.shift();
    numberOfContributors++
    getContributors(user);
  }
}

function getReposOfUsersInQueue()
{
  console.log("Repo queue");
  while(limitNotReached(repoQueue))
  {
    var user = repoQueue.shift();
    getRepos(user);
  }
}

function limitNotReached(queue) {

  if (numberOfContributors == MAX_NUMBER_OF_CONTRIBUTORS)
  {
    console.log("LIMIT REACHED");
    return false;
  }
  else if (queue.length < 1)
  {
    console.log("nothing in queue");
    return false;
  }

  return true;

}

function contributorsToD3(d3, user, source) {

  var target = getTarget(d3, user);

  if (target == NEW_USER) {

    var node = {
            name: user.username,
            thumbnail: user.thumbnail,
            group: DEFAULT
        }
        d3.nodes.push(node);
        target = d3.nodes.length-1;

        var link = {
         source: source,
         target: target,
         value: DEFAULT
     }
        d3.links.push(link);

  }

  for (var i = 0; i < user.contributors.length && i < MAX_NUMBER_OF_CONTRIBUTORS; i++)
       contributorsToD3(d3, user.contributors[i], target);
}

function getTarget(d3, user) {
    for (var i = 0; i < d3.nodes.length; i++)
        if (d3.nodes[i].name == user.username)
            return i;
    return NEW_USER;
}

function illustrateData()
{
   console.log("Show");
    var graph = '<svg id="graph" width="' + $("#display").width() + '" height="' + $("#display").width() + '"></svg>';
    $("#display").html(graph);

    var d3 = {
         nodes: [{
             name: authUser.username,
             thumbnail: authUser.thumbnail,
             group: DEFAULT
         }],
         links: []
     }
     contributorsToD3(d3, authUser, 0);
     constructSocialGraph(d3);

}
