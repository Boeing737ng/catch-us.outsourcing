var EstimatesList = {}
function getEstimateList(){
    var UserList = firebase.database().ref("/Users");
    showLoading();
    return UserList.once('value').then(
        function(snapshot){
            for(row of Object.values(snapshot.val())){
                if(row["Estimates"] != null){
                    $.extend(EstimatesList, row["Estimates"]);
                }
            }
            console.log(EstimatesList)
            noneLoading();
        }
    )
}

getEstimateList();