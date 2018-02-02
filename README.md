[![alt text](https://stoversa.github.io/project-1/helloworld_logo.png "Hello World Logo")](https://jonathantcallahan.github.io/project-1/index.html)

# Narcisist

## Purpose
Narcisist is a web-based application that utilizes multiple APIs to deliver vanity information based on a user's birth-date and name input. Future plans for this application include a user-specific dashboard, horoscope, and horoscope-based compatibility information.

### Using This Code

To customize your own application, swap your own Firebase project in the config.js file. Do note that you'll also need to update your project's authentication settings to match those used by the application, or change the appilcation settings to suit your needs.

### APIs Utilized

1. [Today in History](http://history.muffinlabs.com/ "Today in History") - TiH takes  a date input and returns a fact about a date in history.
2. [Words API](https://www.wordsapi.com/ "Words API") - Words API receives a word input and returns a number of pieces of information. We use the definition response to provide name meanings and name association.
3. [Numbers API](http://numbersapi.com/ "Numbers API") - This API has a number of functions, but our application utlilized its day in history functionality.

### Other Technologies Used

1. [Firebase (Google)](https://firebase.google.com/ "Firebase (Google)") - For authentication and database storage.
2. [CORS Everywhere](https://github.com/Rob--W/cors-anywhere/ "CORS Everywhere") - This resource was instrumental for resolving CORS-related issues. 

### Issues
1.  [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS "Cross-Origin Resource Sharing (CORS)") compatibility issues
2. Firebase Authentication


### Winter 2018 Team Members
* [Jonathan Callahan](https://github.com/jonathantcallahan)
* [Erick Grissom](https://github.com/GrissomErick)
* [Zach Harmon](https://github.com/zachha)
* [Sam Stover](https://github.com/stoversa)