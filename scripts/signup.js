var storageRef = firebase.storage().ref();
var name = "";
// 기본 회원가입
function firebaseSignup(email, password){
    return firebase.auth().createUserWithEmailAndPassword(email, password);
}

// 의뢰인 회원가입
function clientSignup(){
    var clientInfo = getClientInfo();
    showLoading();
    firebaseSignup(
        clientInfo["email"],
        clientInfo["password"]
    ).then(
        function(user){
            writeClientData(user.user.uid, clientInfo)
            .then(
                function(){
                alert("회원가입이 완료되었습니다.");
                onLoadMainPage();
                }, 
                function(error){
                    console.log("clientSignup second err : ", errer);
                    noneLoading();
                });
        },
        function(errer){
            console.log("clientSignup first err : ", errer);
            noneLoading();
        }
    )
}

function writeClientData(uid, info){
    return firebase.database().ref("Users/" + uid).set({
        email : info["email"],
        personalInfo : info["personalInfo"]
    });
}

function getClientInfo(){
    var singUpInfo = {
        email : $("#client-email")[0].value,
        password : $("#client-pwd")[0].value,
        personalInfo:{
            type : "Client",
            nickname : $("#client-nickname")[0].value
        }
    }

    return singUpInfo
}

// 전문가 회원가입
function expertSignup(){
    var expertInfo = getExpertInfo();
    showLoading();
    firebaseSignup(
        expertInfo["email"],
        expertInfo["password"]
    ).then(
        function(user){
            // $('#expert-profile').get(0).files[0]
            upLoadProfile(user.user.uid).then(
                function(snapshot){
                    
                    storageRef.child(name).getDownloadURL().then(
                        function(url){
                            expertInfo["personalInfo"]["profileUrl"] = url;
                            console.log(expertInfo);
                            writeExpertData(user.user.uid, expertInfo)
                            .then(
                                function(){
                                    alert("회원가입이 완료되었습니다.");
                                    onLoadMainPage();
                                },
                                function(error){
                                    console.log("expertSignup forth err : ", error);
                                    noneLoading();
                                }
                            );
                        },function(error){
                            console.log("expertSignup third err : ", error);
                            noneLoading();
                        }
                    )
                },
                function(){
                    console.log("expertSignup second err : ", error);
                   noneLoading(); 
                }
            );
        },
        function(error){
            console.log("expertSignup first err : ", error);
            noneLoading();
        }
    )
}

function writeExpertData(uid, info){
    return firebase.database().ref("Users/" + uid).set({
        email : info["email"],
        personalInfo : info["personalInfo"]
    });
}

function getExpertInfo(){
    var singUpInfo = {
        email : $("#expert-email")[0].value,
        password : $("#expert-pwd")[0].value,
        personalInfo:{
            type : "Expert",
            name : $("#expert-name")[0].value,
            affiliation : $("#expert-affiliation")[0].value,
            phoneNum : $("#expert-phone")[0].value,
            address : $("#expert-address")[0].value,
            qualificationDate : $("#expert-qualification")[0].value,
            agentNum : $("#expert-agent-num")[0].value,
            field : getSelectedField(),
            // profileUrl : '',
            additionalInfo : {
                Career : $("#expert-career")[0].value,
                Reward : $("#expert-reward")[0].value,
                Intro : $("#expert-intro")[0].value
            }
        }
    }
    
    return singUpInfo
}

function upLoadProfile(uid){
    const file = $('#expert-profile').get(0).files[0];
    fileNames = file.name.split(".");
    name = uid+"."+fileNames[fileNames.length-1];
    const metadata = {
        contentType: file.type
    };
    return storageRef.child(name).put(file, metadata);
}

function getSelectedField(){
    var selectedField = $(".selected-field");
    var selectedList = [];
    for(var i = 0; i<selectedField.length; i++){
        selectedList.push($(".selected-field")[i].text);
    }
    return selectedList;
}