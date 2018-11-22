var user = {
    username: sessionStorage.getItem('user'),
    repos: null
}



$(document).ready(function() {

    //DOM manipulation code
    getRepos();

});

function getRepos() {
    console.log("Fetching repos");

    $.ajax({
        url: "https://api.github.com/user/repos",
        method: "GET",
        data: {
            "access_token": sessionStorage.getItem('token')
        },
        success: function(repos) {
            user.repos = repos;
            sessionStorage.setItem('repos', repos);
            alert('Success');
        },
        error: function(jqXHR, textStatus, errorThrown) {
           console.log(errorThrown);
           alert('Error');
        }
    });
}
