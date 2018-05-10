
function firebase_signup(email, password){
    return firebase.auth().createUserWithEmailAndPassword(email, password);
}

function client_signup(email, password, info){
    firebase_signup(email, password).then(function(user){
        write_client_data(user.user.uid, info);
    })
}

function write_client_data(uid, info){
    firebase.database().ref('Clients/' + uid).set({
        Nicname:info
    });
}