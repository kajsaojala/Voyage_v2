<?php

include "functions.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PATCH, DELETE");

// Hämta innehållet i DB och gör om det till php och lägg i $database
$database = getDatabase();

// Kolla vilken metod som använts
$method = $_SERVER["REQUEST_METHOD"];

// Säger att det endast är metoderna POST, GET, PATCH och DELETE som är godkända
if ($method !== "POST" && $method !== "GET" && $method !== "PATCH" && $method !== "DELETE" ){
    http_response_code(401);
    header("Content-Type: application/json");
    echo json_encode(["message" => "Ingen giltig metod"]);
    exit();
}

if ($method !== "GET") {
    //göra en kopia av databasen om den har kommit hit så är det antingen POST eller PATCH, så då kan vi bara kopiera över allt innehåll från databasen till en annan fil
    $backupFile = "databaseBackup.json";

    //$json är själva datan från databasen
    $json = json_encode($database, JSON_PRETTY_PRINT);
    file_put_contents($backupFile, $json);
}

// Hämtar innehållet i php://input och lägger det i variabeln $json
$input = file_get_contents("php://input");
$json = json_decode($input, true);



//------------ GET (get används i requests.js i window.onload där STATE fylls på genom att man får tillbaka hela databasen) ---------

// Om metoden är GET
if ($method === "GET") {
    http_response_code(200);
    header("Content-Type: application/json");
    // Skicka med hela DB
    $message = ["data" => $database];
    echo json_encode($message);
    exit();
}




//-------------------------POST-----------------------------

if ($method === 'POST'){


    // ADDERA POST I MAINUSERS ARRAY SAVEDPOSTS
    // Om json innehåller nyckeln savedPost vet vi att det är post req som lägger till en saved post
    if (isset($json['savedPost'])){


        $contentType = $_SERVER["CONTENT_TYPE"];

        // Vi tillåter bara JSON (https://httpstatuses.com/400)
        if ($contentType !== "application/json") {
            http_response_code(400);
            header("Content-Type: application/json");
            echo json_encode(["message" => "Bad request 1"]);
            logIt("Fel contenttype", "ERROR");
            exit();
        }

        $postID = $json['postID'];
        $loggedInID = $json["id"];


        

        // Hitta den inloggade usern för att kunna hitta rätt savedArray
        $rightUser = false;
        foreach($database["users"] as $index => $user){
            if ($user['id'] == $loggedInID) {

                foreach($user["savedPosts"] as $indexP => $post){
                    if ($post["postID"] == $postID){
                        http_response_code(400);
                        header("Content-Type: application/json");
                        $message = [
                            "error" => 'Post is already saved'
                        ];
                        echo json_encode($message);
                        exit();
                    }
                }

                $rightUser = $index;
            }
        }
        
        //Lägger till id för posten i vår databas
        $saved = ['postID' => $postID];
        $senthis = $database['users'][$rightUser]['savedPosts'][] = $saved;
      

        $dataJSON = json_encode($database, JSON_PRETTY_PRINT);
        file_put_contents($file, $dataJSON);
        http_response_code(201);
        header("Content-Type: application/json");
        $message = [
            "data" => $database['users'][$rightUser]['savedPosts']
        ];
        echo json_encode($message);
        exit();
    }



    //POST REQ SOM AVSER ATT ÄNDRA PROFILBILD
    if (isset($_FILES['file'])) { //denna avser profilbild för tillfället och är inte i funktion ännu

        $currentProfilePic = false;
        $thisOne = false;
        //loopar igenom databasen för att spara den inloggades index samt den nuvarande profilbilden
        foreach($database["users"] as $index => $user){
            if ($user['id'] == $_POST['id']) {
                $thisOne = $index;
                $currentProfilePic = $user['profilePic'];
            }
        }
        

        //Sparar filvägarna
        $folder = "../images/uploads/";
        $name = $_FILES['file']['name'];
        $tmp = $_FILES['file']['tmp_name'];
        

        //Kolla filstorlek på filen samt filändelse
        $size = $_FILES["file"]["size"]; //Sparar storleken på bilden
        $fileExtension = strtolower(pathinfo($name, PATHINFO_EXTENSION));//gör filändelsen till lower
        //Skapar ett unikt filnamn till filen
        $imageName = uniqid() . "." . $fileExtension;
        //Concatinerar strängen för fillänken
        $fileName = $folder . $imageName;
        
        

        //Dessa filändelser kommer vi att acceptera
        $allowedExts = ["jpg", "jpeg", "png"];

        if ($size > 500000) { //KONTROLLERA FILSTORLEK! FIL FÅR EJ VARA MER 500KB
            http_response_code(400);
            header("Content-Type: application/json");
            $message = [
                "errors" => ["Max file size is 500kb"]
            ];
            echo json_encode($message);
            exit();
        }
        if (!in_array($fileExtension, $allowedExts)) { //KONTROLLERA FILÄNDELSE! 
            http_response_code(400);
            header("Content-Type: application/json");
            $message = [
                "errors" => ["File format not supported. Supported file formats: jpg, jpeg and png"]
            ];
            echo json_encode($message);
            exit();
        }
        if (file_exists($fileName)) { //KONTROLLERA OM FILNAMN ÄR UPPTAGET! 
            http_response_code(400);
            header("Content-Type: application/json");
            $message = [
                "errors" => ["File name already exists"]
            ];
            echo json_encode($message);
            exit();
        }

        //Tar bort den nuvarande profilbilden
        unlink($currentProfilePic);

        //Flyttar profilbilden till uploads
        move_uploaded_file($tmp, $fileName);

        //Byter ut profilbilden i databasen
        $newProfilePic = $database["users"][$thisOne]["profilePic"] = $fileName;
        $newData = $database["users"][$thisOne];

        //Sparar innehållet i databasen på nytt med den nya profilbilden
        $dataJSON = json_encode($database, JSON_PRETTY_PRINT);
        file_put_contents($file, $dataJSON);
        http_response_code(201);
        header("Content-Type: application/json");
        $message = [
            "data" => $newData
        ];
        echo json_encode($message);
        exit();
    }


        
    //POST REQ SOM AVSER REGISTERING

    //NY ANVÄNDARE – kontrollera:
    // Innehåll i input (fås från login.php)
    // Skapa nytt ID
    // Skapa ett nytt object och pusha in i DB

    //kontroller för om fälten är tomma, har mellanrum och om användarnamn är upptaget
    if ($json["username"] === "" || $json["password"] === "" || $json["email"] === "") {
        http_response_code(400);
        header("Content-Type: application/json");
        echo json_encode(["errors" => "All fields must to be filled out"]);
        exit();
    }
    if (!isset($json["username"]) || !isset($json["password"]) || !isset($json["email"])) {
        http_response_code(400);
        header("Content-Type: application/json");
        echo json_encode(["errors" => "All fields must to be filled out)"]);
        exit();
    }
    if (preg_match('/\s/',$json["username"])) {//kollar om det finns mellanslag i användarnamnet
        http_response_code(400);
        header("Location: /index.php");
        echo json_encode(["errors" => "No spaces allowed in username"]);
        exit();
    }
    //Loopar igenom databasen för att se om användarnamnet redan finns eller ej
    foreach ($database["users"] as $user => $value) {
        if ($value["username"] == $json["username"]) {
            http_response_code(400);
            header("Content-Type: application/json");
            echo json_encode(["errors" => "Username already exists"]);
            exit();
        }
    }
    //Kontrollerar så att användarnamnet inte överskridet 13 tecken
    if ($json["username"]){
        $username = $json["username"];
        $length = strlen($username);
        if ($length > 13){
            http_response_code(400);
            header("Content-Type: application/json");
            echo json_encode(["errors" => "Username must be maximum 13 characters"]);
            exit();
        }
    }

    //skapar ett ID för användaren
    $highestID = 0;
    //Letar efter det högsta existerande ID:et 
    foreach ($database["users"] as $user) {
        if ($user["id"] > $highestID) {
            $highestID = $user["id"];
        }
    }
    // Lägg till det nya ID:et 
    $okId = $highestID + 1;

    //skapar ett objekt med användarens info som ska in i databasen
    $user = ["id" => $okId, 
                "username" => $json["username"], 
                "password" => $json["password"], 
                "email" => $json["email"], 
                "travelStatus" => $json["travelStatus"], 
                "profilePic" => false, 
                "bio" => false, 
                "top3Wishes" => false, 
                "top3Favs" => false,
                "savedPosts" => [] //sparade postIDs
                //"album" => [] //sparade album som har sina egna nycklar, som albumNamn, ID, bild
            ];

    //lägger till user-objektet i databasen        
    $database["users"][] = $user;

    $dataJSON = json_encode($database, JSON_PRETTY_PRINT);
    file_put_contents($file, $dataJSON);
    http_response_code(201);
    header("Location: /home.php");
    $message = [
        "data" => $user
    ];
    echo json_encode($message);
    exit();

}


//-------------------------PATCH (ändra profilinfo)-----------------------------

if ($method === "PATCH") {

    // ÄNDRA PROFIL(bio, top3wishes, top3favs)

    $thisOne = false;

    foreach($database["users"] as $index => $user){
        if ($user['id'] == $json['id']) {
            $thisOne = $index;
        }
    }

    //Sparar den nya informationen i databasen
    $newDataBio = $database["users"][$thisOne]["bio"] = $json["bio"];
    $newWhises = $database["users"][$thisOne]["top3Wishes"] = $json["top3Wishes"];
    $newFavs = $database["users"][$thisOne]["top3Favs"] = $json["top3Favs"];
    

    $newData = $database["users"][$thisOne];
    

    $dataJSON = json_encode($database, JSON_PRETTY_PRINT);
    file_put_contents($file, $dataJSON);
    http_response_code(201);
    header("Content-Type: application/json");
    $message = [
        "data" => $newData
    ];
    echo json_encode($message);
    exit();
}



//-------------------------DELETE-----------------------------

if ($method === 'DELETE'){

    if (isset($json['removeSaved'])) {

        //ta bort post:id från mainuser savedposts
        foreach($database["users"] as $index => $user){
            if ($user['id'] == $json["userID"]) {
                foreach ($user["savedPosts"] as $ind => $post) {
                    if ($json['postID'] == $post["postID"]) {
                        array_splice($database["users"][$index]["savedPosts"], $ind, 1);
                    }
                }
            }
        }

        file_put_contents($file, json_encode($database, JSON_PRETTY_PRINT));
        http_response_code(200); 
        //header("Content-Type: application/json");
        $message = [
            "data" => "Post was removed successfully from your saved posts"
        ];
        echo json_encode($message);
        exit();
    }


    if (isset($json['removePost'])) {
        // TA BORT EN POST DB
        // json[postID] (fås från klickad post)

        foreach ($database["posts"] as $index => $post) {
            if ($post["postID"] == $json["postID"]) {

                foreach ($database["users"] as $i => $currentUser) { //kollar igenom alla användares savedPosts och tar bort post:idet som ligger i den arrayen om den matchar med posten som tagits bort
                    foreach ($currentUser["savedPosts"] as $ind => $p) {
                        if ($p["postID"] == $post["postID"]) {
                            array_splice($database["users"][$i]["savedPosts"], $ind, 1);
                        }
                    }
                }

                //tar bort posten från databasen
                array_splice($database["posts"], $index, 1);

                $pathToImg = $post["coverImg"];
                unlink($pathToImg); //tar bort coverImg från databasen

                //eftersom att varje post har en array som heter images går vi igenom den för att radera bilderna därifrån i databasen
                foreach ($post["images"] as $indexImg) {
                    unlink($indexImg);
                }

                
                // DENNA DEL TAR BORT LANDET FRÅN SIDEBAR NÄR INGEN POST HAR LANDET LÄNGRE
                //Söker igenom databasens posts länder och kollar om det raderade landet finns, om det finns så ska landet finnas kvar
                if( array_search($post["country"], array_column($database["posts"], "country")) !== false){
                    // Det finns en annan post i databasen med det landet så gör inget med countriesArray!
                } else {//Ta bort landet
                    // Det finns ingen annan post i databasen med det landet så nu ska vi splicea
                    // bort landet från countriesArray så det landet inte syns i sidebar

                    // Loopa countriesArray för att hitta landet
                    foreach ($database["countriesArray"] as $thisIndex => $thisCountry){
                        // Detta är landet som ska deletas
                        $countryFromDelete = $post["country"];
                        // Kollar om den som ska deletas är samma som ett land för en post som finns i arrayen
                        if ($thisCountry["name"] == $countryFromDelete){
                            // splicea det ovject som har name = country
                            array_splice($database["countriesArray"], $thisIndex, 1);
                        }
                    } 
                } 
            }
        }

        file_put_contents($file, json_encode($database, JSON_PRETTY_PRINT));
        http_response_code(200); //svara att borttagningen gått igenom 
        header("Content-Type: application/json");
        $message = [
            "data" => "Post was removed successfully"
        ];
        echo json_encode($message);
        exit();
    }

}


?>