function githubAuth() {
    console.log("Attempting to sign in...");
    var provider = new firebase.auth.GithubAuthProvider();
    provider.addScope('repo');
    provider.setCustomParameters({
      'allow_signup': false
    });

    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a GitHub Access Token. You can use it to access the GitHub API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.additionalUserInfo.username;
      // ...
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', user);
      location.href = "main_page.html";
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      // if (errorCode == 400)
      // {
      //   console.alert
      // }
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
}

function logOut() {
  firebase.auth().signOut().then(function() {
// Sign-out successful.
}).catch(function(error) {
// An error happened.
});
}
