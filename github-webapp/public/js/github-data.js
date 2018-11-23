var user = {
    username: sessionStorage.getItem('user'),
    data: null,
    repos: null,
    contributors: null,
    thumbnail: null
}


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
          user.data = data;
          user.thumbnail = data.avatar_url;
          getAuthUserRepos();
        },
        error: function(jqXHR, textStatus, errorThrown) {
           console.log(errorThrown);
           alert('Error');
        }
    });
}

function getAuthUserRepos() {
    console.log("Fetching repos");

    $.ajax({
        url: "https://api.github.com/user/repos",
        method: "GET",
        data: {
            "access_token": sessionStorage.getItem('token')
        },
        success: function(repos) {
            user.repos = repos;
        },
        error: function(jqXHR, textStatus, errorThrown) {
           console.log(errorThrown);
           alert('Error');
        }
    });
}
