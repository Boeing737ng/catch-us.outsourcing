var pageViewLength = 3;
var pageBarLength = 3;
var questionList = [];
var pageIdx = 0;
showLoading();
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
            questionRow = {
                key : key,
                title : questionValues["title"], 
                email : questionValues["email"], 
                date : questionValues["date"]
            };
            questionList.unshift(questionRow);
        }
        pageIdx = parseInt((questionList.length-1)/pageViewLength+1);
        makePaging(1);
        makeQuestionTable(1);
        noneLoading();
    });
}

function makeQuestionTable(page){
    var idx = (page-1)*pageViewLength+1;
    $(".questions").remove()
    viewPage = questionList.slice((page-1)*pageViewLength, page*pageViewLength);
    viewPage.forEach(function(row){
        $("#question-table").append(
            "<tr class=\'questions\'>"+
            "<td>"+idx+"</td>"+
            "<td><a href=\'./question?qidx="+row["key"]+"\'>"+row["title"]+"</a></td>"+
            "<td>"+row["email"]+"</td>"+
            "<td>"+row["date"]+"</td>"+
            "</tr>"
        );
        idx++;
    });
}

function makePaging(pageBarIdx){
    var pageStart = (pageBarIdx-1)*pageViewLength+1;
    var pageEnd = pageBarIdx*pageViewLength;
    $("#paging-wrapper").children().remove();
    if(pageStart != 1){
        $("#paging-wrapper").append(
            "<button id='prev-page-button' onclick='makePaging("+(pageBarIdx-1)+")'>\<</button>"
        );
    }
    if(pageEnd > pageIdx){
        pageEnd = pageIdx;
    }
    for(var i = pageStart; i<pageEnd+1; i++){
        $("#paging-wrapper").append(
            "<button class='page-button' onclick='makeQuestionTable("+i+")'>"+i+"</button>"
        );
    }
    if(pageEnd != pageIdx){
        $("#paging-wrapper").append(
            "<button id='next-page-button' onclick='makePaging("+(pageBarIdx+1)+")'>\></button>"
        );
    }
}