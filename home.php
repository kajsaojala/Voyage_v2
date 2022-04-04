<?php
    session_start();
    
    //Kontrollerar ifall användaren är inloggad eller ej
    if (!isset($_SESSION["username"])) {
        header("Location: index.php");
        //var_dump($_SESSION['username']);
        exit();
    }
    include "sections/header.php";
?>

    <div id='homeBody'>

        <?php  
            include "sections/sidebar.php";
            include "admin/functions.php";
        ?>
        <script> 
            let mainUserID = <?php echo json_encode($_SESSION["userID"], JSON_HEX_TAG);?>; //detta hämtar den inloggades ID från PHP till js så att nyckeln mainUserID i STATE fungerar
            let profileParameter = "<?php echo isset($_GET["profile"]) ? $_GET["profile"] : "false";?>"; //om profil parameter i url existerar blir värdet id:et, annars false
            let countryParameter = "<?php echo isset($_GET["country"]) ? $_GET["country"] : "false";?>"; //Om användaren har klickat på ett land får den landet som get parameter
            let savedParameter = "<?php echo isset($_GET["saved"]) ? $_GET["saved"] : "false";?>"; //om home har saved som parameter så visas alla sparade favoriter
        </script> 

        <div id='homeWrapper'>
            <div id='homeInnerWrapper'>

                <!-- kollar om användaren är inloggad -->
                <?php if ($_SESSION["isLoggedIn"]){

                    // vad som endast ska synas vid besök på en profil
                    if (isset($_GET["profile"])){ //innehåller id:et för användaren man klickat på, eller mainUserID om man har klickat på profilknappen i navven
                        $clickedUserId = $_GET["profile"]; //get id:et
                        include "sections/profileTop.php"; //profiltop med användaresn beskrivning osv
                        

                    } elseif (isset($_GET["saved"])){ ?> 
                        
                        <div id='homeSearchBox' class='searchBox'>
                            <h3 id="countryTitle"><?php echo "Saved posts"; ?></h3> <!--skriver ut saved posts överst på sidan (istället för sökruta)-->
                        </div>  

                    <?php } elseif (isset($_GET["country"])){ ?>  
                        
                        <div id='homeSearchBox' class='searchBox'>
                            <h3 id="countryTitle"><?php echo $_GET["country"]; ?></h3> <!--skriver ut landnamnet överst på sidan (istället för sökruta)-->
                        </div>  

                    <?php } elseif (empty($_GET)) { ?> <!--vad som endast ska synas när man är på home och det ej finns get parametrar-->
                        
                        <div id='homeSearchBox' class='searchBox'>
                            <input id='homeSearchField' placeholder=' Search'>
                            <button class='hide' id='searchButton'></button>
                        </div>

                    <?php } ?> 

                    <!--nedan visas om country parameter finns eller om endast home.php -->
                    <?php if (isset($_GET["country"]) || empty($_GET)) { ?>
                        <div id='homeCategoryBar' class='categoryBar'>
                            <div class='barTitle'>Travel categories</div>
                            <div id="barCategories" class='barCategories'></div>
                        </div>
                    <?php } ?>

                    <!--detta laddas alltid på sidan oavsett GET parameter -->
                    <div id='homefeedBox' class='feedBox'>
                        <div id='homeFeedInfo' class='feedInfo'>
                            <div id='homeFeedView' class='feedView'></div>
                            <div id='homeFeedTitle' class='feedTitle' onclick='return false;'></div> <!--onclick är ett försök till att göra diven oklickbar, används ej-->
                            
                        </div>

                        <div id='homeFeedGrid' class='feedGrid'></div>
                    </div>
                    <!--inkluderar overlay för att göra en ny post i diven nedan-->
                    <div id="newPostOverlay">
                        <?php include "sections/createNewPost.php"?>
                    </div>
                    <!--overlay för att visa posts-->
                    <div id="showPost"></div>
                <?php }?> <!-- stänger if ($_SESSION["isLoggedIn"] -->
            </div>
        </div>
    </div>
            
        <script src='../js/classes.js'></script>
        <script src='../js/adminArrays.js'></script>
        <script src='../js/editProfile.js'></script>
        <script src="../js/functions.js"></script>
        <script src='../js/searchBar.js'></script>
        <script src="../js/requests.js"></script>
    </body>
</html>
