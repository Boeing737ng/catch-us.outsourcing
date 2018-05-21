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
            var questionData = Object.values(snapshot.val())[0];
            makeQuestionLayout(questionData["title"], questionData["email"], questionData["date"], questionData["content"]);
            noneLoading();
        },
        function(error){
            console.log("makeQuestion err : "+error);
            noneLoading();
        }
    )
}

function makeQuestionLayout(title, email, date, content){
    $("#question-title")[0].innerHTML = "제목 : " + title + " " + email + " " + date;
    
    $("#question-content")[0].innerHTML = content;
    console.log("title : ", title);
    console.log("email : ", email);
    console.log("date : ", date);
    console.log("content : ", content);
}