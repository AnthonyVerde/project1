// VARIABLES --------------------------------------------

//      OBJECTS



//      ARRAYS
var cardsArray = [];
var urlArray = [];
var indexArray = [];

//      STRINGS/CHAR
var username = '';
var mode = '';

//      NUMBER/INTEGER
var pairs = 0;
var tries = 0;
var time = 0;
var games = 0;
var pairsMatched = 0;

//      BOOLEAN
var timer = false;
var challenge = false;
var firstPick = false;


// Creating a "player info" object using constructor notation
function playerInfo(playerName, playerCountry, ) {
    this.name = playerName; // Player's name
    this.country = playerCountry; // Player's choice
}

var player = new playerInfo('', ''); // Contains CURRENT player info


// ------------------------------------------------------------

$(document).ready(function () {

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
        $.ajax({
            url: "https://api.giphy.com/v1/gifs/search?api_key=lKEjHvIVGBtk7Z1Ai1vo4y0bqkX3CHJp&q=numbers&limit=8",
            method: "GET"
        }).then(function (res) {

            // Get the URL to the image into the cardsArray... twice!
            for (var g in res.data) {
                cardsArray.push(res.data[g].images.fixed_height_still.url);
                cardsArray.push(res.data[g].images.fixed_height_still.url);
            }

            // Ranomize the positions of the cardsArray
            shuffleArray(cardsArray);

            // Show the BACK of the cards
            displayCards();
        });
        //////////////////////// GIPHY ////////////////////////

    }

    // Show the cards in the board
    function displayCards() {

        // Resize the container of the cards
        $("#gifBox").css("width", 500);

        // Remove all the existing cards
        $("#gifs").html("");

        // For each GIF append an element to the DOM
        for (var c in cardsArray) {

            var cardDiv = $("<div>").addClass("card m-2");
            var cardImg = $("<img>").attr("src", cardsArray[c]).attr("id", "front" + c).css("display", "none").addClass("staticgif card-img-top").appendTo(cardDiv);
            var cardback = $("<img>").attr("src", "https://placehold.it/100x100").attr("id", "back" + c).attr("data-url", cardsArray[c]).addClass("staticgif card-img-top").appendTo(cardDiv);

            // Append each card
            $("#gifs").append(cardDiv);
        }
    }

    // Update player stats
    function updateScreen() {


        switch (mode) {
            case 'easy':
                $("#welcome").hide();
                $("#game").show();
                $("#stats").show();

                break;

            case 'timed':
                $("#welcome").hide();
                $("#game").show();
                $("#stats").show();

                break;

            case 'challenge':
                $("#welcome").hide();
                $("#game").show();
                $("#stats").show();

                break;

            default:
                $("#welcome").show();
                $("#game").hide();
                $("#stats").hide();
                break;
        }



    }

    // Update player stats
    function updateStats() {

        $("#info").html("");
        var gameStats = $("<h2>").text("Pairs matched: " + pairsMatched + "  Tries: " + tries).appendTo($("#info"));
    }

    // Click on back of card
    $("#gifs").on("click", ".staticgif", function () {

        // If the same card is clicked twice do nothing
        if (this.id.substr(4) === urlArray[0]) {
            return;
        }

        // Save the ID of the clicked card
        // Making sure to remove the first 4 characters
        var choice = this.id.substr(4);

        // Hide the back of the card
        $("#back" + choice).hide();

        // Show the front of the card
        $("#front" + choice).show();

        // Get the URL for the card
        urlArray.push(this.dataset.url)

        // Get the INDEX for the card
        indexArray.push(choice);

        if (!firstPick) {

            // Marked that the first card was picked
            firstPick = true;
        } else {

            // Switch back that the first card was picked
            firstPick = false;

            // Add a try to the list
            tries++;

            // Wait some time to show both cards and then follow up
            setTimeout(function () {
                if (urlArray[0] === urlArray[1]) {
                    // The cards match, hide both cards

                    console.log("CARDS MATCH!!");

                    // Hiding the front of the card
                    $("#front" + indexArray[0]).css("visibility", "hidden");
                    $("#front" + indexArray[1]).css("visibility", "hidden");

                    // Add a pair matched to the list
                    pairsMatched++;

                } else {
                    // The cards dont match, flip tham back
                    console.log("Not a match");

                    // Hide the back of the card
                    $("#back" + indexArray[0]).show();
                    $("#front" + indexArray[0]).hide();
                    $("#back" + indexArray[1]).show();
                    $("#front" + indexArray[1]).hide();
                }

                // Empty the URL and index array
                urlArray = [];
                indexArray = [];

            }, 2000); // Wait this many miliseconds after the second card is picked

            // Update the game stats
            updateStats();

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







});