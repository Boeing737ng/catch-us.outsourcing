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
            "<div id='"+row["key"]+"' class='estimates'>"+
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