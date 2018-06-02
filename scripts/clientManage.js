var currentUid = '';
var estimateList = [];

firebase.auth().onAuthStateChanged(function (user) {
    showLoading();
    if (user) {
        firebase.database().ref("Users/"+user.uid+"/personalInfo/type").once('value').then(
            function(snapshot){
                if(snapshot.val() == "Expert"){
                    onLoadExpertPage();
                }
                else if(snapshot.val() != "Client"){
                    alert("사용자 권한이 없습니다.");
                    onLoadMainPage();
                }
                currentUid = user.uid;
                loadEstimateList();
            },
            function(error){
                console.log("onAuthStateChanged err : "+error)
            }
        );
    } else {
        alert("로그인이 필요합니다.");
        onLoadMainPage();
    }
});

function getUserEstimate(){
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
            estimateList.unshift(estimateRow);
        }
        makeCurEstimateList();
        noneLoading();
    },function(error){
        console.log("loadEstimateList err : "+error);
    });
}

function displayClientDetails(details, id) {
    var decodedString = unescape(details);
    $("#" + id).append(
        "<div class='client-detail-text'>"+
            "<p>견적 요청 내용</p>"+
            "<pre>"+ decodedString +"</pre>"+
        "</div>"
    );
}

function hideClientDetails() {
    $('.client-detail-text').remove();
}

function makeCurEstimateList(){
    estimateList.forEach(function(row){
        var details = row["details"];
        var summarizedDetails = details;
        if(details.length > 21){
            summarizedDetails = details.substring(0, 21) + " . . .";
        }
        $("#estimate-list").append(
            "<div id='"+row["key"]+"' onclick=\"matchedExpertList("+row["key"]+")\" class='estimates'>"+
                "<p class='info-list-title'>지역</p>"+
                "<span class='info-list-content'>"+row["area"]+"</span>"+
                "<p class='info-list-title'>분야</p>"+
                "<span class='info-list-content'>"+row["field"].toString()+" - "+row["keyword"]+"</span>"+
                "<p class='info-list-title'>내용</p>"+
                "<span onmouseover=\"displayClientDetails('"+escape(details)+"', '"+row["key"]+"')\" onmouseleave=\"hideClientDetails()\" class='info-list-content'>"+summarizedDetails+"</span>"+
                "<p class='info-list-title'>요청일</p>"+
                "<span class='info-list-content'>"+row["date"]+"</span>"+
            "</div>"
        );
    });
}

function matchedExpertList(key){
    backMatchedExpertList();
    firebase.database().ref("Estimates/"+key+"/matchList").once('value').then(function(snapshot){
        var expertList = snapshot.val();
        console.log(expertList)
        $(".matched-expert").remove();
        $(".no-matched-expert-alert").remove();
        $("#expert-list").show();
        $("#expert-info").hide();
        var noExpert = true;
        var matchedExpertNum = 0;
        for(key in expertList){
            var expertValue = expertList[key];
            if(expertValue["outputResult"] != null){
                matchedExpertNum++;
                noExpert = false
                $("#expert-list").append(
                    "<div id='"+key+"' onclick=\"showExpertInfo('"+key+"', "+expertValue["applyNum"]+", "+expertValue["registerNum"]+")\" class='matched-expert'>"+
                        "<section class='matched-expert-left'>"+
                            "<img src=\""+expertValue["profileUrl"]+"\">"+
                            "<p>"+expertValue["name"]+" 변리사</p>"+
                        "</section>"+
                        "<section class='matched-expert-content'>"+
                            "<pre>"+expertValue["outputResult"]+"</pre>"+
                        "</section>"+
                    "</div>"
                );
            }
        }
        $("#expert-num")[0].innerHTML = matchedExpertNum;
        if(noExpert){
            $("#expert-list").append(
                "<div class='no-matched-expert-alert'>"+
                    "<p>고객에게 적합한 전문 변리사를 매칭중입니다. 견적 문의로부터 3일 이내로 전문 변리사로부터 견적을 산출받게 됩니다.</p>"+
                "</div>"
            );
        }
    },function(error){
        console.log("matchedExpertList err : "+error);
    });
}

function showExpertInfo(uid, applyNum, registerNum){
    var expert_detail = document.getElementById("expert-detail");
    expert_detail.removeChild(expert_detail.lastChild); // does not remove the button to move previous page
    $("#expert-list").hide();
    $("#expert-detail").show();
    $("#expert-info-wrapper").remove();
    firebase.database().ref("Users/"+uid).once('value').then(function(snapshot){
        var curExpertInto =  snapshot.val();
        var expertInfo = curExpertInto["personalInfo"];
        $("#expert-detail").append(
            "<div class='expert-detail-info'>"+
                "<section class='detail-left'>"+
                    "<img src=\""+expertInfo["profileUrl"]+"\">"+
                    "<p>"+expertInfo["name"]+ ' 변리사' +"</p>"+
                    "<div class='expert-additional-data'>"+
                        "<div class='expert-professionalism'>해당 분야 관련 전문성</div>"+
                        "<span>출원 건수 : "+applyNum+"</span>"+
                        "<span>등록률 : "+registerNum+" (%)</span>"+
                    "</div>"+
                "</section>"+
                "<section class='detail-right'>"+
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
                "</section>"+
            "</div>"
        );
    }, function(error){
        console.log("showExpertInfo err : "+error)
    });
}

function backMatchedExpertList(){
    $("#expert-list").show();
    $("#expert-detail").hide();
}