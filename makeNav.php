<?php
function makeNav()
{
    $nav = <<<NAV
<nav>
    <div class="center">
        <ul>
            <li><a data-scroll href="#twitter-section"><i class="fab fa-twitter"></i>Twitter</a></li>
            <li><a data-scroll href="#weather-section"><i class="fas fa-cloud"></i></i>Weather</a></li>
            <li><a data-scroll href="#map-section"><i class="fas fa-map-marker-alt"></i>Google Maps</a></li>
            <li><a href="assets/report/Report.pdf"><i class="fas fa-book-open"></i>Report</a></li>
        </ul>
    </div>
</nav>
NAV;
    return $nav;
}
