<?php
session_start();
require 'config.php';
require "twitteroauth/autoload.php";

use Abraham\TwitterOAuth\TwitterOAuth;

$data = array();
$errors = array();
$tweetContent = '#KF6013_Pokemon';
if (isset($_POST['textarea'])) {
    $tweetContent = $_POST['textarea'] . " " . $tweetContent;
}
function postToTwitter($content)
{
    //Twitter tokens
    $request_token = [];
    $request_token['oauth_token'] = $_SESSION['oauth_token'];
    $request_token['oauth_token_secret'] = $_SESSION['oauth_token_secret'];
    if (
        isset($_REQUEST['oauth_token']) &&
        $request_token['oauth_token'] !== $_REQUEST['oauth_token']
    ) {
        header('Location: twitterLogin.php');
    }
    //A TwitterOAuth instance with a temporary request
    $connection = new TwitterOAuth(
        CONSUMER_KEY,
        CONSUMER_SECRET,
        $request_token['oauth_token'],
        $request_token['oauth_token_secret']
    );
    //Reassign from twitterOauth.php session.
    $access_token['oauth_token'] = $_SESSION['oauth_token'];
    $access_token['oauth_token_secret'] = $_SESSION['oauth_token_secret'];
    //A Twitter O Auth instance with the users access token
    $authenticatedUser = new TwitterOAuth(
        CONSUMER_KEY,
        CONSUMER_SECRET,
        $access_token['oauth_token'],
        $access_token['oauth_token_secret']
    );
    if ($authenticatedUser != NULL) {
        $status = $authenticatedUser->post(
            "statuses/update",
            [
                "status" => $content
            ]
        );
    }
}
//If the user is already logged in, there shouldn't be a problem.
//Error message  is displayed as a textarea placeholder.
if (!isset($_SESSION['oauth_token']) || !isset($_SESSION['oauth_token_secret'])) {
    $errors['auth'] = 'Please log in.';
}
//If the text area is empty on form submission.
//Error message is displayed as a textarea placeholder.
if (empty($_POST['textarea'])) {
    $errors['textarea'] = 'Please enter a message.';
}
//If errors arent empty, then report errors to the ajax call. Else call the post function.
if (!empty($errors)) {
    $data['success'] = false;
    $data['errors'] = $errors;
} else {
    postToTwitter($tweetContent);
    $data['success'] = true;
    $data['tweeted'] =  $_POST['textarea'];
}
//Return data to ajax call
echo json_encode($data);
