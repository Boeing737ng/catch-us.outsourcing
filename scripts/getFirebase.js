
function getExpertList(){
    var UserList = firebase.database().ref("/Users");
    return UserList.orderByChild("personalInfo/type").equalTo("Expert").once('value')
    // .then(
    //     function(snapshot){
    //         return snapshot.val();
    //     }
    // )
}
