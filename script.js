

document.onkeydown = function(event){
    if(event.which === 13){
        console.log("test")
        var userName = $("#name-input").val()
        var userDobDay = $("#dob-input-day").val()
        var userDobMonth = $("#dob-input-month").val()
        var queryUrl = "http://history.muffinlabs.com/date/" + userDobMonth + "/" + userDobDay
        $.ajax({
            url: queryUrl,
            method: "GET"
        }).done(function(response){
            console.log(response)
        })
    }

}