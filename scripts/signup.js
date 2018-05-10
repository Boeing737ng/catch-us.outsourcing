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
        writeClientData(user.user.uid, clientInfo["personalInfo"]);
    })
}

function writeClientData(uid, info){
    firebase.database().ref("Users/" + uid).set({
        personalInfo : info
    });
}

function getClientInfo(){
    var singUpInfo = {
        email : $("#client-email").value,
        password : $("#client-pwd").value,
        personalInfo:{
            type : "Client",
            nickname : $("#client-nickname").value
        }
    }

    return singUpInfo
}

// 전문가 회원가입
function expertSignup(email, password, info){
    var expertInfo = getExpertInfo()
    firebaseSignup(
        expertInfo["email"],
        expertInfo["password"]
    ).then(function(user){
        writeExpertData(user.user.uid, expertInfo["personalInfo"]);
    })
}

function writeExpertData(uid, info){
    firebase.database().ref("Users/" + uid).set({
        personalInfo : info
    });
}

function getExpertInfo(){
    var singUpInfo = {
        email : $("#expert-email").value,
        password : $("#expert-pwd").value,
        personalInfo:{
            type : "Expert",
            name : $("#expert-name").value,
            affiliation : $("#expert-affiliation").value,
            phoneNum : $("#expert-phone").value,
            address : $("#expert-address").value,
            qualificationDate : $("#expert-qualification").value,
            agentNum : $("#expert-agent-num").value,
            fieldList : $("#expert-field").value,
            profileUrl : $("#expert-profile").value,
            additionalInfo : {
                Career : $("#expert-career").value,
                Reward : $("#expert-reward").value,
                Intro : $("#expert-intro").value
            }
        }
    }
    
    return singUpInfo
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