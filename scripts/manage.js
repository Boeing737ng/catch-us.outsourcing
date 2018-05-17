var EstimatesList = [];
var curExpertList = {};

$("#submit-selected-expert").click(function(){
    alert('ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ');
});

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
    getExpertList().then(function(snapshot){
        curExpertList = snapshot.val();
        for(uid in curExpertList){
            expertInfo = curExpertList[uid]["personalInfo"];
            console.log(expertInfo)
            $("#expert-list").append(
                "<div class='experts'>"+
                    "<div class='expert-info-wrapper'>"+
                        "<div class='expert-image-wrapper'>"+
                            "<img src=\""+expertInfo["profileUrl"]+"\">"+
                        "</div>"+
                        "<label class='select-wrapper'>"+
                            "<input class='select-expert' type='checkbox'>"+
                            "<span class='checkmark'></span>"+
                        "</label>"+
                        "<a class='view-details' onclick=\"makeCurExpertInfoTable('"+uid+"')\">상세 보기</a>"+
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
        // console.log(curExpertList)
    })
}

function makeCurExpertInfoTable(uid){
    $("#expert-list").hide();
    $("#expert-detail").show();
    $(".cur-expert").remove();
    var UserList = firebase.database().ref("/Users/"+uid);
    UserList.once('value').then(function(snapshot){
        curExpertInfo = snapshot.val();
        console.log(curExpertInfo)
        expertPersonalInfo = curExpertInfo["personalInfo"];
        $("#expert-detail").append(
            "<div class='cur-expert'>"+
                "<img src=\""+expertPersonalInfo["profileUrl"]+"\" style=\"with:100px; height:100px\">"+
                "<div>이름 : "+expertPersonalInfo["name"]+" 변리사</div>"+
                "<div>주요 분야 : "+expertInfo["field"].toString()+"</div>"+
                "<div>소속 : "+expertPersonalInfo["affiliation"]+" ("+expertPersonalInfo["address"]+")</div>"+
                "<div>경력 사항 : "+expertPersonalInfo["additionalInfo"]["Career"]+"</div>"+
                "<div>저서, 논문, 수상 : "+expertPersonalInfo["additionalInfo"]["Reward"]+"</div>"+
                "<div>간략 소개 : "+expertPersonalInfo["additionalInfo"]["Intro"]+"</div>"+
                "<div>연락처 : "+expertPersonalInfo["phoneNum"]+"</div>"+
                "<div>이메일 : "+curExpertInfo["email"]+"</div>"+
            "</div>"
        );
    })
}

// 수정 필요
function func(key){
    var curEstimate = firebase.database().ref("/Estimates/"+key);
    $("#cur-estimate").remove();
    curEstimate.once('value').then(function(snapshot){
        estimateInfo = snapshot.val();
        firebase.database().ref("/Users/"+snapshot.val()["uid"]).once('value').then(function(snapshot2){
            usrInfo = snapshot2.val();
            $("#estimate-info").append(
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

function backToExpert(){
    $("#expert-list").show();
    $("#expert-detail").hide();
}

getEstimateList();