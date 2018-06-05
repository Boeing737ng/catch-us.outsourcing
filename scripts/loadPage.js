var rootURL = "http://localhost/catch-us/";
//var rootURL = "http://catchus.co.kr/"
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
    if(confirm("로그아웃 하시겠습니까?")){
        firebase.auth().signOut();
    }
}

function estimatePage(){
    showLoading();
    firebase.database().ref("Users/"+firebase.auth().getUid()+"/personalInfo/type").once('value').then(
        function(snapshot){
            noneLoading();
            if(snapshot.val() == "Expert"){
                onLoadExpertPage();
            }
            else if(snapshot.val() == "Client"){
                onLoadClitentPage();
            }else if(snapshot.val() == "Admin"){
                onLoadManagertPage();
            }else{
                alert("로그인이 필요합니다.");
            }
        },
        function(error){
            noneLoading();
            alert("로그인이 필요합니다.");
            console.log("onAuthStateChanged err : "+error)
        }
        
    );
}