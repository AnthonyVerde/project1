// VARIABLES --------------------------------------------

//      OBJECTS
var intervalId; // Holds setInterval that runs the stopwatch


//      ARRAYS
var cardsArray = []; // Will hold the URLs fr all cards in te grid
var urlArray = []; // Will hold the URL of card one and card two
var indexArray = []; // Will hold the index of card one and card two

//      STRINGS/CHAR
var userName = ''; // User's name
var userCountry = ''; // User's country name
var mode = ''; // Type of game selected [EASY, TIMED, CHALLENGE]
var firstPick = ""; // Index of the first card picked
var secondPick = ""; // Index of the second card picked

//      NUMBER/INTEGER
var pairs = 0; // Pair of cards that will be in the grid
var tries = 0; // Number of pairs fliped in a game
var time = 0; // Time to beat every game
var games = 0; // Number of games played
var pairsMatched = 0; // Number of pairs matched in a game

//      BOOLEAN
var timer = false; // The game requires to show and use timer
var challenge = false; // The player is on 'challenge' mode
var finishGame = false; // TRUE if all pairs have been found in a game


// Creating a "player info" object using constructor notation
function playerInfo(playerName, playerCountry, ) {
    this.name = playerName; // Player's name
    this.country = playerCountry; // Player's choice
}

var player = new playerInfo('', ''); // Contains CURRENT player info

// ------------------------------------------------------------

// $("#container-leaderboard").hide();
$("#leaderboard-btn").on("click", function() {
    $("#container-leaderboard").fadeToggle(2000);
});
$("#input-fields").hide();


$(document).ready(function () {

    // $("#gifBox").css("pointer-events","none");

    /*******************************************
     * Randomize array element order in-place. *
     * Using Durstenfeld shuffle algorithm.    *
     *******************************************/
    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    // Use the API to get the URL to the GIFs used on the card's front
    function getGifURL() {
        // Empty array with URL of cards
        cardsArray = [];

        //////////////////////// superheroapi ////////////////////////
        const KEY = '10161297457820113';

        //var queryURL = `https://cors-anywhere.herokuapp.com/http://superheroapi.com/api.php/${KEY}/search/man`;
        var queryURL = `http://superheroapi.com/api.php/${KEY}/search/man`;


        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            // Get the URL to the image into the cardsArray... twice!
            // note to [22,23,50,57] Numbers to avoid(no Imgs)????

            // Built carsArray with URL to character images
            for (let p = 0; p < pairs; p++) {

                // Generate random number between 1 and 63 - to randomize character image
                var index = Math.floor(Math.random() * 63) + 1;

                // Confirm the index is not one of th eones with missing images
                switch (index) {
                    case 22:
                    case 23:
                    case 50:
                    case 57:
                        // Yup... no images for these indexes... try again
                        //console.log("Selected: " + index + "  Trying again");

                        // Reduce the iteration variable so to get a new value
                        p--;
                        break;

                    default:
                        // For all other cases push the URL to the image into cardsArray... twice! 
                        cardsArray.push(response.results[index].image.url);
                        cardsArray.push(response.results[index].image.url);
                        break;
                }
            }

            // Randomize the positions of the cardsArray
            shuffleArray(cardsArray);

            // Show the BACK of the cards
            displayCards();
        });
        //////////////////////////////////////////////////////////////

    }

    // Show the cards in the board
    function displayCards() {

        // Resize the container of the cards
        switch (parseInt(pairs)) {
            case 2:
                // For 2 pairs only (4 cards)
                var boxWidth = 250;
                break;

            case 3, 4:
                // For 3 pairs (6 cards) and 4 pairs (8 cards)
                var boxWidth = 370;
                break;

            default:
                // For 5 pairs or more
                var boxWidth = 490; 
                break;
        }

        //console.log("Pairs: " + pairs + "   Width: " + boxWidth);

        // Set the with of the cards grid
        $("#gifBox").css("width", boxWidth);

        // Remove all the existing cards
        $("#gifs").html("");

        // For each GIF append an element to the DOM
        for (var c in cardsArray) {

            // Create a CARD div
            var cardDiv = $("<div>").addClass("card m-2");

            // Append the character image to the front of the card, but HIDE this image - this to mimic the fact of the card being "facing donw"
            var cardImg = $("<img>").attr("src", cardsArray[c]).attr("id", "frnt" + c).css("display", "none").addClass("staticgif card-img-top").appendTo(cardDiv);

            // Append the image of the back if the card - this to mimic the fact of the card being "facing donw"
            var cardback = $("<img>").attr("src", "./assets/images/card_back.png").attr("id", "back" + c).attr("data-url", cardsArray[c]).addClass("staticgif card-img-top").appendTo(cardDiv);

            // Append each card
            $("#gifs").append(cardDiv);
        }
    }

    // Update the screen
    function updateScreen() {

        console.log("UPDATING");

        console.log("calling the clock")
        if (mode === "timed" || mode === "challenge") {
            timerRun(128);
        } else {}


        switch (mode) {
            case 'easy':
                console.log("EASY MODE");
                $("#welcome").hide();
                $("#game").show();

                $("#box-clock").hide();
                $("#box-matches").hide();
                $("#box-level").hide();

                updateStats();
                break;

            case 'timed':
                console.log("TIMED MODE");
                $("#welcome").hide();
                $("#game").show();

                $("#box-clock").show();
                $("#box-matches").hide();
                $("#box-level").hide();

                updateStats();
                break;

            case 'challenge':
                console.log("CHALLENGE MODE");
                $("#welcome").hide();
                $("#game").show();

                $("#box-clock").show();
                $("#box-matches").show();
                $("#box-level").show();

                updateStats();
                break;

            default:
                console.log("DEFAULT MODE");
                $("#welcome").show();
                $("#game").hide();
                // $("#stats").hide();
                break;
        }
    };

    // Update player stats
    function updateStats() {

        $("#app-logo").css("text-align", "start");
        $("#app-logo-img").css("width", "290px");
        $("#app-title").hide();


        $("#mode_lbl").text(mode.toLocaleUpperCase() + "MODE");

        if (!finishGame) {
            $("#matches").text(matches);
            $("#pairsm").text(pairsMatched);
            $("#tries").text(tries);
            $("#level").text(level);
        } else {
            var gameStats = $("<h1>").text("FOUND ALL PAIRS!").appendTo($("#info"));
        }


    }

    // Click on back of card
    $("#gifs").on("click", ".staticgif", function () {

        if (secondPick != "") {
            return;
        }

        // Save the ID of the clicked card
        // Making sure to remove the first 4 characters
        var choice = this.id.substr(4);

        // If the same card is clicked twice do nothing
        if (this.id.substr(4) === firstPick) {
            console.log("repeated");
            return;
        }

        if (firstPick === "") {
            firstPick = choice;
        } else if (firstPick != "" && secondPick === "") {

            secondPick = choice;
        }

        // Hide the back of the card
        $("#back" + choice).hide();

        // Show the front of the card
        $("#frnt" + choice).show();

        // Get the URL for the card
        urlArray.push(this.dataset.url)

        // Get the INDEX for the card
        indexArray.push(choice);

        if (firstPick != "" && secondPick != "") {
            // Add a try to the list
            tries++;

            // Wait some time to show both cards and then follow up
            setTimeout(function () {
                if (urlArray[0] === urlArray[1]) {
                    // The cards match, hide both cards

                    // console.log("CARDS MATCH!!");

                    // Hiding the front of the card
                    $("#frnt" + indexArray[0]).css("visibility", "hidden");
                    $("#frnt" + indexArray[1]).css("visibility", "hidden");

                    // Add a pair matched to the list
                    pairsMatched++;

                    if (pairsMatched * 2 === cardsArray.length) {

                        console.log("FINISHED ALL CARDS!");
                        finishGame = true;
                    }

                } else {
                    // The cards dont match, flip tham back
                    // console.log("Not a match");

                    // Hide the back of the card
                    $("#back" + indexArray[0]).show();
                    $("#frnt" + indexArray[0]).hide();
                    $("#back" + indexArray[1]).show();
                    $("#frnt" + indexArray[1]).hide();
                }

                // Empty the URL and index array
                urlArray = [];
                indexArray = [];

                // Switch back that the first card was picked
                firstPick = "";
                secondPick = "";

                // Update the game stats
                updateStats();

            }, 2000); // Wait this many miliseconds after the second card is picked


        }

    })

    // Player selects play mode
    $(".btnPlay").on("click", function (e) {
        e.preventDefault();

        // Get the mode from the button selected
        mode = this.id;

        // Get the # of pairs from the input form
        pairs = $('#pairsInput').val();

        switch (mode) {
            // EASY mode
            case 'easy':
                timer = false;
                challenge = false;
                break;

            case 'timed':
                // TIMED mode
                timer = true;
                challenge = false;
                break;

            case 'challenge':
                // CHALLENGE mode
                timer = true;
                challenge = true;
                break;
        }

        // Get the URL to the GIFs
        getGifURL();

        //Update screen
        updateScreen()

    })


    /********** ALL TIMER RELATED FUNCTIONS **********/
    function timerRun(timeToBeat) {

        // Stop timer
        timerStop();

        // Set time for the game
        time = timeToBeat;

        // Set interval to 1 second
        clearInterval(intervalId);
        intervalId = setInterval(decrement, 1000);
    }

    function timerStop() {
        // Return clock to 00
        clearInterval(intervalId);
    }

    function decrement() {

        //  Decrease time by one.
        time--;

        //  Update the time 
        $("#clock").text(fancyTimeFormat(time));

        //  When run out of time...
        if (time <= 0) {

            //  Update the time 
            $("#clock").text("Time's up!");

            // Stop timer
            timerStop();

            // Log "out of time" and question number
            console.log("Clock down");
        }
    }

    function fancyTimeFormat(time) {
        // Hours, minutes and seconds
        // ~~ is a shorthand for Math.floor

        var hrs = ~~(time / 3600);
        var mins = ~~((time % 3600) / 60);
        var secs = ~~time % 60;

        // Output like "1:01" or "4:03:59" or "123:03:59"
        var ret = "";

        if (hrs > 0) {
            ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
        }

        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
        return ret;
    }

    /*************************************************/

    // Update screen
    updateScreen();


});


//************************Adding code Alex's code **************/



//********API calls for flags and Firebase code for Leaderboard ***************************************************/


var urlArray = [];

//Flags API code Function-----------------------------------/

$("#country-input-btn").on("click", function (event) {

    event.preventDefault();

    var country = $("#country-input").val();

    var queryURL = "https://restcountries.eu/rest/v2/name/" + country;

    $("#flags").empty();

    //hide user input/btn to show input/btn for country 
   $(this).parent().hide();
    $("#input-fields").show();


    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        for (i = 0; i < response.length; i++) {
            var result = response[i].flag;
        }

        var flagUrl = result;
        urlArray.push(flagUrl);
    });
});

//--------------------------------------------------

//**************************************************************** */

//Initialize Firebase

var config = {
    apiKey: "AIzaSyB8rR_AYeLUh4aE2dQB_D2NITW_tVoCdiQ",
    authDomain: "leader-board-717ef.firebaseapp.com",
    databaseURL: "https://leader-board-717ef.firebaseio.com",
    projectId: "leader-board-717ef",
    storageBucket: "leader-board-717ef.appspot.com",
    messagingSenderId: "954867525887"
};
firebase.initializeApp(config);


var database = firebase.database();


// 2. Button for adding Payers to database

$("#add-player-btn").on("click", function (event) {
    event.preventDefault();

    $(this).parent().hide();

    


    // Grabs user input

    var rankingInfo = $("#ranking").val().trim(); //info needed from game results
    var username = $("#name-input").val().trim();
    var countryName = $("#country-input").val().trim();
    var scoreInfo = $("#score").val().trim(); //info needed from game results


    // Creates local "user-info" object for holding Player data

    var newPlayer = {
       ranking: rankingInfo,
        user: username,
        country: urlArray[0],
       score: scoreInfo
    };

    // Uploads player data to the database
    database.ref().push(newPlayer);


    $("#ranking").text(newPlayer.ranking); //Waiting for data from game
    $("#name-input").text(newPlayer.user);
    $("#country-input").text(newPlayer.country);
    $("#score").text(newPlayer.score);  //Waiting for data from game


    $("#ranking").val("");
    $("#name-input").val("");
    $("#country-input").val("");
    $("#score").val("");
});

database.ref().on("child_added", function (childSnapshot) {

    var rankingInfo = childSnapshot.val().ranking;
    var userName = childSnapshot.val().user;
    var countryName = childSnapshot.val().country;
    var scoreInfo = childSnapshot.val().score;



    // Adding Next player to the leaderboard

    var newRow = $("<tr>").append(
        $("<td>").text(rankingInfo),
        $("<td>").text(userName),
        $("<img>").attr("src", countryName).addClass("flagSmall"),
        $("<td>").text(scoreInfo),

    );


    // Append the new row to the table

    $("#leaderboard-table > tbody").append(newRow);

    //Empying out url Array for next player
    urlArray = [];

});

//********API calls for flags and Firebase code for Leaderboard    END***************************************************/

