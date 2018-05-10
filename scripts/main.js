console.log("Catch-us 외주 개발 (김승태, 최기현)")

function signIn(){
    email = $("#user-email")[0].value;
    password = $("#user-pw")[0].value;
    firebase.auth().signInWithEmailAndPassword(email, password);
}