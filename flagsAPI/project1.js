$("#find-flag").on("click", function(event) {

 
  event.preventDefault(); 

  var country = $("#country-input").val();

  var queryURL = "https://restcountries.eu/rest/v2/name/" + country;

$("#flags").empty();

$.ajax({
  url: queryURL,
  method: "GET"
}).then(function(response) {


for (i=0; i < response.length; i++) {
  var result = response[i].flag;
}


  var flagImage = $("<img>").attr("src", result).addClass("flagSmall");
  $("#flags").append(flagImage);

  




});
});

