<?php 

    session_start();
    include "functions.php";

    $db = getDatabase();

    if (isset($_POST["username"]) && isset($_POST["password"])) {
        $username = $_POST["username"];
        $password = $_POST["password"];

        //Här loopar vi igenom alla användare som finns saparade och kollar om det stämmer överrens med det som användaren fyllt i formuläret
        foreach ($db["users"] as $user) {
            if ($user["username"] == $username && $user["password"] == $password) {
                $foundUser = $user;
            }
        }
        //Om användaren finns så skicka användaren till home sidan
        if ($foundUser !== null) {
            $_SESSION["username"] = $foundUser["username"];
            $_SESSION["userID"] = $foundUser["id"];
            $_SESSION["isLoggedIn"] = true;
            header("Location: /home.php");
            exit();
        }
    }
    http_response_code(405);
    header("Location: ../index.php?error=1");
    exit();
?>