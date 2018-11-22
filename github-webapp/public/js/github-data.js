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
}
