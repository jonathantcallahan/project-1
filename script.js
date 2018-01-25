var config = {
    apiKey: "AIzaSyBbGCe-jyKFshGLnmOdwHzIEOX7bIWaLgw",
    authDomain: "project-5f04c.firebaseapp.com",
    databaseURL: "https://project-5f04c.firebaseio.com",
    projectId: "project-5f04c",
    storageBucket: "",
    messagingSenderId: "260716117815"
  };

  firebase.initializeApp(config);
  var userStorage = firebase.database().ref("user-storage")

  userStorage.on("child_added",function(snapshot){
        console.log(snapshot.val())
    },
    function(errData){
        console.log("Unable to retreive data")
    }
)

document.onkeydown = function(event){
    if(event.which === 13){
        console.log("test")
        var userName = $("#name-input").val()
        var userDobDay = $("#dob-input-day").val()
        var userDobMonth = $("#dob-input-month").val()
        var userDobYear = $("#dob-input-year").val()
        
        userStorage.push({
            name: userName,
            dobDay: userDobDay,
            dobMonth: userDobMonth,
            dobYear: userDobYear
        })

        var queryUrl = "http://history.muffinlabs.com/date/" + userDobMonth + "/" + userDobDay
        $.ajax({
            url: queryUrl,
            method: "GET"
        }).done(function(response){
            console.log(response)
        })
    }

}