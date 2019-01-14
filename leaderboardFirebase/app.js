
//********API calls for flags and Firebase code for Leaderboard ***************************************************/

$("#user-input-btn").hide();

var urlArray = [];

//Flags API code Function-----------------------------------/

$("#add-country-btn").on("click", function (event) {

    event.preventDefault();

    var country = $("#country-input").val();

    var queryURL = "https://restcountries.eu/rest/v2/name/" + country;

    $("#flags").empty();

    //hide country input/btn to show input/btn for username 
    $(this).parent().hide();
    $("#user-input-btn").show();


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

    //hiding input and btn

    $(this).parent().hide();


    // Grabs user input

    var rankingInfo = $("#ranking").val().trim(); //info needed from game results
    var username = $("#user-input").val().trim();
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


    $("#ranking").text(newPlayer.ranking);
    $("#user-input").text(newPlayer.user);
    $("#country-input").text(newPlayer.country);
    $("#score").text(newPlayer.score);


    $("#ranking").val("");
    $("#user-input").val("");
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

    urlArray = [];

});

//********API calls for flags and Firebase code for Leaderboard    END***************************************************/

