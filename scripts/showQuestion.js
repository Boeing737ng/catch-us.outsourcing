// $(document).ready(
//     function(){
//         showLoading();
//         makeQuestion();
//     }
// );
firebase.auth().onAuthStateChanged(function (user) {
    showLoading();
    if (user) {
        currentUid = user.uid;
        makeQuestion();
    } else {
        console.log("로그인이 필요합니다.");
        onLoadMainPage();
    }
});

function getPostData(){
    var getPost = location.search.split("?")[1].split("=");
    var postObj = {};
    postObj[getPost[0]] = getPost[1];
    return postObj;
}

function getCurrentQuestion(){
    var questionIdx = getPostData()["qidx"];
    var questionsObj = firebase.database().ref("Questions/"+questionIdx);
    return questionsObj.once('value');
}

function makeQuestion(){
    getCurrentQuestion().then(
        function(snapshot){
            var snapshotVal = snapshot.val();
            var isModify = Object.keys(snapshotVal)[0] == currentUid;
            // var questionData = Object.values(snapshotVal)[0];
            for(value in snapshotVal){
                questionData = snapshotVal[value];
            }
            console.log(questionData);
            makeQuestionLayout(questionData["title"], questionData["email"], questionData["date"], questionData["content"], isModify);
            noneLoading();
        },
        function(error){
            console.log("makeQuestion err : "+error);
            noneLoading();
        }
    )
}

function makeQuestionLayout(title, email, date, content, isModify){
    $(".text-area").show();
    if(isModify){
        $(".read-question").hide();
        $(".modify-question").show();
        $("#question-title")[0].value = title;
        $("#question-content")[0].value = content;
    }else{
        $(".read-question").show();
        $(".modify-question").hide();
        document.getElementById("selected-question-title").textContent = title;
        document.getElementById("selected-question-content").textContent = content;
        document.getElementById("writer-email").textContent = email;
        document.getElementById("uploaded-date").textContent = date;
    }
}

function modifyQuestion(){
    if(confirm("게시물을 수정하시겠습니까?")){
        firebase.database().ref("Questions/" + getPostData()["qidx"] + "/" + currentUid).update({
            content : $("#question-content")[0].value,
            title : $("#question-title")[0].value
        }).then(
            function(){
                alert("수정을 완료하였습니다.")
                onLoadBoardPage();
            },
            function(error){
                console.log("uploadQuestion err : "+error);
            }
        );
    }
}

function removeQuestion(){
    if(confirm("게시물을 정말 삭제하시겠습니까?")){
        firebase.database().ref("Questions/" + getPostData()["qidx"]).remove().then(function(s){
            alert("해당 게시물을 삭제하였습니다.");
            onLoadBoardPage();
        }, function(error){
            console.log("err : "+error);
        })
    }
}