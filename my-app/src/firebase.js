import firebase from 'firebase'
import 'firebase/auth'


const config = {
   apiKey: "AIzaSyBfHl34Dmybtneir-kVYfY3YXwm9twXsuc",
   authDomain: "test-app-2f834.firebaseapp.com",
   databaseURL: "https://test-app-2f834.firebaseio.com",
   projectId: "test-app-2f834",
   storageBucket: "test-app-2f834.appspot.com",
   messagingSenderId: "743265410550"
 };

 firebase.initializeApp(config);

 async function authWithGitHub() {
   const provider = new firebase.auth.GithubAuthProvider()
   provider.addScope('public_repo')
   provider.addScope('read:org')
   provider.addScope('read:user')
   const result = await firebase.auth().signInWithPopup(provider)
  // This gives you a GitHub Access Token. You can use it to access the GitHub API.
   return result.credential.accessToken
  // The signed-in user info.
  //var user = result.user;

 }

 export {authWithGitHub}
