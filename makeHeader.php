<?php
function makeHeader()
{
    $header = <<<HEADER
    <!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="style/style.css">
        <link href="https://fonts.googleapis.com/css?family=Cabin&display=swap" rel="stylesheet">
        <script src="https://kit.fontawesome.com/51229ce744.js" crossorigin="anonymous"></script>
        <script type="text/javascript" src="script/script.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
        <script src="http://maps.googleapis.com/maps/api/js?key=AIzaSyAz8RQKIRbPmRvIRCtugzBihTEUl7A3oj4"></script>
    </head>
    <body>
HEADER;
    return $header;
}
