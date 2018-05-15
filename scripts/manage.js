var EstimatesList = []
function getEstimateList(){
    // var UserList = firebase.database().ref("/Users");
    // showLoading();
    // return UserList.once('value').then(
    //     function(snapshot){
    //         for(row of Object.values(snapshot.val())){
    //             if(row["Estimates"] != null){
    //                 $.extend(EstimatesList, row["Estimates"]);
    //             }
    //         }
    //         console.log(EstimatesList)
    //         noneLoading();
    //     }
    // )
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

function makeQuestionTable(){
    $(".estimate").remove()
    EstimatesList.forEach(function(row){
        $("#estimates").append(
            "<div id='estimate' onclick=\"func("+"'"+row["key"]+"'"+")\">"+row["uid"]+"</div>"
        );
    });
}

function func(key){
    var curEstimate = firebase.database().ref("/Estimates/"+key);
    curEstimate.once('value').then(function(snapshot){
        console.log(snapshot.val())
        firebase.database().ref("/Users/"+snapshot.val()["uid"]).once('value').then(function(snapshot2){
            console.log(snapshot2.val()["email"])
            console.log(snapshot2.val()["personalInfo"]["nickname"])
        }
        )
    })
}
getEstimateList();