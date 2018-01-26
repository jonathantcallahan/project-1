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

$.ajaxPrefilter(function (options) {
    if (options.crossDomain && jQuery.support.cors) {
        options.url = "https://cors-anywhere.herokuapp.com/" + options.url;
    }
})
//Place for our API calls
var api = {
    callNameAPI: function (userName) {
        $.ajax({
            url: "https://wordsapiv1.p.mashape.com/words/" + userName,
            data: { "X-Mashape-Key": "KTvKMGaySOmsh75NGO7T8aR3MBbwp1rfNdIjsnwdXomPepANNE" },
            method: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('X-Mashape-Key', 'KTvKMGaySOmsh75NGO7T8aR3MBbwp1rfNdIjsnwdXomPepANNE') }
        }).done(function (response) {
            console.log(response);
            var nameObj = response;
            var definition = nameObj.results[0]["definition"];
            var p = $("<p>")
            p.text("Your name means " + definition)
            $("#results-container").append(p)
        });
    },
    callHistory: function (month, day, userName) {
        var queryUrl = "http://history.muffinlabs.com/date/" + month + "/" + day
        console.log(queryUrl)

        $.ajax({
            url: queryUrl,
            method: "GET"
        }).done(function (response) {
            var returnInfo = JSON.parse(response);
            var x = Math.floor(Math.random() * returnInfo.data.Events.length); //randomizes the response we add to the page (next 2 lines)
            var text = returnInfo.data.Events[x].text;
            if(text.indexOf(":") > -1){ 
                text = text.split(":")
                console.log(text)
                text = text[1]
            }
            var yearOccur = returnInfo.data.Events[x].year;
            var p = $("<p>")
            p.text("Hi " + userName + ", In the year " + yearOccur + " on the day you were born " + text)
            $("#results-container").append(p)
        })
    }
}

  userStorage.on("child_added",function(snapshot){
        console.log(snapshot.val())
        var p = $("<p>")
        p.text(snapshot.val().name + " " + snapshot.val().dobMonth + "/" + snapshot.val().dobDay + "/" + snapshot.val().dobYear)
        p.attr("class", "user-button")
        p.attr("name", snapshot.val().name)
        p.attr("day",snapshot.val().dobDay)
        p.attr("month",snapshot.val().dobMonth)
        $("#button-container").append(p)
    },
    function(errData){
        console.log("Unable to retreive data")
    }
)

$(document).delegate(".user-button","click",function(){
    $("#results-container").empty()
    console.log("test")
    var userName = $(this).attr("name")
    var userDobDay = $(this).attr("day")
    var userDobMonth = $(this).attr("month")
    api.callHistory(userDobMonth, userDobDay, userName);
    api.callNameAPI(userName);
})

document.onkeydown = function(event){
    if(event.which === 13){
        $("#results-container").empty()
        console.log("test")
        var userName = $("#name-input").val().trim()
        var userDob = $("#date").val();
        var userDobDay = userDob.substring(userDob.length - 2);
        var userDobMonth = userDob.substring(5, 7);
        var userDobYear = userDob.substring(0, 4);

        userStorage.push({
            name: userName,
            dobDay: userDobDay,
            dobMonth: userDobMonth,
            dobYear: userDobYear
        })

        api.callHistory(userDobMonth, userDobDay, userName);
        api.callNameAPI(userName);
    }
}