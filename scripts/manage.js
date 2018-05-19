var EstimatesList = [];
var curExpertList = {};
var selectedExpertlist = {};
var selectedKey = "";
$("#submit-selected-expert").click(function(){
    uploadSelectedExperts();
});

function uploadSelectedExperts(){
    var curExpertTableList = $('.expert-info-wrapper');
    showLoading();
    selectedExpertlist = {};
    curExpertTableList.each(function(idx){
        var curExpert = $(curExpertTableList[idx]);
        if(curExpert.find(".select-expert")[0].checked){
            selectedExpertlist[curExpert[0].id] = {
                name : curExpertList[curExpert[0].id]["personalInfo"]["name"],
                profileUrl : curExpertList[curExpert[0].id]["personalInfo"]["profileUrl"],
                applyNum : curExpert.find("input[name='apply-number']")[0].value,
                registerNum : curExpert.find("input[name='register-number']")[0].value
            }
        }
    });
    firebase.database().ref("Estimates/"+ selectedKey+"/matchList").update(
        selectedExpertlist
    ).then(
        function(){
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

// 수정 필요
function makeEstimateTable(){
    EstimatesList.forEach(function(row){
        $("#estimate-list").append(
            "<div id='"+row["key"]+"' class='estimates' onclick=\"makeCurExpertTable("+row["key"]+")\">"
            +"<div>지역</div>"
            +"<div>"+row["area"]+"</div>"
            +"<div>분야</div>"
            +"<div>"+row["field"].toString()+" - "+row["keyword"]+"</div>"
            +"<div>내용</div>"
            +"<div>"+row["details"]+"</div>"
            +"<div>요청일</div>"
            +"<div>"+row["date"]+"</div>"
            +"<div>--------------------------------------</div>"
            +"</div>"
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
            console.log(curExpertList);
            for(uid in curExpertList){
                if($.inArray( uid, matchedExpertList ) == -1){
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
            
            // console.log(curExpertList)
        })
    })
    
}

function makeCurExpertDetailTable(uid){
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
                    "<span>"+expertPersonalInfo["additionalInfo"]["Career"]+"</span>"+
                    "<p>저서, 논문, 수상</p>"+
                    "<span>"+expertPersonalInfo["additionalInfo"]["Reward"]+"</span>"+
                    "<p>간략 소개</p>"+
                    "<span>"+expertPersonalInfo["additionalInfo"]["Intro"]+"</span>"+
                    "<p>연락처</p>"+
                    "<span>연락처 : "+expertPersonalInfo["phoneNum"]+"</span>"+
                    "<p>이메일</p>"+
                    "<span>이메일 : "+curExpertInfo["email"]+"</span>"+
                "</section>"+
            "</div>"
        );
    })
}

function backToExpert(){
    $("#expert-list").show();
    $("#expert-detail").hide();
}

getEstimateList();