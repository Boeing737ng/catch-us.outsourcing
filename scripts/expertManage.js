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
            answer = "<div>답변 완료</div>";
        }
        $("#estimate-list").append(
            "<div id='"+row["key"]+"' class='estimates' onclick=\"showEstimateInfo("+row["key"]+")\">"+
                answer+
                "<div class='info-list-title'>지역</div>"+
                "<div class='info-list-content'>"+row["area"]+"</div>"+
                "<div class='info-list-title'>분야</div>"+
                "<div class='info-list-content'>"+row["field"].toString()+" - "+row["keyword"]+"</div>"+
                "<div class='info-list-title'>내용</div>"+
                "<div class='info-list-content'>"+row["details"]+"</div>"+
                "<div class='info-list-title'>요청일</div>"+
                "<div class='info-list-content'>"+row["date"]+"</div>"+
            "</div>"
        );
    });
}

// 수정 필요
function showEstimateInfo(key){
    currentKey = key;
    $("#estimate-info").show();
    $("#output-result").hide();
    var curEstimate = firebase.database().ref("/Estimates/"+key);
    $("#cur-estimate").remove();
    curEstimate.once('value').then(function(snapshot){
        estimateInfo = snapshot.val();
        firebase.database().ref("/Users/"+snapshot.val()["uid"]).once('value').then(function(snapshot2){
            usrInfo = snapshot2.val();
            $("#info-list").append(
                "<div id='cur-estimate'>"
                +"<div>닉네임</div>"
                +"<div>"+usrInfo["personalInfo"]["nickname"]+"</div>"
                +"<div>이메일</div>"
                +"<div>"+usrInfo["email"]+"</div>"
                +"<div>지역</div>"
                +"<div>"+estimateInfo["area"]+"</div>"
                +"<div>분야</div>"
                +"<div>"+estimateInfo["field"]+"</div>"
                +"<div>출원 상세내용</div>"
                +"<div>"+estimateInfo["details"]+"</div>"
                +"</div>"
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
        $("#output-result").show();
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
    $("#estimate-info").show();
    $("#output-result").hide();
}