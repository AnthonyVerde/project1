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

        //////////////////////// GIPHY ////////////////////////
        const KEY = '10161297457820113';
        var queryURL = `https://cors-anywhere.herokuapp.com/http://superheroapi.com/api.php/${KEY}/search/man`;

       
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            // Get the URL to the image into the cardsArray... twice!
            //[22,23,50,57] Numbers to avoid(no Imgs)????

            var randomNum = Math.floor(Math.random() * 63) + 1;
            var randomNum2 = Math.floor(Math.random() * 63) + 1;
            var randomNum3 = Math.floor(Math.random() * 63) + 1;
            var randomNum4 = Math.floor(Math.random() * 63) + 1;
            var randomNum5 = Math.floor(Math.random() * 63) + 1;
            var randomNum6 = Math.floor(Math.random() * 63) + 1;
            var randomNum7 = Math.floor(Math.random() * 63) + 1;
            var randomNum8 = Math.floor(Math.random() * 63) + 1;
            var randomNum9 = Math.floor(Math.random() * 63) + 1;
            var randomNum10 = Math.floor(Math.random() * 63) + 1;


                cardsArray.push(response.results[randomNum].image.url);
                cardsArray.push(response.results[randomNum].image.url);
                cardsArray.push(response.results[randomNum2].image.url);
                cardsArray.push(response.results[randomNum2].image.url);
                cardsArray.push(response.results[randomNum3].image.url);
                cardsArray.push(response.results[randomNum3].image.url);
                cardsArray.push(response.results[randomNum4].image.url);
                cardsArray.push(response.results[randomNum4].image.url);
                cardsArray.push(response.results[randomNum5].image.url);
                cardsArray.push(response.results[randomNum5].image.url);
                cardsArray.push(response.results[randomNum6].image.url);
                cardsArray.push(response.results[randomNum6].image.url);
                cardsArray.push(response.results[randomNum7].image.url);
                cardsArray.push(response.results[randomNum7].image.url);
                cardsArray.push(response.results[randomNum8].image.url);
                cardsArray.push(response.results[randomNum8].image.url);
                cardsArray.push(response.results[randomNum9].image.url);
                cardsArray.push(response.results[randomNum9].image.url);
                cardsArray.push(response.results[randomNum10].image.url);
                cardsArray.push(response.results[randomNum10].image.url);


            
               

            // Randomize the positions of the cardsArray
            shuffleArray(cardsArray);

            // Show the BACK of the cards
            displayCards();
        });
        //////////////////////// GIPHY ////////////////////////

        console.log("calling the clock")
        if (mode === "timed" || mode === "challenge") {
            timerRun(60);
        } else {
            $("#clock").hide();
        }

    }

    // Show the cards in the board
    function displayCards() {

        // Resize the container of the cards
        switch (parseInt(pairs)) {
            case 2:
                var boxWidth = 240;
                break;

            case 3, 4:
                var boxWidth = 360;
                break;

            default:
                var boxWidth = 480;
                break;
        }


        $("#gifBox").css("width", boxWidth);

        // Remove all the existing cards
        $("#gifs").html("");

        // For each GIF append an element to the DOM
        for (var c in cardsArray) {

            var cardDiv = $("<div>").addClass("card m-2");
            var cardImg = $("<img>").attr("src", cardsArray[c]).attr("id", "frnt" + c).css("display", "none").addClass("staticgif card-img-top").appendTo(cardDiv);
            var cardback = $("<img>").attr("src", "https://placehold.it/100x140").attr("id", "back" + c).attr("data-url", cardsArray[c]).addClass("staticgif card-img-top").appendTo(cardDiv);

            // Append each card
            $("#gifs").append(cardDiv);
        }
    }

    // Update the screen
    function updateScreen() {

        switch (mode) {
            case 'easy':
                $("#welcome").hide();
                $("#game").show();
                $("#stats").show();

                updateStats();
                break;

            case 'timed':
                $("#welcome").hide();
                $("#game").show();
                $("#stats").show();

                updateStats();
                break;

            case 'challenge':
                $("#welcome").hide();
                $("#game").show();
                $("#stats").show();

                updateStats();
                break;

            default:
                $("#welcome").show();
                $("#game").hide();
                $("#stats").hide();
                break;
        }
    };

    // Update player stats
    function updateStats() {

        $("#info").html("");

        if (!finishGame) {
            var gameStats = $("<h2>").text("Pairs matched: " + pairsMatched + "  Tries: " + tries).appendTo($("#info"));
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
        $("#clock").text(time);

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
    /*************************************************/






});