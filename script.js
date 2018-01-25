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
  var userName;

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
    userName = $(this).attr("name")
    var userDobDay = $(this).attr("day")
    var userDobMonth = $(this).attr("month")
    var queryUrl = "http://history.muffinlabs.com/date/" + userDobMonth + "/" + userDobDay
    $.ajaxPrefilter(function(options){
        if(options.crossDomain && jQuery.support.cors) {
            options.url = "https://cors-anywhere.herokuapp.com/" + options.url;
        }
    })
    $.ajax({
        url: queryUrl,
        method: "GET"
    }).done(function(response){
        var returnInfo = JSON.parse(response);
        var text = returnInfo.data.Events[0].text;
        var yearOccur = returnInfo.data.Events[0].year;
        var p = $("<p>")
        p.text("Hi " + userName + ", In the year " + yearOccur + " on the day you were born " + text)
        $("#results-container").append(p)
    })
})

document.onkeydown = function(event){
    if(event.which === 13){
        $("#results-container").empty()
        console.log("test")
        userName = $("#name-input").val().trim()
        var userDobDay = $("#dob-input-day").val()
        var userDobMonth = $("#dob-input-month").val()
        var userDobYear = $("#dob-input-year").val()
        $.ajaxPrefilter(function (options) {
            if (options.crossDomain && jQuery.support.cors) {
                options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
            }
        });

        userStorage.push({
            name: userName,
            dobDay: userDobDay,
            dobMonth: userDobMonth,
            dobYear: userDobYear
        })

        var queryUrl = "http://history.muffinlabs.com/date/" + userDobMonth + "/" + userDobDay
        console.log(queryUrl)
        
        $.ajax({
            url: queryUrl,
            method: "GET"
        }).done(function(response){
            var returnInfo = JSON.parse(response)
            var text = returnInfo.data.Events[0].text;
            var yearOccur = returnInfo.data.Events[0].year;
            var p = $("<p>")
            p.text("Hi " + userName + ", In the year " + yearOccur + " on the day you were born " + text)
            $("#results-container").append(p)
        })
        
        $.ajax({
            url: "https://wordsapiv1.p.mashape.com/words/" + userName,
            data: { "X-Mashape-Key": "KTvKMGaySOmsh75NGO7T8aR3MBbwp1rfNdIjsnwdXomPepANNE" },
            method: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('X-Mashape-Key', 'KTvKMGaySOmsh75NGO7T8aR3MBbwp1rfNdIjsnwdXomPepANNE') }
        }).done(function (response) {
            console.log(response);
            var nameObj = response;
            var definition = nameObj.results[0]["definition"];
            console.log(definition);
            var p = $("<p>")
            p.text("Your name means " + definition)
            $("#results-container").append(p)
        });
    
    }

}