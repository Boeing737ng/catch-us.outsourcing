var currentUid = '';
var estimateList = [];

firebase.auth().onAuthStateChanged(function (user) {
    showLoading();
    if (user) {
        currentUid = user.uid;
        loadEstimateList();
    } else {
        alert("로그인이 필요합니다.");
        onLoadMainPage();
    }
});

function getUserEstimate(){
    // var estimateObj = firebase.database().ref("Users/"+currentUid+"/Estimates");
    var estimateObj = firebase.database().ref("Estimates/");
    return estimateObj.orderByChild("uid").equalTo(currentUid).once('value');
}

function loadEstimateList(){
    getUserEstimate().then(function(snapshot){
        var estimateObj = snapshot.val();
        for(key in estimateObj){
            estimateValues = estimateObj[key];
            estimateRow = estimateValues;
            estimateRow["key"] = key;
            // estimateRow = {
            //     key : key,
            //     area : estimateValues["area"], 
            //     date : estimateValues["date"], 
            //     details : estimateValues["details"],
            //     field : estimateValues["field"],
            //     keyword : estimateValues["keyword"]
            // };
            estimateList.unshift(estimateRow);
        }
        makeCurEstimateList();
        noneLoading();
    });
}

// 수정 필요
function makeCurEstimateList(){
    // $("#estimate-list")[0]
    estimateList.forEach(function(row){
        console.log(row);
        $("#estimate-list").append(
            "<div id='"+row["key"]+"' onclick=\"matchedExpertList("+row["key"]+")\" class='estimates'>"+
                "<div>지역</div>"+
                "<div>"+row["area"]+"</div>"+
                "<div>분야</div>"+
                // "<div>"+row["field"].toString()+" - "+row["keyword"]+"</div>"+
                "<div>"+row["field"]+" - "+row["keyword"]+"</div>"+
                "<div>내용</div>"+
                "<div>"+row["details"]+"</div>"+
                "<div>요청일</div>"+
                "<div>"+row["date"]+"</div>"+
                "<div>--------------------------------------</div>"+
            "</div>"
        );
    });
}

function matchedExpertList(key){
    firebase.database().ref("Estimates/"+key+"/matchList").once('value').then(function(snapshot){
        var expertList = snapshot.val();
        $(".matched-expert").remove();
        $("#expert-list").show();
        $("#expert-info").hide();
        for(key in expertList){
            var expertValue = expertList[key];
            if(expertValue["outputResult"] != null){
                $("#expert-list").append(
                    "<div id='"+key+"' onclick=\"showExpertInfo('"+key+"', "+expertValue["applyNum"]+", "+expertValue["registerNum"]+")\" class='matched-expert'>"+
                        "<section class='matched-expert-left'>"+
                            "<img src=\""+expertValue["profileUrl"]+"\">"+
                            "<p>"+expertValue["name"]+" 변리사</p>"+
                        "</section>"+
                        "<section class='matched-expert-content'>"+
                            "<p>"+expertValue["outputResult"]+"</p>"+
                        "</section>"+
                    "</div>"
                );
                console.log(expertValue["name"]);
                console.log(expertValue["profileUrl"]);
                console.log(expertValue["outputResult"]);
            }
        }

    });
}

function showExpertInfo(uid, applyNum, registerNum){
    $("#expert-list").hide();
    $("#expert-info").show();
    $("#expert-info-wrapper").remove();
    firebase.database().ref("Users/"+uid).once('value').then(function(snapshot){
        var curExpertInto =  snapshot.val();
        var expertInfo = curExpertInto["personalInfo"];
        $("#expert-info").append(
            "<div id=\"expert-info-wrapper\">"+
                "<button onclick=\"backMatchedExpertList()\">뒤로가기</button>"+
                "<img src=\""+expertInfo["profileUrl"]+"\" style=\"width:100px; height:100px\">"+
                "<div>출원 건수 : "+applyNum+"</div>"+
                "<div>등록률 : "+registerNum+" (%)</div>"+
                "<p>"+expertInfo["name"]+ ' 변리사' +"</p>"+
                "<p>주요 분야</p>"+
                "<span>"+expertInfo["field"].toString()+"</span>"+
                "<p>소속</p>"+
                "<span>"+expertInfo["affiliation"]+" ("+expertInfo["address"]+")</span>"+
                "<p>경력 사항</p>"+
                "<span>"+expertInfo["additionalInfo"]["Career"]+"</span>"+
                "<p>저서, 논문 ,수상</p>"+
                "<span>"+expertInfo["additionalInfo"]["Reward"]+"</span>"+
                "<p>간략 소개</p>"+
                "<span>"+expertInfo["additionalInfo"]["Intro"]+"</span>"+
                "<p>연락처</p>"+
                "<span>"+expertInfo["phoneNum"]+"</span>"+
                "<p>이메일 주소</p>"+
                "<span>"+curExpertInto["email"]+"</span>"+
            "</div>"
        );
    });
}

function backMatchedExpertList(){
    $("#expert-list").show();
    $("#expert-info").hide();
}