var currentUid = '';
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        currentUid = user.uid;
    } else {
        alert("로그인이 필요합니다.");
        onLoadMainPage();
    }
});

function uploadQuestion(){
    if(confirm("게시물을 등록하시겠습니까?")){
        var uploadInfo = {};
        if(getUploadInfo()) {
            uploadInfo[currentUid] = getUploadInfo();
            firebase.database().ref("Questions/" + Date.now()).set(
                uploadInfo
            ).then(
                function(){
                    onLoadBoardPage();
                },
                function(error){
                    console.log("uploadQuestion err : "+error);
                }
            );
        }
    }
}

function getUploadInfo(){    
    var uploadInfo = {
        email : getCurrentEmail(),
        title : $("#question-title")[0].value,
        content : $("#question-content")[0].value,
        date : getCurrentDate(),
    }
    if(uploadInfo.title === "") {
        alert("제목을 입력하세요.");
    }
    else if(uploadInfo.content === "") {
        alert("내용을 입력하세요.");
    }
    else {
        return uploadInfo;
    }
}

function getCurrentDate(){
    var curDate = new Date()
    var year = curDate.getFullYear()
    var month = curDate.getMonth()+1;
    var date = curDate.getDate();
    month < 10 ? "0"+month : ""+month;
    date < 10 ? "0"+date : ""+date;
    return year+"-"+month+"-"+date;
}

function getCurrentEmail(){
    return firebase.auth().currentUser.email;
}