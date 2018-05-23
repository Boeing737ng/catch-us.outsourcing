var rootURL = "http://localhost/catch-us/";
function onLoadMainPage(){
    location.href = rootURL;
}

function onLoadSignUpPage(){
    location.href = rootURL+"pages/signup.html";
}

function onLoadClitentPage(){
    location.href = rootURL+"pages/client-main.html";
}

function onLoadExpertPage(){
    location.href = rootURL+"pages/expert-main.html";
}

function onLoadManagertPage(){
    location.href = rootURL+"pages/manager.html";
}

function onLoadBoardPage(){
    location.href = rootURL+"pages/board.html";
}

function onLoadQuestionUploadPage(){
    location.href = rootURL+"pages/question-upload.html";
}

function onLoadEstimatePage(){
    location.href = rootURL+"pages/estimate.html";
}

function showLoading(){
    $(".animationload")[0].style.display = "block";
}

function noneLoading(){
    $(".animationload")[0].style.display = "none";
}

function signOut(){
    firebase.auth().signOut();
    onLoadMainPage();
}

function estimatePage(){
    firebase.database().ref("Users/"+firebase.auth().getUid()+"/personalInfo/type").once('value').then(
        function(snapshot){
            if(snapshot.val() == "Expert"){
                onLoadExpertPage();
            }
            else if(snapshot.val() == "Client"){
                onLoadMainPage();
            }else if(snapshot.val() == "Admin"){
                onLoadManagertPage();
            }
        },
        function(error){
            console.log("onAuthStateChanged err : "+error)
        }
    );
}