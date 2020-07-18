document.addEventListener("DOMContentLoaded", function (event) {
    let currentLocationMarker;
    let map;
    let travelMode = 'WALKING';

    /** @function getRoute - Shows the route on a map and displays the distance.
     *  @param destination - Calculates the route from the current position. */
    function getRoute(destination) {
        //Visual route on Map.
        if (!currentLocationMarker) {
            //Alert the user if they didn't select a location they must add one. Commented out because it got annoying.
            //alert("Place your location on the map to get a route.");
        } else {
            //Create the route.
            directionsService.route({
                origin: currentLocationMarker.position,
                destination: destination,
                travelMode: travelMode
            }, (result, status) => {
                if (status !== 'OK') {
                    //If it doesn't work show error message alert.
                    return alert("Something went wrong! " + status);
                } else {
                    directionsDisplay.setDirections(result);
                }
            });
            //Beginning of the Distance Matrix.
            let service = new google.maps.DistanceMatrixService();
            service.getDistanceMatrix({
                origins: [currentLocationMarker.position],
                destinations: [destination],
                travelMode: travelMode,
                unitSystem: google.maps.UnitSystem.IMPERIAL,
                avoidHighways: false,
                avoidTolls: false
            }, appendText);
        }
    }

    /** @function appendText - Adds dthe estination details to the HTML.
     *  @param response - Response - Google Distance Matrix.
     *  @param status - Status - Google Distance Matrix. */
    function appendText(response, status) {
        if (status !== google.maps.DistanceMatrixStatus.OK) {
            return alert("Something went wrong! " + status);
        } else {
            let origins = response.originAddresses;
            let destinations = response.destinationAddresses;
            $.each(origins, function (originIndex) {
                let results = response.rows[originIndex].elements;
                $.each(results, function (resultIndex) {
                    let element = results[resultIndex];
                    let distance = element.distance.text;
                    let duration = element.duration.text;
                    let from = origins[originIndex];
                    let to = destinations[resultIndex];
                    //Add HTML with values to div.
                    $("#distance-info").html("<p>Distance: " + distance + "</p>" +
                        "<p>Duration: " + duration + "</p>" + "<p>Current Location: " + from + "<p>Destination: " + to + "</p>")
                });
            });
        }
    }

    /** @function setCurrentLocationMarker - When the user clicks on the map a location marker is added.
     *  @param location - Latitude and Longitude Coordinates. */
    function setCurrentLocationMarker(location) {
        let icon = "images/redGoogleMarker.png";
        if (!currentLocationMarker) {
            //Initialise a new marker if one isn't already there.
            currentLocationMarker = new google.maps.Marker({
                position: location.latLng,
                map: map,
                title: "YOU ARE HERE",
                icon: icon
            })
        } else {
            //Set the position for the current marker to a new position since exists now.
            currentLocationMarker.setPosition(location.latLng);
        }
    }

    /** @function relTime - Function for parsing absolute time.
     * @param time_value - The time the tweet was created. */
    function relTime(time_value) {
        time_value = time_value.replace(/(\+[0-9]{4}\s)/ig, "");
        let parsed_date = Date.parse(time_value);
        let relative_to =
            (arguments.length > 1) ? arguments[1] : new Date();
        let timeago =
            parseInt((relative_to.getTime() - parsed_date) / 1000);
        if (timeago < 60) return 'less than a minute ago';
        else if (timeago < 120) return 'about a minute ago';
        else if (timeago < (45 * 60))
            return (parseInt(timeago / 60)).toString() + ' minutes ago';
        else if (timeago < (90 * 60)) return 'about an hour ago';
        else if (timeago < (24 * 60 * 60))
            return 'about ' + (parseInt(timeago / 3600)).toString() + ' hours ago';
        else if (timeago < (48 * 60 * 60)) return '1 day ago';
        else return (parseInt(timeago / 86400)).toString() + ' days ago';
    }

    /** @function displayTwitterFeed - Displays tweets with #Pokemon. */
    function displayTwitterFeed() {
        $.getJSON("returnHashtag.php", function (tweetdata) {
            let latitude = 0;
            let longitude = 0;
            let username = '';
            let tweetLocations = [];
            let message = '';

            $.each(tweetdata.statuses, function (i, tweet) {
                username = tweet.user.name;
                message = tweet.text;
                if (tweet.place !== null) {
                    //Geolocation information.
                    latitude = tweet.place.bounding_box.coordinates[0][1][1];
                    longitude = tweet.place.bounding_box.coordinates[0][0][0];
                    tweetLocations.push([latitude, longitude, username, message]);
                    $("#tweet-list").append("<p>" + username + " tweeted: "
                        + tweet.text + " " + relTime(tweet.created_at) + "</p>");
                } else {
                    //No Geolocation found.
                    $("#tweet-list").append("<p>" + username + " tweeted: "
                        + tweet.text + " " + relTime(tweet.created_at) + "</p>");
                }
            });
            //Call placeTweetMarkers and passes the array that stores the values latLng and usernames.
            placeTweetMarkers(tweetLocations);
            //console.log(tweetLocations);
        });
    }

    /** @function newcastleWeather - Function for calling current open weather for newcastle.
         * @param lat - newcaslte lat coordinates stored.
         * @param lon - newcaslte lon coordinates stored*/
    function newcastleWeather(lat, lon) {
        let apiURL = ' //api.openweathermap.org/data/2.5/weather?';
        let weather = apiURL + '&lat=' + lat + '&lon=' + lon + '&appid=a20ee0368ad1ed6110ff461f3e57ded0';
        $.ajax({
            type: 'GET',
            dataType: "json",
            url: weather,
            success: function (data) {
                let temp = Math.round(data.main.temp - 273.13) + "C";
                $("#defaultWeather").text("Weather for " + data.name + " is " + data.weather[0].description + " and the temperature is " + temp + ".");
            }
        });
    }

    /** @function placeTweetMarkers - Places markers which are stored in tweetLocations.
     *  @param locations - An array that stores the lat and lon for Tweet locations and usernames. */
    function placeTweetMarkers(locations) {
        $.each(locations, function (index) {
            let tweetLocation = locations[index];
            let latLng = new google.maps.LatLng(tweetLocation[0], tweetLocation[1]);
            let username = tweetLocation[2];
            let text = "Tweeter: " + username;
            let message = "Tweet: " + tweetLocation[3];
            let apiURL = '//api.openweathermap.org/data/2.5/weather?';
            let weather = apiURL + '&lat=' + tweetLocation[0] + '&lon=' + tweetLocation[1] + '&appid=a20ee0368ad1ed6110ff461f3e57ded0';
            var icon = [
                //randomly select a pokemon sprite out of 150 sprites. 
                "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + Math.round(Math.random() * 150) + ".png"
            ]
            var bounds = new google.maps.LatLngBounds();
            for (var i = 0; i < tweetLocation.length; i++) {
                var marker = new google.maps.Marker({
                    position: latLng,
                    map: map,
                    icon: icon[0],
                    title: text

                });
                bounds.extend(marker.position);
            }
            //map.fitBounds(bounds);
            map.setCenter(bounds.getCenter());
            //remove one zoom level to ensure no marker is on the edge.
            map.setZoom(map.getZoom() - 1);
            //console.log(bounds);
            let infowindow = new google.maps.InfoWindow({
                content: text + message
            });
            $.ajax({
                type: 'GET',
                dataType: "json",
                url: weather,
                success: function (data) {
                    let temp = Math.round(data.main.temp - 273.13) + "C";
                    $('#markerWeather').hide();
                    //for each tweet marker display current weather 
                    for (i = 0; i < tweetLocation.length; i++) {
                        $("#markerWeather").text("Weather for " + data.name + " is " + data.weather[0].description + " and the temperature is " + temp + ".");
                    }
                }
            });
            //For each marker create an event listener which gets the route.
            marker.addListener('click', () => getRoute(latLng));
            //For each marker show infowindow on map and replace newcastle weather with tweet location.
            marker.addListener('click', function () {
                infowindow.open(map, marker);
                $('#defaultWeather').hide();
                $('#markerWeather').show();
            })
        })
    }

    /** @function setTravelMode - Sets travel mode for routes and directions.
     *  @param mode - Assigned from on-click value of the associated button. */
    function setTravelMode(mode) {
        travelMode = mode;
        $("#travel-info").html("<p>Travel Mode: " + mode + "</p>");
    }

    /** @function displayLegend - Displays the legend on the map with 2 markers. */
    function displayLegend() {
        let icons = {
            tweetLocation: {
                name: 'Tweets',
                icon: 'images/twitterMarker.png'
            },
            currentLocation: {
                name: 'Your Location',
                icon: 'images/redGoogleMarker.png'
            }
        };
        let legend = document.getElementById('legend');
        $.each(icons, function (index) {
            let type = icons[index];
            let name = type.name;
            let icon = type.icon;
            let div = document.createElement('div');
            div.innerHTML = '<img src="' + icon + '"> ' + name;
            legend.appendChild(div);
        });
        //Legend is placed top right of google map.
        map.controls[google.maps.ControlPosition.RIGHT_TOP].push(legend);
    }

    /** @function initMap - Initialize google map. */
    function initMap() {
        map = new google.maps.Map(document.getElementById('googleMap'), {
            center: new google.maps.LatLng(54.973937, -1.613176),
            zoom: 8,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        //Declaring Google objects/services.
        directionsService = new google.maps.DirectionsService();
        directionsDisplay = new google.maps.DirectionsRenderer({ map: map });
        displayTwitterFeed();
        displayLegend();
        newcastleWeather(54.973937, -1.613176);
        //Create an event listener calling setCurrentLocationMarker() on-click.
        map.addListener('click', setCurrentLocationMarker);
    }

    /** @function redirect - Directs users to twitterLogin.php */
    function redirect() {
        location.href = "twitterLogin.php";
    }

    /** Calls function setTravelMode to update value. */
    $("#walking").click(function () {
        setTravelMode($(this).val());
    });

    /** Calls function setTravelMode to update value. */
    $("#driving").click(function () {
        setTravelMode($(this).val());
    });

    /** Calls function setTravelMode to update value. */
    $("#cycling").click(function () {
        setTravelMode($(this).val());
    });

    /* Disable the submit button by default. */
    $(" #submit ").attr("disabled", true);

    /** Check if submit should be enabled or disbaled. */
    $(" #tweetTextArea ").keyup(function () {
        if ($(this).val().length != 0)
            $(" #submit ").attr("disabled", false);
        else
            $(" #submit ").attr("disabled", true);
    });

    /** Clicking the auth twitter button redirects(). */
    $("#logIn").click(function () {
        redirect();
    });

    /** When form submitted, call Ajax function and display errors if needed. */
    $("form").submit(function (event) {
        //Get form data.
        let formData = {
            "textarea": $("#tweetTextArea").val()
        };
        //Process form.
        $.ajax({
            type: "POST",
            url: "sendTweet.php",
            data: formData,
            dataType: "json"
        })
            .done(function (data) {
                if (!data.success) {
                    //Message sent to placeholder.
                    let message;
                    if (data.errors.auth) {
                        message = data.errors.auth;
                    }
                    if (data.errors.textarea) {
                        if (message !== undefined) {
                            message = message + "\n" + data.errors.textarea;
                        } else {
                            message = data.errors.textarea;
                        }
                    }
                    //Replace placeholder text with error message log.
                    $("#tweetTextArea").attr("placeholder", message);
                }
                if (data.success) {
                    //Replace placeholder text with success log.
                    $("#tweetTextArea").attr("placeholder", "Tweeted! Tweet again?");
                }
            })
            .fail(function (data) {
                console.log(data)
            });
        //Stops form submitting normally.
        event.preventDefault();
        //Clear textarea of any words.
        $("#tweetTextArea").val("");
    });

    //Loads the entire process.
    google.maps.event.addDomListener(window, 'load', initMap);

    /** @function sectionScroll - Smooth scroll to page section using animation */
    function sectionScroll(event) {
        event.preventDefault();
        let $section = $($(this).attr('href'));
        $('html, body').animate({
            scrollTop: $section.offset().top
        }, 1000);
    }

    //Calls the sectionScroll function
    $('[data-scroll]').on('click', sectionScroll);

    // Twitter optimisation: https://developer.twitter.com/en/docs/twitter-for-websites/javascript-api/guides/set-up-twitter-for-websites
    window.twttr = (function (d, s, id) {
        let js, fjs = d.getElementsByTagName(s)[0],
            t = window.twttr || {};
        if (d.getElementById(id)) return t;
        js = d.createElement(s);
        js.id = id;
        js.src = "https://platform.twitter.com/widgets.js";
        fjs.parentNode.insertBefore(js, fjs);
        t._e = [];
        t.ready = function (f) {
            t._e.push(f);
        };
        return t;
    }(document, "script", "twitter-wjs"));

});
