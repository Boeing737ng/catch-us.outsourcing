var EstimatesList = [];
var curExpertList = {};
var selectedExpertlist = {};
var selectedKey = "";

$(".not-mached-expert").hide();
$(".mached-expert").show();
$("#matched-expert-list").show();
$("#expert-detail").hide();

firebase.auth().onAuthStateChanged(function (user) {
    showLoading();
    if (user) {
        firebase.database().ref("Users/"+user.uid+"/personalInfo/type").once('value').then(
            function(snapshot){
                if(snapshot.val() != "Admin"){
                    alert("관리자 권한이 없습니다.");
                    onLoadMainPage();
                }
                getEstimateList();
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

$("#submit-selected-expert").click(function(){
    uploadSelectedExperts();
});

$("#append-expert").click(function(){
    $(".mached-expert").hide();
    $(".not-mached-expert").show();
    $("#expert-list").show();
    $("#expert-detail").hide();
});

$("#back-matched-expert").click(function(){
    $(".not-mached-expert").hide();
    $(".mached-expert").show();
    $("#matched-expert-list").show();
    $("#expert-detail").hide();
});

function uploadSelectedExperts(){
    var curExpertTableList = $('.expert-info-wrapper');
    showLoading();
    selectedExpertlist = {};
    var selectedExpertNum = 0;
    for(var idx = 0; idx<curExpertTableList.length; idx++){
        var curExpert = $(curExpertTableList[idx]);
        if(curExpert.find(".select-expert")[0].checked){
            var applyNum = curExpert.find("input[name='apply-number']")[0].value.replace(/ /gi, '');
            var registerNum = curExpert.find("input[name='register-number']")[0].value.replace(/ /gi, '');
            if(applyNum == '' || isNaN(applyNum)){
                alert("출원 건수 및 등록률을 확인해주세요.");
                noneLoading();
                return;
            }
            if(registerNum == '' || isNaN(curExpert.find("input[name='register-number']")[0].value)){
                alert("출원 건수 및 등록률을 확인해주세요.");
                noneLoading();
                return;
            }
            selectedExpertNum++;
            selectedExpertlist[curExpert[0].id] = {
                name : curExpertList[curExpert[0].id]["personalInfo"]["name"],
                profileUrl : curExpertList[curExpert[0].id]["personalInfo"]["profileUrl"],
                applyNum : curExpert.find("input[name='apply-number']")[0].value,
                registerNum : curExpert.find("input[name='register-number']")[0].value
            }
        }
    }
    firebase.database().ref("Estimates/"+ selectedKey+"/matchList").update(
        selectedExpertlist
    ).then(
        function(){
            makeCurExpertTable(selectedKey);
            alert("총 " + selectedExpertNum + "명의 변리사에게 견적 요청서를 전송하였습니다.");
            noneLoading();
        },
        function(error){
            console.log("uploadEstimate err : "+error);
            nonLoading();
        }
    );
}

function getEstimateList(){
    var estimateList = firebase.database().ref("/Estimates");
    showLoading();
    return estimateList.once('value').then(
        function(snapshot){
            estimatesObj = snapshot.val();
            for(key in estimatesObj){
                estimateRow = estimatesObj[key];
                estimateRow["key"] = key;
                EstimatesList.unshift(estimateRow);
            }
            makeEstimateTable();
            noneLoading();
        },
        function(error){
            console.log("getEstimateList err : "+error);
            noneLoading();
        }
    )
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

function makeEstimateTable(){
    EstimatesList.forEach(function(row){
        var details = row["details"];
        var summarizedDetails = details;
        var matchList = row["matchList"];
        var matchedNum = 0;
        var matchingNum = 0;
        for(key in matchList){
            if(matchList[key]["outputResult"] == null){
                matchingNum++;
            }else{
                matchedNum++;
            }
        }
        if(details.length > 21){
            summarizedDetails = details.substring(0, 21) + " . . .";
        }
        $("#estimate-list").append(
            "<div id='"+row["key"]+"' class='estimates' onclick=\"makeCurExpertTable("+row["key"]+")\">"+
                "<div style='float:right'>"+
                    "<span class='match-num'>전문가 답변 완료 수 : "+matchedNum+"</span>"+
                    "<br>"+
                    "<span class='match-num'>전문가 답변 미완료 수 : "+matchingNum+"</span>"+
                "</div>"+
                "<p class='info-list-title'>지역</p>"+
                "<span class='info-list-content'>"+row["area"]+"</span>"+
                "<p class='info-list-title'>분야</p>"+
                "<span class='info-list-content'>"+row["field"].toString()+" - "+row["keyword"]+"</span>"+
                "<p class='info-list-title'>내용</p>"+
                "<span class='info-list-content' onmouseover=\"displayClientDetails('"+escape(details)+"', '"+row["key"]+"')\" onmouseleave=\"hideClientDetails()\">"+summarizedDetails+"</span>"+
                "<p class='info-list-title'>요청일</p>"+
                "<span class='info-list-content'>"+row["date"]+"</span>"+
            "</div>"
        );
    });
}


function getExpertList(){
    var UserList = firebase.database().ref("/Users");
    return UserList.orderByChild("personalInfo/type").equalTo("Expert").once('value')
}

function makeCurExpertTable(key){
    curExpertList = {};
    $(".not-mached-expert").hide();
    $(".mached-expert").show();
    $("#matched-expert-list").show();
    $("#mated-expert-detail").hide();
    $(".experts").remove();

    selectedKey = key;
    firebase.database().ref("/Estimates/"+key+"/matchList").once('value').then(function(matchedExpert){
        var matchedExpertList = [];
        if(matchedExpert.val() != null){
            matchedExpertList = Object.keys(matchedExpert.val());
            console.log(matchedExpertList);
        }
        getExpertList().then(function(snapshot){
            curExpertList = snapshot.val();
            // console.log(curExpertList);
            var matchingExpertNum = 0;
            var matchedExpertNum = 0;
            for(uid in curExpertList){
                if($.inArray( uid, matchedExpertList ) == -1){
                    matchingExpertNum++;
                    expertInfo = curExpertList[uid]["personalInfo"];
                    $("#expert-list").append(
                        "<div class='experts'>"+
                            "<div class='expert-info-wrapper' id=\""+uid+"\">"+
                                "<div class='expert-image-wrapper'>"+
                                    "<img src=\""+expertInfo["profileUrl"]+"\">"+
                                "</div>"+
                                "<label class='select-wrapper'>"+
                                    "<input class='select-expert' type='checkbox'>"+
                                    "<span class='checkmark'></span>"+
                                "</label>"+
                                "<a class='view-details' onclick=\"makeCurExpertDetailTable('"+uid+"')\">상세 보기</a>"+
                                "<div class='expert-additional-info'>"+
                                    "<input name='apply-number' type='text' placeholder='출원 건수'>"+
                                    "<input name='register-number' type='text' placeholder='등록률 (%)'>"+
                                "</div>"+
                                "<p class='expert-name'>"+expertInfo["name"]+ ' 변리사' +"</p>"+
                                "<hr>"+
                                "<p>주요 분야</p>"+
                                "<span>"+expertInfo["field"].toString()+"</span>"+
                                "<p>소속</p>"+
                                "<span>"+expertInfo["affiliation"]+" ("+expertInfo["address"]+")</span>"+
                            "</div>"+
                        "</div>"
                    );
                }else{
                    matchedExpertNum++;
                    expertInfo = curExpertList[uid]["personalInfo"];
                    $("#matched-expert-list").append(
                        "<div class='experts'>"+
                            "<div class='expert-info-wrapper' id=\""+uid+"\">"+
                                "<div class='expert-image-wrapper'>"+
                                    "<img src=\""+expertInfo["profileUrl"]+"\">"+
                                "</div>"+
                                "<a class='matched-view-details' onclick=\"makeCurExpertDetailTable('"+uid+"', 'matched')\">상세 보기</a>"+
                                "<p class='expert-name'>"+expertInfo["name"]+ ' 변리사' +"</p>"+
                                "<hr>"+
                                "<p>주요 분야</p>"+
                                "<span>"+expertInfo["field"].toString()+"</span>"+
                                "<p>소속</p>"+
                                "<span>"+expertInfo["affiliation"]+" ("+expertInfo["address"]+")</span>"+
                            "</div>"+
                        "</div>"
                    );
                }
            }
            $("#matched-expert-num")[0].innerHTML = matchedExpertNum;
            $("#expert-num")[0].innerHTML = matchingExpertNum;
        },function(error){
            console.log("makeCurExpertTable first err : "+error);
        })
    }, function(error){
        console.log("makeCurExpertTable second err : "+error);
    })
    
}

function makeCurExpertDetailTable(uid, matched){
    var expert_detail = document.getElementById("expert-detail");
    var expert_detail_id = "#expert-detail";
    var expert_matched_list = "#expert-list";
    if(matched == "matched"){
        expert_detail_id = "#matched-expert-detail";
        expert_matched_list = "#matched-expert-list"
    }
    expert_detail.removeChild(expert_detail.lastChild); // does not remove the button to move previous page
    $(expert_matched_list).hide();
    $(expert_detail_id).show();
    $(".cur-expert").remove();
    var UserList = firebase.database().ref("/Users/"+uid);
    UserList.once('value').then(function(snapshot){
        curExpertInfo = snapshot.val();
        expertPersonalInfo = curExpertInfo["personalInfo"];
        $(expert_detail_id).append(
            "<div class='expert-detail-info'>"+
                "<section class='detail-left'>"+
                    "<img src=\""+expertPersonalInfo["profileUrl"]+"\">"+
                    "<p>"+expertPersonalInfo["name"]+" 변리사</p>"+
                "</section>"+
                "<section class='detail-right'>"+
                    "<p>주요 분야</p>"+
                    "<span>"+expertInfo["field"].toString()+"</span>"+
                    "<p>소속</p>"+
                    "<span>"+expertPersonalInfo["affiliation"]+" ("+expertPersonalInfo["address"]+")</span>"+
                    "<p>경력 사항</p>"+
                    "<pre>"+expertPersonalInfo["additionalInfo"]["Career"]+"</pre>"+
                    "<p>저서, 논문, 수상</p>"+
                    "<pre>"+expertPersonalInfo["additionalInfo"]["Reward"]+"</pre>"+
                    "<p>간략 소개</p>"+
                    "<pre>"+expertPersonalInfo["additionalInfo"]["Intro"]+"</pre>"+
                    "<p>연락처</p>"+
                    "<span>"+expertPersonalInfo["phoneNum"]+"</span>"+
                    "<p>이메일</p>"+
                    "<span>"+curExpertInfo["email"]+"</span>"+
                "</section>"+
            "</div>"
        );
    },function(error){
        console.log("makeCurExpertDetailTable err : "+error)
    })
}

function backToExpert(){
    $("#expert-detail").hide();
    $("#expert-list").show();
}

function backToMatchedExpert(){
    $("#matched-expert-detail").hide();
    $("#matched-expert-list").show();
}