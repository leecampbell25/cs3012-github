var AuthUser = {
    username: sessionStorage.getItem('user'),
    data: null,
    repos: null,
    contributors: [],
    thumbnail: null
}
var queueDefault = [1];
var repoQueue = [];
var contributorQueue = [];
var numberOfContributors = 0;
const MAX_NUMBER_OF_CONTRIBUTORS = 10;



$(document).ready(function() {

    //DOM manipulation code
   populateUserData();

});

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
          AuthUser.data = data;
          AuthUser.thumbnail = data.avatar_url;
          getAuthUserRepos();
        },
        error: function(jqXHR, textStatus, errorThrown) {
           console.log(errorThrown);
           alert('Error');
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
            AuthUser.repos = repos;
            console.log("got repos");
            getContributors(AuthUser);
        },
        error: function(jqXHR, textStatus, errorThrown) {
           console.log(errorThrown);
           alert('Error');
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
                   getRepos(contributor);
                }

                if (limitNotReached(queueDefault))
                {
                  repoQueue.push(contributor);
                }
              }

              getReposOfUsersInQueue();

            }

        },
        error: function(jqXHR, textStatus, errorThrown) {
           console.log(errorThrown);
           alert('Error');
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
         alert('Error');
      }
  });



}


function getContributorsOfUsersInQueue()
{
  while(limitNotReached(contributorQueue))
  {
    var user = contributorQueue.shift();
    numberOfContributors++
    getContributors(user);
  }
}

function getReposOfUsersInQueue()
{
  while(limitNotReached(repoQueue))
  {
    var user = repoQueue.shift();
    getRepos(user);
  }
}

function limitNotReached(queue) {

  if(queue.length < 1)
  {
    console.log("LIMIT REACHED no more");
    return false;

  }
  else if (numberOfContributors == MAX_NUMBER_OF_CONTRIBUTORS)
  {
      console.log("LIMIT REACHED");
    return false;
  }

  return true;

}
