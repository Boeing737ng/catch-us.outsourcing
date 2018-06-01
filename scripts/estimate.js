$("input[name=area]").change(function(){
    if($(this).is(':checked')) {
        $(".area").attr('disabled', 'disabled').css("opacity","0.5");
    } else {
        $(".area").removeAttr('disabled').css("opacity","1");
    }
});

$("#area-no-matter-text").click(function(){
    $("input[name=area]").click();
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
        field : getSelectedField(),
        keyword : $("#key-word").val(),
        details : $("#details").val(),
        date : getCurrentDate(),
        uid : currentUid
    };
    return EstimateInfo;
}

function getSelectedField(){
    var selectedField = $(".selected-field");
    var selectedList = [];
    for(var i = 0; i<selectedField.length; i++){
        selectedList.push($(".selected-field")[i].text);
    }
    return selectedList;
}

function getArea(){
    if($("input[name=area]").is(':checked')){
        return "지역 무관";
    }
    areaStr = $("#sido_code option:selected").text()+" "+$("#sigoon_code option:selected").text()+" "+$("#dong_code option:selected").text();
    if(areaStr.match("선택") != null){
        return "area error";
    }
    return areaStr
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
    var estimateInfo = getEstimateInfo();
    console.log(estimateInfo);
    if(estimateInfo["area"] == "area error"){
        alert("지역을 선택해 주세요.");
        return;
    } else if(estimateInfo["field"].length < 1){
        alert("분야를 선택해 주세요.");
        return;
    } else if(estimateInfo["details"].length < 2){
        alert("중요 키워드를 작성해 주세요.");
        return;
    } else if(estimateInfo["keyword"].length < 2){
        alert("출원 상세내용을 선택해 주세요.");
        return;
    }
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

$(".field").click(function(){
    if($(this).hasClass("selected-field")){
        $(this).removeClass("selected-field");
    }
    else {
        $(this).addClass("selected-field");
    }
});