$("input[name=area]").change(function(){
    if($(this).is(':checked')) {
        $(".area").attr('disabled', 'disabled');
    } else {
        $(".area").removeAttr('disabled');
    }
});

var currentUid = '';

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        currentUid = user.uid;
    } else {
        alert("로그인이 필요합니다.");
        onLoadMainPage();
    }
});

function getEstimateInfo(){
    var EstimateInfo = {
        area : getArea(),
        field : "특허/실용 방안",
        keyword : $("#key-word").val(),
        details : $("#details").val(),
        date : getCurrentDate(),
        uid : currentUid
    };
    return EstimateInfo;
}

function getArea(){
    if($("input[name=area]").is(':checked')){
        return "No matter";
    }
    return $("#sido_code option:selected").text()+" "+$("#sigoon_code option:selected").text()+" "+$("#dong_code option:selected").text()
}

function getCurrentDate(){
    var curDate = new Date()
    var year = curDate.getFullYear()
    var month = curDate.getMonth()+1;
    var date = curDate.getDate();
    month < 10 ? "0"+month : ""+month;
    date < 10 ? "0"+date : ""+date;
    return year+"-"+month+"-"+date;
}

function uploadEstimate(){
    showLoading();

    firebase.database().ref("Estimates/"+ Date.now()).set(
        getEstimateInfo()
    ).then(
        function(){
            onLoadClitentPage();
        },
        function(error){
            console.log("uploadEstimate err : "+error);
            nonLoading();
        }
    );

    // firebase.database().ref("Users/"+ currentUid +"/Estimates/"+ Date.now()).set(
    //     getEstimateInfo()
    // ).then(
    //     function(){
    //         onLoadClitentPage();
    //     },
    //     function(error){
    //         console.log("uploadEstimate err : "+error);
    //     }
    // );
}