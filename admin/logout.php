<?php
    // Här förstörs sessionen och skickar tillbaka användaren till index.php
    session_start();
    unset($_SESSION["username"]);
    unset($_SESSION["isLoggedIn"]);
    unset($_SESSION["userID"]);
    session_destroy();
    header("Location: ../index.php");
    exit();
?>