$(document).ready(
    function(){
        showLoading();
        makeQuestion();
    }
);

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
    console.log("title : ", title);
    console.log("email : ", email);
    console.log("date : ", date);
    console.log("content : ", content);
}