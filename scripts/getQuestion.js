var questionList = [];

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        loadQuestionList();
    } else {
        onLoadMainPage();
    }
});

function getQuestionList(){
    var questionsObj = firebase.database().ref("/Questions");
    return questionsObj.orderByKey().once('value');
}

function loadQuestionList(){
    getQuestionList().then(function(snapshot){
        questionObj = snapshot.val();
        // console.log(questionObj)
        for(key in questionObj){
            questionValues = Object.values(questionObj[key])[0];
            // console.log(Object.values(questionObj[key])[0]);
            questionRow = [
                key,
                questionValues["title"], 
                questionValues["email"], 
                questionValues["date"]
            ];
            questionList.unshift(questionRow);
        }
        makeQuestionTable();
    });
}

function makeQuestionTable(){
    var idx = 1;
    questionList.forEach(function(row){
        console.log(row)
        $("#table-wrapper").append(
            "<tr>"+
            "<td>"+idx+"<td>"+
            "<td>"+row[1]+"<td>"+
            "<td>"+row[2]+"<td>"+
            "<td>"+row[3]+"<td>"+
            "</tr>"
        );
        idx++;
    });
}