/********** Firebase initialization: If forking, add your credentials to config const in config.js    ***********/
firebase.initializeApp(config);
var userStorage = firebase.database().ref("user-storage/notloggedin")


// The following code is for firebase authentication/login
var provider = new firebase.auth.GithubAuthProvider();

// FirebaseUI config.
var uiConfig = {
    callbacks: {
        signInSuccess: function (currentUser, credential, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            return true;
        },
        uiShown: function () {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('loader').style.display = 'none';
        }
    },
    signInSuccessUrl: 'index.html',
    signInOptions: [
        {
            provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            scopes: [
                'https://www.googleapis.com/auth/plus.login'
            ],
            customParameters: {
                // Forces account selection even when one account
                // is available.
                prompt: 'select_account'
            }
        },
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GithubAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>'
};

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);

initApp = function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            $("#firebaseui-auth-container").css("display", "none");
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var uid = user.uid;
            app.uid = uid;
            userStorage = firebase.database().ref("user-storage/" + app.uid);
            console.log(app.uid);
            app.buttonListener();
            var phoneNumber = user.phoneNumber;
            var providerData = user.providerData;
            user.getIdToken().then(function (accessToken) {
                document.getElementById('sign-in-status').textContent = 'Signed in';
                document.getElementById('sign-in').textContent = 'Sign out';
                document.getElementById('account-details').textContent = JSON.stringify({
                    displayName: displayName,
                    email: email,
                    emailVerified: emailVerified,
                    phoneNumber: phoneNumber,
                    photoURL: photoURL,
                    uid: uid,
                    accessToken: accessToken,
                    providerData: providerData
                }, null, '  ');
            });
        } else {
            // User is signed out.
            document.getElementById('sign-in-status').textContent = 'Signed out';
            document.getElementById('sign-in').textContent = 'Sign in';
            document.getElementById('account-details').textContent = 'null';
        }
    }, function (error) {
        console.log(error);
    });
};

window.addEventListener('load', function () {
    initApp()
});
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .then(function () {
        // Existing and future Auth states are now persisted in the current
        // session only. Closing the window would clear any existing state even
        // if a user forgets to sign out.
        // ...
        // New sign-in will be persisted with session persistence.
        return firebase.auth().signInWithEmailAndPassword(email, password);
    })
    .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
    });

var app = {
    isRunning: false,
    fullMessage: ""
};
//Place for our API calls
/***** object for our API calls *******/
var api = {
    callNameAPI: function () {
        app.textTwoAdded = false;
        app.textTwo = "";
        $.ajax({
            url: "https://wordsapiv1.p.mashape.com/words/" + app.userName,
            data: { "X-Mashape-Key": "KTvKMGaySOmsh75NGO7T8aR3MBbwp1rfNdIjsnwdXomPepANNE" },
            method: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('X-Mashape-Key', 'KTvKMGaySOmsh75NGO7T8aR3MBbwp1rfNdIjsnwdXomPepANNE') }
        }).done(function (response) {
            var nameObj = response;
            if (nameObj.results) {
                var definition = nameObj.results[0]["definition"];
                app.textTwo = definition;
            }
            else {
                console.log("No definition from Name API");
            }
        });
    },
    callHistory: function () {
        //this API requires CORS in order to function properly. This method might be deprecated/not supported in future versions of certain Web browsers.
        var queryUrl = "https://cors-anywhere.herokuapp.com/" + "http://history.muffinlabs.com/date/" + app.userDobMonth + "/" + app.userDobDay
        // $.ajaxPrefilter(function (options) {
        //     if (options.crossDomain && jQuery.support.cors) {
        //         options.url = "https://cors-anywhere.herokuapp.com/" + options.url;
        //     }
        // })
        $.ajax({
            url: queryUrl,
            method: "GET"
        }).done(function (response) {
            var returnInfo = JSON.parse(response);
            var x = Math.floor(Math.random() * returnInfo.data.Events.length); //randomizes the response we add to the page (next 2 lines)
            app.text = returnInfo.data.Events[x].text;
            app.yearOccur = returnInfo.data.Events[x].year; //some responses arrive with a term proceded by a colon and text. This removes the colon and preceding term
            if (app.text.indexOf(":") > -1) {
                app.text = app.text.split(":");
                app.text = app.text[1];
            }
            //Typing animation
            if (app.typeAnimationTimeout != "") {
                clearTimeout(app.typeAnimationTimeout);
                $("#results-container").empty();
            };
            app.letterCount = 0; //resets the letter count for our "loop" when we run typeAnimation
            app.fullMessage = ("Hi " + app.userName + ", on the day you were born, in the year " + app.yearOccur + ":  " + app.text)
            app.typeAnimation();
        })
    },
    callNumbers: function () {
        app.textThree = "";
        $.ajax({
            url: "https://cors-anywhere.herokuapp.com/" + "http://numbersapi.com/" + app.userDobYear + "/year?fragment&json",
            method: "GET"
        }).done(function (response) {
            if (response) {
                var obj = response;
                app.textThree = obj.text;
            }
            else (console.log("No Numbers Response"));
        })
    }
}; //end API object
/***** app object stores application functions and variables *******/
var app = {

    //variables
    uid: "",
    userName: "",
    userDob: "", //user's full date of birth, taken from UI
    userDobDay: "", //parsed day from Dob
    userDobMonth: "", //parsed month from Dob
    userDobYear: "", //parsed year from Dob
    text: "", //text from initial API call
    textTwo: "", //text from second API call
    textThree: "", //text from third API call
    textTwoAdded: false, //indicates that the text from second API call was added to the results container
    fullMessage: "", //this variable is currently just used in typeAnimation(); takes the text from an API call with some additioanl explanation and prints it to the UI
    typeAnimationTimeout: "", //timeout for our typeAnimationTimeoutFunction
    letterCount: 0, //this value allows us to increment the typeAnimation function

    //animates page with info from first API, then checks for additional APIs
    typeAnimation: function () {
        if (app.letterCount === app.fullMessage.length) {
            if (app.textTwoAdded === false) { //if we have received a response from Words API
                app.addSecondText(); //add its text to our results using this function
            };
        }
        else {
            var character = app.fullMessage.charAt(app.letterCount);
            var information = $("#results-container").text();
            $("#results-container").text(information + character);
            app.letterCount++;
            app.typeAnimationTimeoutFunction();
        }
    },
    typeAnimationTimeoutFunction: function () {
        var speed = 50;
        app.typeAnimationTimeout = setTimeout(app.typeAnimation, speed);
    },
    addSecondText: function () {
        app.letterCount = 0;
        clearTimeout(app.typeAnimationTimeout);
        if (app.textTwo !== "") {
            console.log("business as usual")
            app.fullMessage = " Your name is most commonly associated with:  " + app.textTwo + ".";
        }
        else {
            console.log("no second message")
            app.fullMessage = " And in the year you were born, " + app.textThree + ".";
        };
        app.textTwoAdded = true; //prevents an endless loop from the logic above in typeAnimation()
        app.typeAnimation(); //appends to date in history
    },

    //generates buttons onload
    populateButtons: function (snapshot) {
        var key = snapshot.key; //grabs the unique Firebase key associated with each name/dob entry
        var p = $("<p>");
        var span = $("<span>").text("X").addClass("remove");
        var div = $("<div>");
        span.attr("key", key);
        p.text(snapshot.val().name + " " + snapshot.val().dobMonth + "/" + snapshot.val().dobDay + "/" + snapshot.val().dobYear);
        p.attr("class", "user-button");
        p.attr("name", snapshot.val().name);
        p.attr("day", snapshot.val().dobDay);
        p.attr("month", snapshot.val().dobMonth);
        p.attr("year", snapshot.val().dobYear);
        div.append(p, span);
        $("#button-container").append(div);
    },
    //the following two functions deal with either inputting data to view content on the page, or viewing content for pre-existing users
    addNewName: function () {
        $("#results-container").empty();
        app.userName = $("#name-input").val().trim();
        app.userDob = $("#date").val();
        app.userDobDay = app.userDob.substring(app.userDob.length - 2);
        app.userDobMonth = app.userDob.substring(5, 7);
        app.userDobYear = app.userDob.substring(0, 4);

        userStorage.push({
            name: app.userName,
            dobDay: app.userDobDay,
            dobMonth: app.userDobMonth,
            dobYear: app.userDobYear
        })

        api.callHistory();
        api.callNameAPI();
        api.callNumbers();
    },

    //if a user clicks on a pre-existing name/dob button, return info
    clickButton: function (that) {
        $("#results-container").empty();
        app.userName = $(that).attr("name");
        app.userDobDay = $(that).attr("day");
        app.userDobMonth = $(that).attr("month");
        app.userDobYear = $(that).attr("year");
        api.callHistory();
        api.callNameAPI();
        api.callNumbers();
    },
    buttonListener: function () {
        app.populateButtons(snapshot)
        userStorage.on("child_added", function (snapshot) {
            console.log("buttons being added!")
        }, //pulls firebase info to the populate buttons function
            function (errData) {
                console.log("Unable to retreive data");
            }
        )
    }
}; //end app object

/************* Event listeners    *************/
// on-click event function for when a user clcks on a pre-existing serach's button
$(document).delegate(".user-button", "click", function () {
    var that = $(this);
    app.clickButton(that);
});

//delete function
$(document).delegate(".remove", "click", function () {
    var thisButton = $(this).parent();//grabs the parent of the remove button, so that we can delete from DOM
    var key = $(this).attr("key");//grabs key of the object we'll be deleting
    firebase.database().ref("user-storage/" + key).remove();//deletes the object in Firebase
    thisButton.remove();//removes containing button from DOM
});

// function when a user inputs name/dob 
document.onkeydown = function () {
    if (event.which === 13) {
        app.addNewName();
    };
};//adds new name/dob button and returns info about this input

$("#search").click(function () {
    event.preventDefault();
    var that = $(this);
    app.clickButton(that);
});

$("#logout").click(function(){
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
    }).catch(function (error) {
        // An error happened.
    });
});