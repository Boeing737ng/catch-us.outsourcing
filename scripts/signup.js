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
    if(!clientInfo["passwordCheck"]){
        alert("비밀번호를 확인해주세요.");
        $("#client-pwd")[0].focus();
        noneLoading();
        return;
    }else if(clientInfo["personalInfo"]["nickname"].length > 6 || clientInfo["personalInfo"]["nickname"].length < 2){
        alert("2이상 6이하의 닉네임을 사용해주세요.");
        $("#client-nickname")[0].focus();
        noneLoading();
        return;
    }
    
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
        function(error){
            console.log("clientSignup first err : ", error);
            console.log(error.code)
            if(error.code == 'auth/invalid-email'){
                alert("이메일 입력이 올바르지 않습니다.");
                $("#client-email")[0].focus();
            }else if(error.code == 'auth/weak-password'){
                alert("비밀번호 보안이 약합니다.");
                $("#client-pwd")[0].focus();
            }else if(error.code == 'auth/email-already-in-use'){
                alert('현재 사용중인 이메일이 있습니다.');
                $("#client-email")[0].focus();
            }
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
        passwordCheck : $("#client-pwd")[0].value == $("#client-pwd-check")[0].value,
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
    var personalInfo = expertInfo["personalInfo"]
    showLoading();
    // TODO :: 입력 데이터 정규화 검사 추가 수정 필요
    if(!expertInfo["passwordCheck"]){
        alert("비밀번호를 확인해주세요.");
        $("#expert-pwd")[0].focus();
        noneLoading();
        return;
    }else if(personalInfo["name"].length < 2){
        alert("성명을 확인해주세요.");    
        $("#expert-name")[0].focus();
        noneLoading();
        return;
    }else if(personalInfo["affiliation"].length < 2){
        alert("소속을 확인해주세요.");   
        $("#expert-affiliation")[0].focus();
        noneLoading();
        return;
    }else if(personalInfo["phoneNum"].length < 5){
        alert("전화번호를 확인해주세요.");   
        $("#expert-phone")[0].focus();
        noneLoading();
        return;
    }else if(personalInfo["address"].length < 2){
        alert("주소를 확인해주세요.");   
        $("#expert-address")[0].focus();
        noneLoading();
        return;
    }else if(personalInfo["qualificationDate"].length < 2){
        alert("자격취득일을 확인해주세요.");   
        $("#expert-qualification")[0].focus();
        noneLoading();
        return;
    }else if(personalInfo["agentNum"].length < 2){
        alert("대리인 번호를 확인해주세요.");   
        $("#expert-agent-num")[0].focus();
        noneLoading();
        return;
    }else if(personalInfo["field"].length < 1){
        alert("분야를 확인해주세요.");
        noneLoading();
        return;
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
            if(error.code == 'auth/invalid-email'){
                alert("이메일 입력이 올바르지 않습니다.");
                $("#expert-email")[0].focus();
            }else if(error.code == 'auth/weak-password'){
                alert("비밀번호 보안이 약합니다.");
                $("#expert-pwd")[0].focus();
            }else if(error.code == 'auth/email-already-in-use'){
                alert('현재 사용중인 이메일이 있습니다.');
                $("#expert-email")[0].focus();
            }
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
        passwordCheck : $("#expert-pwd")[0].value == $("#expert-pwd-check")[0].value,
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