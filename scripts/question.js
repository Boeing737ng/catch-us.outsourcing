var currentUid = '';
// var questionList = [];
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        currentUid = user.uid;
        // loadQuestionList();
    } else {
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

// function getQuestionList(){
//     var questionsObj = firebase.database().ref("/Questions");
//     return questionsObj.orderByKey().once('value');
// }

// function loadQuestionList(){
//     getQuestionList().then(function(snapshot){
//         questionObj = snapshot.val();
//         // console.log(questionObj)
//         for(key in questionObj){
//             questionValues = Object.values(questionObj[key])[0];
//             // console.log(Object.values(questionObj[key])[0]);
//             questionRow = [
//                 key,
//                 questionValues["title"], 
//                 questionValues["email"], 
//                 questionValues["date"]
//             ];
//             questionList.push(questionRow);
//         }
//     });
// }