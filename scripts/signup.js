var storageRef = firebase.storage().ref();

// 기본 회원가입
function firebaseSignup(email, password){
    return firebase.auth().createUserWithEmailAndPassword(email, password);
}

// 의뢰인 회원가입
function clientSignup(){
    var clientInfo = getClientInfo()
    firebaseSignup(
        clientInfo["email"],
        clientInfo["password"]
    ).then(function(user){
        writeClientData(user.user.uid, clientInfo["personalInfo"])
        .then(function(){
            alert("회원가입이 완료되었습니다.");
            onLoadMainPage();
        });
    })
}

function writeClientData(uid, info){
    return firebase.database().ref("Users/" + uid).set({
        personalInfo : info
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
    var expertInfo = getExpertInfo()
    firebaseSignup(
        expertInfo["email"],
        expertInfo["password"]
    ).then(function(user){
        // $('#expert-profile').get(0).files[0]
        upLoadProfile(user.user.uid).then(function(snapshot){
            console.log(snapshot)
            expertInfo["personalInfo"]["profileUrl"] = snapshot.task.uploadUrl_;
            console.log(expertInfo);
            writeExpertData(user.user.uid, expertInfo["personalInfo"]);
        });
    })
}

function writeExpertData(uid, info){
    firebase.database().ref("Users/" + uid).set({
        personalInfo : info
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
            // fieldList : $("#expert-field")[0].value,
            profileUrl : '',
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
    const name = uid+"."+fileNames[fileNames.length-1];
    const metadata = {
        contentType: file.type
    };
    return storageRef.child(name).put(file, metadata);
}
// 전문가 테스트 정보
// var info = {
//     "additionalInfo" : {
//         "Career" : "경력사항", 
//         "Reward" : "논문,수상 등", 
//         "Intro" : "간단소개"
//     },
//     "address" : "대전",
//     "affiliation" : "칠사공",
//     "agentNum" : "111992",
//     "fieldList" : ["기계", "컴퓨터", "전자"],
//     "name" : "김승태",
//     "phoneNum" : "010-0000-0000",
//     "profileUrl" : "www.asdf.com",
//     "qualificationDate" : "2010"
// }