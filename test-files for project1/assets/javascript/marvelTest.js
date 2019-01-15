
var API_KEY = '4f053f20df76d1ac0a47b7c68f79cdf3';
var private = 'a238a11188afcb9fe6682df29afbbe9a816427b1';


// const API_KEY = `6ad1755aed6bec3aff36e5741089417b`;
const API_URL = `https://gateway.marvel.com/v1/public/events/29/characters?limit=60&apikey=${API_KEY}`;

function getCharacterData() {
  return fetch(API_URL)
    .then(response => response.json())
    .then(data => {
      console.log(data)
    });
}
getCharacterData();

//************************Adding code Alex's code **************/



//********API calls for flags and Firebase code for Leaderboard ***************************************************/


var urlFlagArray = [];

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
        urlFlagArray.push(flagUrl);
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
const db = firebase.firestore();                //without this line of code is a realtime database
db.settings({timestampsInSnapshots: true});     //without this line of code is a realtime database



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
        country: urlFlagArray[0],
        score: scoreInfo
    };

    // Uploads player data to the database
    database.ref().push(newPlayer);

    db.collection('Easy').add(newPlayer);


    $("#ranking").text(newPlayer.ranking); //Waiting for data from game
    $("#name-input").text(newPlayer.user);
    $("#country-input").text(newPlayer.country);
    $("#score").text(newPlayer.score); //Waiting for data from game


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
    urlFlagArray = [];

});

//********API calls for flags and Firebase code for Leaderboard    END***************************************************/