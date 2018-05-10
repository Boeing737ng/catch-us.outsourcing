// 기본 회원가입
function firebaseSignup(email, password){
    return firebase.auth().createUserWithEmailAndPassword(email, password);
}

// 의뢰인 회원가입
function clientSignup(email, password, info){
    firebaseSignup(email, password).then(function(user){
        writeClientData(user.user.uid, info);
    })
}

function writeClientData(uid, info){
    firebase.database().ref("Users/" + uid).set({
        personalInfo:{
            type:"Client",
            nicName:info
        }
    });
}

// 전문가 회원가입
function expertSignup(email, password, info){
    firebaseSignup(email, password).then(function(user){
        writeExpertData(user.user.uid, info);
    })
}

function writeExpertData(uid, info){
    firebase.database().ref("Users/" + uid).set({
        personalInfo:{
            type : "Expert",
            name : info["name"],
            affiliation : info["affiliation"],
            phoneNum : info["phoneNum"],
            address : info["address"],
            qualificationDate : info["qualificationDate"],
            agentNum : info["agentNum"],
            fieldList : info["fieldList"],
            profileUrl : info["profileUrl"],
            additionalInfo : info["additionalInfo"]
        }
    });
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