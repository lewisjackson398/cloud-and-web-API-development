<?php
session_start();
function generateHTML($file)
{
    echo file_get_contents("assets/content/" . $file . ".txt");
}
include('makeHeader.php');
include('makeNav.php');
echo makeHeader();
echo makeNav();
?>

<div class="content-divider"></div>
<div class="center">
    <div id="twitter-section">
        <h1>
            <?php
            generateHTML('twitter_title')
            ?>
        </h1>
        <p>
            <?php
            generateHTML('twitter');
            ?>
        </p>
        <div id="tweet-list">
            <h2>
                <?php
                generateHTML('twitter_list');
                ?>
            </h2>
        </div>
        <button id="logIn" value="auth" type="button">Authenticate Twitter</button>
        <form id="tweetForm" action="sendTweet.php" method="POST">
            <textarea id="tweetTextArea" placeholder="Tweet here if signed in!" name="tweetContent" form="tweetForm"></textarea>
            <input id="submit" type="submit" value="Tweet">
        </form>
    </div>
    <div id="weather-section">
        <h1>
            <?php
            generateHTML('weather_title')
            ?>
        </h1>
        <div id="weather-legend">
            <p>
                <?php
                generateHTML('weather_info');
                ?>
            </p>
            <br>
        </div>
        <div id="defaultWeather"></div>
        <div id="markerWeather"></div>
    </div>
    <div id="map-section">
        <h1>
            <?php
            generateHTML('maps_title');
            ?>
        </h1>
        <p>
            <?php
            generateHTML('maps');
            ?>
        </p>
        <button id="driving" value="DRIVING" class="button" type="button">Driving</button>
        <button id="walking" value="WALKING" class="button" type="button">Walking</button>
        <button id="cycling" value="BICYCLING" class="button" type="button">Cycling</button>
        <div id="googleMap"></div>
        <div id="legend">
            <h3>Legend</h3>
        </div>
        <div id="info"></div>
        <div id="user-feedback">
            <div id="travel-info">
                <p>Travel Mode: WALKING</p>
            </div>
            <div id="distance-info">
                <p>Distance:</p>
                <p>Duration:</p>
                <p>Current Location:</p>
                <p>Destination:</p>
            </div>
        </div>
    </div>
</div>
</body>

</html>