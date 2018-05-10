console.log("Catch-us 외주 개발 (김승태, 최기현)")
var s;
function signIn(){
    email = $("#user-email")[0].value;
    password = $("#user-pw")[0].value;
    firebase.auth().signInWithEmailAndPassword(email, password).then(function(user){
        firebase.database().ref('Users/'+user.user.uid+"/personalInfo/type").on('value', function(snapshot) {
            if(snapshot.val() == "Expert"){
                console.log("전문가 로그인");
            }else if(snapshot.val == "Client"){
                console.log("의뢰인 로그인");
            }
        });
    });
}