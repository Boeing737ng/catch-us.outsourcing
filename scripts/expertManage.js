var currentUid = "";

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
        noneLoading();
        console.log(matchedEstimateList);
    })
}