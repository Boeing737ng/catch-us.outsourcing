var currentUid = '';
var estimateList = [];
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        currentUid = user.uid;
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
        estimateObj = snapshot.val();
        for(key in estimateObj){
            estimateValues = estimateObj[key];
            console.log(estimateValues)
            estimateRow = {
                key : key,
                area : estimateValues["area"], 
                date : estimateValues["date"], 
                details : estimateValues["details"],
                field : estimateValues["field"],
                keyword : estimateValues["keyword"]
            };
            estimateList.unshift(estimateRow);
        }
    });
}

function makeCurEstimateList(){
    $("#estimate-list")[0]
    estimateList.forEach(function(row){
        $("#estimate-list").append(
            "<div id='estimate'>"+row["area"]+"</div>"
        );
    });
}