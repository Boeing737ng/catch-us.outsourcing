console.log("Catch-us 외주 개발 (김승태, 최기현)")
var s;
function signIn(){
    email = $("#user-email")[0].value;
    password = $("#user-pw")[0].value;
    firebase.auth().signInWithEmailAndPassword(email, password).then(function(user){
        firebase.database().ref('Users/'+user.user.uid+"/personalInfo/type").on('value', function(snapshot) {
            if(snapshot.node_.value_ == "Expert"){
                console.log("전문가 로그인");
                onLoadExpertPage();
            }else if(snapshot.node_.value_ == "Client"){
                console.log("의뢰인 로그인");
                onLoadClitentPage();
            }
        });
    });
}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $('#pre-profile').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
        }
}

$("#client-button").click(function() {
    document.getElementById("client-signup").style.display = "block";
    document.getElementById("expert-signup").style.display = "none";
});

$("#expert-button").click(function() {
    document.getElementById("client-signup").style.display = "none";
    document.getElementById("expert-signup").style.display = "block";
});
$("#expert-profile").change(function() {
    readURL(this);
});