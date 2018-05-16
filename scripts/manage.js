var EstimatesList = []
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
            makeQuestionTable();
            noneLoading();
        },
        function(error){
            console.log("getEstimateList err : "+error);
            noneLoading();
        }
    )
}

// 수정 필요
function makeQuestionTable(){
    EstimatesList.forEach(function(row){
        $("#estimate-list").append(
            "<div id='"+row["key"]+"' class='estimates' onclick=\"func("+row["key"]+")\">"
            +"<div>지역</div>"
            +"<div>"+row["area"]+"</div>"
            +"<div>분야</div>"
            +"<div>"+row["field"]+"</div>"
            +"<div>내용</div>"
            +"<div>"+row["details"]+"</div>"
            +"<div>요청일</div>"
            +"<div>"+row["date"]+"</div>"
            +"<div>--------------------------------------</div>"
            +"</div>"
        );
    });
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

getEstimateList();