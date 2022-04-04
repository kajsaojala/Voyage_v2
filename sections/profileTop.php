<?php
    //session_start();
    $database = getDatabase(); //hämtar databasen

    $bio = false;
    $travelInterest = false;
    $top3Wishes = false;
    $top3Favs = false;
    $profilePic = false;
    $email = false;

    foreach($database['users'] as $index => $user){
        if($user['id'] == $clickedUserId){ //$clickedUserId får sitt värde i home.php
            $username = $user['username'];
            $bio = $user['bio'];
            $travelInterest = $user['travelStatus'];
            $top3Wishes = $user['top3Wishes'];
            $top3Favs = $user['top3Favs'];
            $profilePic = $user['profilePic'];
            $email = $user['email'];
        }
    }
?>
<div id='profileContainer'>

    <div id='profileBox'>
        <div id='profilePicBox'>
            <div id='profilePic' style='background-image: url(<?php if (!$profilePic) {echo "../images/stockImages/userPic.png";} else {echo $profilePic;}?>)'>
        <?php
        //MAn ska endast kunna redigera profilbild om man är inloggad
                if (isset($_GET["profile"])){
                    if ($_GET["profile"] == $_SESSION["userID"]){
                        echo "<div id='postProfilePic'></div>";
                    }
                } 
        ?>    
            
        </div>
            <div>
                <form id='uploadProfilePic' method='POST'>
                    <input id="fileInfo" class='hide' type="file" enctype="multipart/form-data" name="file"><br>
                    <button type='submit' class='hide' id='savePic'>Save</button>
                </form>
            </div>
        </div>
        <div id='profileInfo'>
            <div id='profileName'><?php echo $username; ?></div>
            <div id='profileBio'><?php echo $bio; ?></div>
            <textarea name="patchBio" id="patchBio" class="hide" cols="50" rows="4"></textarea>

            <?php if ($travelInterest !== false){ ?>
                <div id='profileInterest'>
                    <div id='interestIcon'></div>
                    <a id='emailLink' href="mailto:<?php echo $email ?>?subject = Feedback&body = Message"><div id='interestText'><?php echo "$username is interested in new travel friends";?></div></a>
                </div>
            <?php } ?>
        </div>
        </div>

    <div id='profileFavs'>

        <div id='topFavs'>
            <span>Top favs</span>
            <ul>
            <?php
            //Om favs finns
            if ($top3Favs) {
                foreach($top3Favs as $index => $favs){
                    //Loopa igenom array med alla favs för att visa dessa som li element
                    echo "<li class='topFavsList'>$favs</li>";
                    echo "<input class='hide patchFavs'></input>";
                }
            }else{//om favs inte finns
                for($i = 0; $i<3; $i++){
                    echo "<li class='topFavsList'></li>";
                    echo "<input class='hide patchFavs'></input>";
                }
                    
            }
            ?>
                    
            </ul>
        </div>

        <div id='topWants'>
            <span>Top wants</span>
                <ul>
                <?php
                if ($top3Wishes) {//Om wishes finns
                    foreach($top3Wishes as $index => $favs){
                        //Loopa igenom array med alla favs för att visa dessa som li element
                        echo "<li class='topWishesList'>$favs</li>";
                        echo "<input class='hide patchWishes'></input>";
                    }
                }else{//om wishes inte finns
                    for($i = 0; $i<3; $i++){
                        echo "<li class='topWishesList'></li>";
                        echo "<input class='hide patchWishes'></input>";
                    }
                        
                }
                ?>
                </ul>
        </div>
    </div>
    <?php if (isset($_GET["profile"])){
        if ($_GET["profile"] == $_SESSION["userID"]){
            echo "<div id='profileSettings'></div>";
            echo "<button id='saveBio' class='hide'>Save</button>";
        }
    }?>
</div>
 
