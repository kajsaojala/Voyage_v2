<?php

    include "functions.php";

    // Hämta innehållet i DB och gör om det till php och lägg i $database
    $database = getDatabase();
    $method = $_SERVER["REQUEST_METHOD"];


    //göra en kopia av databasen om den har kommit hit så är det antingen GET, POST eller PATCH, så då kan vi bara kopiera över allt innehåll från databasen till en annan fil
    $backupFile = "databaseBackup.json";

    //$json är själva datan från databasen
    $json = json_encode($database, JSON_PRETTY_PRINT);
    file_put_contents($backupFile, $json);

    if ($method === "POST") {

    //------------------------bilder-----------------------------//
        //innehåller file som finns i coverImg
        $coverImgFile = $_FILES["coverImg"];
        // echo json_encode(pathinfo($imagesFiles[0]["name"], PATHINFO_EXTENSION));
        // exit();


        //transforms multiple files into usable array
        //Slåt ihop alla nycklar som har samma index för att samla all filinfo till ett object
        // https://www.php.net/manual/de/features.file-upload.multiple.php
        function reArrayFiles($file_post) {
            //skapar en ny array
            $file_ary = array();
            //räknar hur många element som finns i arrayn
            $file_count = count($file_post['name']);
            //skapar en array med alla keys
            $file_keys = array_keys($file_post);
            
            for ($i = 0; $i < $file_count; $i++) {
                foreach ($file_keys as $key) {
                    //key kan vara = name, size, tmp name osv
                    //Här placerar vi all info från filen till vår tomma array med all info samlad utefter deras index
                    //index i file_post är alltid densamma och tillhör samma fil
                    //name: ["name1", "name2...]
                    //size: ["size1", "size2"...]
                    $file_ary[$i][$key] = $file_post[$key][$i];
                    //file_ary[0]["name] = $file_post[name][0]
                }
            }
            return $file_ary;
        }

        //endast $_FILES("images) innehåll flera små arrayer, där alla namn från alla filer utgjorde en array, alla temp en annan etc. 
        //$imagesFiles är nu en användbar array av object
        $imagesFiles = reArrayFiles($_FILES["images"]);

        //funktion för att flytta bilden samt kontroll
        function uploadFile($file){
            $fileExtension = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
            if ($file["size"] > 500000) {
                http_response_code(400);
                header("Content-Type: application/json");
                $message = ["error" => "The file is too big, try with another photo - max 500kB"];
                echo json_encode($message);
                exit();
            }
            if (!in_array($fileExtension, ["jpg", "jpeg", "png"])){
                http_response_code(400);
                header("Content-Type: application/json");
                $message = ["error" => "'$fileExtension' is not accepted as file type, try with another photo"];
                echo json_encode($message);
                exit();
            }
            if ($file["error"] !== 0) {//om något är fel med bilden, tex trasig, error 0 innebär att bilden är ok
                http_response_code(400);
                header("Content-Type: application/json");
                $message = ["error" => "The file is corrupt, try with another photo"];
                echo json_encode($message);
                exit();
            }
            // echo $fileExtension;
            //Skapar ett random namn till filen, concatinerar filändelsen så vi får komplett filnamn
            $imageName = uniqid() . "." . $fileExtension;
            $imageTempName = $file["tmp_name"];
            //sökväg för uploads filen
            $uploadFolder = "../images/uploads/";
            //concatinerar foldern med filnamnet för komplett sögväg till databasen
            $fileName = $uploadFolder . $imageName;
            move_uploaded_file($imageTempName, $fileName);
            $imgPath = $fileName;
            return $imgPath;
        }
        //funktionen körs och path till coverimgFile sparas i variable
        $coverImgPath = uploadFile($coverImgFile);
        //do the same for all other images // loop och put path in array, här sparas alla sökvägar från alla bilder som läggs upp
        $imagePaths = [];
        //funktionen körs och path till varenda imagefile för de små bilderna sparas i variable
        foreach($imagesFiles as $image) {
            array_push($imagePaths, uploadFile($image));
        }

    //--------------------annan Post-data-------------------------//
        
        //alla variabler från post
        $title = $_POST["title"];
        $categoryID = $_POST["categoryID"];
        $country = $_POST["country"];
        $description = $_POST["description"];
        $creatorID = $_POST["creatorID"];

        //skapa ID
        $highestID = 0;
        foreach ($database["posts"] as $post) {
            if ($post["postID"] > $highestID) {
                $highestID = $post["postID"];
            }
        }
        
    //--------------------skriva till DB-------------------------//
        // echo json_encode($categoryID);
        // exit();
        $newPost = [
            "postID" => $highestID + 1,
            "creatorID" => $creatorID,
            "title" => $title,
            "coverImg" => $coverImgPath,
            "images" => $imagePaths,
            //"albumID" => false,
            "country" => $country,
            "categoryID" => $categoryID,
            "description" => $description
        ];

        // Lägg till landet i countriesArray om det inte redan finns(som syns i sidebar) 
        // Detta är det land som usern har valt för sin nya post
        $existingCountry;
        // Loopa countriesArray
        foreach ($database["countriesArray"] as $countryInArr){
            if ($countryInArr["name"] == $country){
                $existingCountry = false;
            } else {
                $existingCountry = $country;
            }
        }
        // Om det är true att landet inte finns än
        if ($existingCountry){
            $countryObj = ["name" => $existingCountry];
            // Pushar in nytt land i database
            $database["countriesArray"][] = $countryObj;
        }
        



        $database["posts"][] = $newPost;

        $dataJSON = json_encode($database, JSON_PRETTY_PRINT);
        //file finns i functions.php
        file_put_contents($file, $dataJSON);
        http_response_code(201);
        $message = [
            "data" => $newPost
        ];
        header("Content-Type: application/json");
        echo json_encode($message);
        exit();
    }

?>