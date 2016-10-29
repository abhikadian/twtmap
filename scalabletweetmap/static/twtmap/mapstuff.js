/**
 * Created by kadian on 10/28/16.
 */
var map;
var mapStyle;
var markers = [];
var markerCluster;
var markerClusterPath;

var keyword = null;


function init(){

    var latlng = new google.maps.LatLng(35.972191, -17.189423);

    mapStyle = {
        center: latlng,
        zoom: 3,
    };

    map = new google.maps.Map(document.getElementById("map"), mapStyle);

    markerClusterPath = {
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
    }

}

function createMarkers(tweetData){

    for(i=0; i< markers.length; i++){
        markers[i].setMap(null);
    }
    markers.length = 0;
    map = new google.maps.Map(document.getElementById("map"), mapStyle);


    $.each(tweetData, function(i, tweet){
        var location = tweet["coordinates"];
        var username = tweet["uname"];
        var text = tweet["text"];

        var newMarker = new google.maps.Marker({
            position: {'lat': location[1], 'lng': location[0]},
            map: map,
            title: username+":"+text,
        });

        markers.push(newMarker);
    });

    markerCluster = new MarkerClusterer(map, markers, markerClusterPath);

}

function keywordSelect(queryKey) {
    
    $.getJSON("keywordSelect", {keyword: queryKey})
    .done(function(tweetResult){
        tweets = tweetResult.resultJson;
        console.log(tweets.length);
        createMarkers(tweets);
    })
    .fail(function(error){
        console.log(error);
    });
}


function getValue(value){
    keyword = value.text;

    $('.dropdown-menu').parents('.input-group-btn').find('.dropdown-toggle').html(value.text + ' <span class="caret"></span>');
    console.log("DropDown select " + keyword);

    keywordSelect(keyword);
}

window.setInterval(function(){
    keywordSelect(keyword);
}, 20000);

setTimeout(function() {
  keywordSelect(null);
}, 1000);