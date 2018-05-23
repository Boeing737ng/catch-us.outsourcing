var pageViewLength = 4;
var pageBarLength = 3;
var questionList = [];
var adminQuestionList = [];
var pageIdx = 0;
showLoading();
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        loadQuestionList();
    } else {
        alert("로그인이 필요합니다.")
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
            if(questionValues["email"] != "admin@catch.us"){
                questionList.unshift(questionRow);
            }else{
                questionRow["email"] = "관리자";
                adminQuestionList.unshift(questionRow);
            }
        }
        pageIdx = parseInt((questionList.length-1)/pageViewLength+1);
        makePaging(1);
        makeAdminQuestionTable();
        makeQuestionTable(1);
        noneLoading();
    },function(error){
        console.log("loadQuestionList err : "+error);
    });
}

function makeAdminQuestionTable(){
    adminQuestionList.forEach(function(row){
        $("#question-table").append(
            "<tr class='admin'>"+
                "<td>공지</td>"+
                "<td><a href=\'./question?qidx="+row["key"]+"\'>"+row["title"]+"</a></td>"+
                "<td>"+row["email"]+"</td>"+
                "<td>"+row["date"]+"</td>"+
            "</tr>"
        );
        console.log("작성자 : ", row["email"]);
        console.log("내용 : ", row["title"]);
        console.log("일자 : ", row["date"]);
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
    $(".page-button").removeClass("clicked-page-btn");
    $($(".page-button")[(page-1)%pageBarLength]).addClass("clicked-page-btn");
}

function makePaging(pageBarIdx, direction){
    var pageStart = (pageBarIdx-1)*pageBarLength+1;
    var pageEnd = pageBarIdx*pageBarLength;
    var viewIdx = 0;
    if(direction == "prev"){
        viewIdx = pageEnd;
    }else if(direction == "next"){
        viewIdx = pageStart;
    }
    makeQuestionTable(viewIdx);
    $("#paging-wrapper").children().remove();
    if(pageStart != 1){
        $("#paging-wrapper").append(
            "<button id='prev-page-button' onclick='makePaging("+(pageBarIdx-1)+", \"prev\")'>\<</button>"
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
            "<button id='next-page-button' onclick='makePaging("+(pageBarIdx+1)+", \"next\")'>\></button>"
        );
    }
    $(".page-button").removeClass("clicked-page-btn");
    $($(".page-button")[(viewIdx-1)%pageBarLength]).addClass("clicked-page-btn");
}