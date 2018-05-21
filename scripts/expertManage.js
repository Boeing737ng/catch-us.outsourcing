var currentUid = "";
var matchedEstimateList = [];
var currentKey = "";
firebase.auth().onAuthStateChanged(function (user) {
    showLoading();
    if (user) {
        currentUid = user.uid;
        getMatchedEstimate();
    } else {
        alert("로그인이 필요합니다.");
        onLoadMainPage();
    }
});

function getMatchedEstimate(){
    var estimateObj = firebase.database().ref("Estimates/");
    estimateObj.orderByChild("/matchList").once('value').then(function(snapshot){
        matchedObj = snapshot.val();
        matchedEstimateList = [];
        for(key in matchedObj){
            var matchedlist = matchedObj[key]["matchList"];
            
            if(matchedlist != null){
                var Obj = {};
                if($.inArray(currentUid, Object.keys(matchedlist)) > -1){
                    Obj = matchedObj[key];
                    Obj["key"] = key;
                    matchedEstimateList.unshift(Obj);
                }
            }
        }
        makeMatchedEstimateTable();
        noneLoading();
        console.log(matchedEstimateList);
    })
}

function makeMatchedEstimateTable(){
    matchedEstimateList.forEach(function(row){
        var answer = ""
        if(row["matchList"][currentUid]["outputResult"] != null){
            answer = "<div class='completed-request'>&#9989;답변 완료</div>";
        }
        $("#estimate-list").append(
            "<div id='"+row["key"]+"' class='estimates' onclick=\"showEstimateInfo("+row["key"]+")\">"+
                answer+
                "<p class='info-list-title'>지역</p>"+
                "<span class='info-list-content'>"+row["area"]+"</span>"+
                "<p class='info-list-title'>분야</p>"+
                "<span class='info-list-content'>"+row["field"].toString()+" - "+row["keyword"]+"</span>"+
                "<p class='info-list-title'>내용</p>"+
                "<span class='info-list-content'>"+row["details"]+"</span>"+
                "<p class='info-list-title'>요청일</p>"+
                "<span class='info-list-content'>"+row["date"]+"</span>"+
            "</div>"
        );
    });
}

// 수정 필요
function showEstimateInfo(key){
    currentKey = key;
    $("#estimate-info").remove("#cur-estimate");
    $("#estimate-info").show();
    $("#edit-request-wrapper").hide();
    var curEstimate = firebase.database().ref("/Estimates/"+key);
    $("#cur-estimate").remove();
    $("#expert-response-header").html("견적 상세 내용");
    curEstimate.once('value').then(function(snapshot){
        estimateInfo = snapshot.val();
        firebase.database().ref("/Users/"+snapshot.val()["uid"]).once('value').then(function(snapshot2){
            usrInfo = snapshot2.val();
            $("#estimate-info").append(
                "<div id='cur-estimate'>"+
                    "<p>닉네임</p>"+
                    "<span>"+usrInfo["personalInfo"]["nickname"]+"</span>"+
                    "<p>이메일</p>"+
                    "<span>"+usrInfo["email"]+"</span>"+
                    "<p>지역</p>"+
                    "<span>"+estimateInfo["area"]+"</span>"+
                    "<p>분야</p>"+
                    "<span>"+estimateInfo["field"]+"</span>"+
                    "<p>출원 상세내용</p>"+
                    "<span>"+estimateInfo["details"]+"</span>"+
                    "<button id='write-result-button' onclick='writeOutputResult();'>다음</button>"+
                "</div>"
            )
        })
    })
}

function writeOutputResult(){
    $("#estimate-info").hide();
    firebase.database().ref("/Estimates/"+currentKey+"/matchList/"+currentUid+"/outputResult").once('value').then(function(ss){
        if(ss.val() != null){
            $("#output-text")[0].value = ss.val();
            $("#send-output-result")[0].innerHTML = "수정하기";
        }else{
            $("#output-text")[0].value = "";
            $("#send-output-result")[0].innerHTML = "답변하기";
        }
        $("#edit-request-wrapper").show();
        $("#expert-response-header").html("답변 입력");
    })
}

function uploadOutputResult(){
    firebase.database().ref("/Estimates/"+currentKey+"/matchList/"+currentUid).update({
        outputResult : $("#output-text")[0].value
    }).then(
        function(){
            alert("산출 결과 저장 완료");
            window.location.reload(true);
        },function(){

        }
    )
}

function backInfoList(){
    $("#expert-response-header").html("견적 상세 내용");
    $("#estimate-info").show();
    $("#edit-request-wrapper").hide();
}