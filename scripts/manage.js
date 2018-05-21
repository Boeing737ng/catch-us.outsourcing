var EstimatesList = [];
var curExpertList = {};
var selectedExpertlist = {};
var selectedKey = "";

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
            console.log("applyNum : "+applyNum);
            console.log("registerNum : "+registerNum);
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
            console.log("aaaaa");
            selectedExpertNum++;
            selectedExpertlist[curExpert[0].id] = {
                name : curExpertList[curExpert[0].id]["personalInfo"]["name"],
                profileUrl : curExpertList[curExpert[0].id]["personalInfo"]["profileUrl"],
                applyNum : curExpert.find("input[name='apply-number']")[0].value,
                registerNum : curExpert.find("input[name='register-number']")[0].value
            }
        }
    }
    // curExpertTableList.each(function(idx){
    //     var curExpert = $(curExpertTableList[idx]);
    //     if(curExpert.find(".select-expert")[0].checked){
    //         var applyNum = curExpert.find("input[name='apply-number']")[0].value.replace(/ /gi, '');
    //         var registerNum = curExpert.find("input[name='register-number']")[0].value.replace(/ /gi, '');
    //         console.log("applyNum : "+applyNum);
    //         console.log("registerNum : "+registerNum);
    //         if(applyNum == '' || isNaN(applyNum)){
    //             alert("출원 건수 및 등록률을 확인해주세요.");
    //             return;
    //         }
    //         if(registerNum == '' || isNaN(curExpert.find("input[name='register-number']")[0].value)){
    //             alert("출원 건수 및 등록률을 확인해주세요.");
    //             return;
    //         }
    //         console.log("aaaaa");
    //         selectedExpertlist[curExpert[0].id] = {
    //             name : curExpertList[curExpert[0].id]["personalInfo"]["name"],
    //             profileUrl : curExpertList[curExpert[0].id]["personalInfo"]["profileUrl"],
    //             applyNum : curExpert.find("input[name='apply-number']")[0].value,
    //             registerNum : curExpert.find("input[name='register-number']")[0].value
    //         }
    //     }
    // });
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
                estimateValues = Object.values(estimatesObj[key])[0];
                estimateRow = estimatesObj[key];
                estimateRow["key"] = key;
                EstimatesList.unshift(estimateRow);
            }
            console.log(EstimatesList);
            makeEstimateTable();
            noneLoading();
        },
        function(error){
            console.log("getEstimateList err : "+error);
            noneLoading();
        }
    )
}

function makeEstimateTable(){
    EstimatesList.forEach(function(row){
        var details = row["details"];
        if(details.length > 21){
            details = details.substring(0, 21) + " . . .";
        }
        $("#estimate-list").append(
            "<div id='"+row["key"]+"' class='estimates' onclick=\"makeCurExpertTable("+row["key"]+")\">"+
                "<p class='info-list-title'>지역</p>"+
                "<span class='info-list-content'>"+row["area"]+"</span>"+
                "<p class='info-list-title'>분야</p>"+
                "<span class='info-list-content'>"+row["field"].toString()+" - "+row["keyword"]+"</span>"+
                "<p class='info-list-title'>내용</p>"+
                "<span class='info-list-content'>"+details+"</span>"+
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
    $("#expert-list").show();
    $("#expert-detail").hide();
    $(".experts").remove();

    selectedKey = key;
    firebase.database().ref("/Estimates/"+key+"/matchList").once('value').then(function(matchedExpert){
        var matchedExpertList = [];
        if(matchedExpert.val() != null){
            matchedExpertList = Object.keys(matchedExpert.val());
        }
        console.log(matchedExpertList)
        getExpertList().then(function(snapshot){
            curExpertList = snapshot.val();
            // console.log(curExpertList);
            var matchedExpertNum = 0;
            for(uid in curExpertList){
                if($.inArray( uid, matchedExpertList ) == -1){
                    matchedExpertNum++;
                    expertInfo = curExpertList[uid]["personalInfo"];
                    console.log(expertInfo)
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
                                "<p>"+expertInfo["name"]+ ' 변리사' +"</p>"+
                                "<p>주요 분야</p>"+
                                "<span>"+expertInfo["field"].toString()+"</span>"+
                                "<p>소속</p>"+
                                "<span>"+expertInfo["affiliation"]+" ("+expertInfo["address"]+")</span>"+
                            "</div>"+
                        "</div>"
        
                    );
                };
            }
            $("#expert-num")[0].innerHTML = matchedExpertNum;
        },function(error){
            console.log("makeCurExpertTable first err : "+error);
        })
    }, function(error){
        console.log("makeCurExpertTable second err : "+error);
    })
    
}

function makeCurExpertDetailTable(uid){
    var expert_detail = document.getElementById("expert-detail");
    expert_detail.removeChild(expert_detail.lastChild); // does not remove the button to move previous page
    $("#expert-list").hide();
    $("#expert-detail").show();
    $(".cur-expert").remove();
    var UserList = firebase.database().ref("/Users/"+uid);
    UserList.once('value').then(function(snapshot){
        curExpertInfo = snapshot.val();
        console.log(curExpertInfo)
        expertPersonalInfo = curExpertInfo["personalInfo"];
        $("#expert-detail").append(
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