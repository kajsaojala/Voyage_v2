"use strict";


window.onload = function(){

    // Hämtar alla posts och fyller på arrayerna i STATE i functions.js
    let request = new Request("../admin/api.php");
    fetch(request)
    .then(r => r.json())
    .then(db => {
        STATE.users = db.data.users; // users i STATE blir array med alla användare, by reference ok pga ändras ALDRIG!

        db.data.posts.forEach(post =>{ // pushar in alla posts i allposts i STATE
            STATE.allPosts.push(new PolaroidFeed(post)); //pushar in en instans med hela objectet av en post
            if (post.creatorID == STATE.mainUserID) { // pushar in inloggade användarens posts i mainuserposts array i STATE
                STATE.mainUserPosts.push(new PolaroidUser(post));
            }
        });


        db.data.users.forEach(user => { // pushar in användarens sparade i STATE saved
            if (user.id == STATE.mainUserID) {
                // savedPosts kommer att vara en array av siffror (ppostIDn)
                user.savedPosts.forEach(savedPost => {
                    STATE.allPosts.forEach(function(post){
                        if (savedPost.postID == post.postID){
                            // pushar in den intans som har rätt id, skapar inga nya instanser utan tar de som finns redan i allposts
                            STATE.mainUserSavedPosts.push(post);
                        }
                    })
                })
            }
        })
        
        // Hämtar arrayen med alla länder som det finns post för
        STATE.countriesInSidebar = db.data.countriesArray;

        //Efter att state har fyllts på så är det dags att fylla gridden med posts. Eftersom att funktionen körs varje gång sidan
        //laddas om, och ikonerna i naven samt användarnamnen på polaroiderna är a-länkar så måste vi kolla om det finns en get-parameteren i URLEN
        //för att se vilka posts som ska visas:
        
        checkURL()
    });
}

// denna funktion är på paus -> den ska göra att alla får en bokmärke från början beroende på om de är sparade eller inte
// kallas från window.onload
function checkAndMark(){
    // for each på divar för att hitta polaroidens saveicon
    STATE.allPosts.forEach(function(post){
        let iconID = `icon_${post.postID}`;
        let iconIDDiv = document.getElementById(iconID);
        // Om man är på tex save-sidan finns inte alla post/alla idn, därfr kontrolleras det om iconIDDiv == null
        if (iconIDDiv !== null){
            // Kolla på alla post för att se vilka som i all posts som även anv har som saved
            // Börjar med att kolla om userns array med savade posts är tom
            if (STATE.mainUserSavedPosts.length == 0){
                iconIDDiv.setAttribute('class', 'markedUnsaved');
            } else {
                // let postSaved blir true eller false beroende på om den posten från all post som vi är på just nu finns i arrayen
                let postIsSaved = STATE.mainUserSavedPosts.some(function(savedPost){
                    return post.postID == savedPost.postID;
                })
                // Om den är true
                if (postIsSaved){
                    iconIDDiv.setAttribute('class', 'markedSaved');
                }
                // Om den är false
                else {
                    iconIDDiv.setAttribute('class', 'markedUnsaved');
                }
            }
        }
    })
}


function checkURL(){
    if (profileParameter !== "false") { // profileParameter får sitt värde i home.php genom att kolla: isset($_GET["profile"]) ? $_GET["profile"] : "false";?>";

        //nedan släckt kod avser albumcirklar
        //let user = getUserObjectByID(profileParameter); //ger user-object så vi kan komma åt nyckeln album
        //let albumArray = user.album;
        //loadCircles(albumArray, "album");

        if (profileParameter == mainUserID) {
            markIconNav(document.getElementById("profileNavBtn"));
            loadPosts(STATE.mainUserPosts); //laddar den inloggades posts
        } else {//Den klickade användarens posts pushas till STATE
            STATE.allPosts.forEach(post => {
                if (post.creatorID == profileParameter) { // pushar in klickade användarens posts i clickedUserPosts i STATE
                    STATE.clickedUserPosts.push(new PolaroidFeed(post));
                }
            })

            loadPosts(STATE.clickedUserPosts); //laddar en annan användares posts, id:et finns i variabeln profileParameter
        }
    } else if (countryParameter !== "false") {
        loadPosts(STATE.allPosts, "country", countryParameter);//skickar 3 parametrar, array, nyckeln samt landet som ska sorteras
        loadCircles(travelCategoriesArray, "country", countryParameter);
        markIconNav(document.getElementById("countriesNavBtn"));
    } else if (savedParameter !== "false") {
        loadPosts(STATE.mainUserSavedPosts);
        markIconNav(document.getElementById("savedNavBtn"));
    } else {
        loadPosts(STATE.allPosts);
        loadCircles(travelCategoriesArray);
        markIconNav(document.getElementById("homeNavBtn"));
    }
}


// POST req för saved posts
function postSavedToDB(postID){

    let request = new Request("../admin/api.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ savedPost: true, postID: postID, id: STATE.mainUserID })
    })
    fetch(request)
        .then(response => {
        // Oavsett om det gick bra eller inte så konverterar vi svaret till
        // JSON och skickar vidare till nästa `then`.
            return response.json()
        })
        .then(resource => {
            // här ska den savades id skickas tillbaka
            // fylla bg här ist för classes?
            
            if (resource.error !== undefined){
            }
            if (resource.data !== undefined){

                let findRightPost = document.getElementById(`icon_${postID}`)
                //loopa state.allpost och kolla vem som har id som är postID

                findRightPost.classList.remove('markedUnsaved');
                findRightPost.classList.add('markedSaved');
                
            }
        })

}

// DELETE req för att ta bort en saved post från mainuser savedposts
function deleteSavedPostFromDB(postID){

    let request = new Request("../admin/api.php", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ removeSaved: true, postID: postID, userID: STATE.mainUserID })
    })
    fetch(request)
        .then(response => {
            return response.json()
        })
        .then(resource => {
            
            if (resource.error !== undefined){
                console.log(resource.error);
            }
            if (resource.data !== undefined){//Avmarkeras endast
                let icon = document.getElementById(`icon_${postID}`)
                icon.classList.remove('markedSaved');
                icon.classList.add('markedUnsaved');

                if (savedParameter !== "false") {//Om användaren är på savedposts så försvinner polaroiden direkt
                    let polaroid = `polaroid${postID}`;
                    let element = document.getElementsByClassName(polaroid)[0];
                    element.parentNode.removeChild(element);
                }
                
            }
        })

}



//funktion för att radera post från databas 
function removePostFromDB(id){

    let request = new Request("../admin/api.php", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ removePost: true, postID: id, userID: STATE.mainUserID })
    });

    fetch(request)
        .then(response => {
            return response.json();
        })
        .then(json => {
            console.log(json);

            //ta bort polaroiden från gridden
            let polaroid = `polaroid${id}`;
            let element = document.getElementsByClassName(polaroid)[0];
            element.parentNode.removeChild(element);
        });

}



function getCountries(){
    let request = new Request('https://restcountries.eu/rest/v2/all');
    fetch(request)
    .then(response => {
        return response.json();
    })
    .then(resource =>{
        STATE.countries = [];
        resource.forEach(element => {
            //Ger namn på 250 länder!
            //Tar bort allt som finns efter en öppningsparantes vid landnamn och lägger i en separat array
            let countryName = element.name.split("(");
            //Pushar in första elementet av arrayen för att få det som finns innan öppningsparantesen
            STATE.countries.push(countryName[0]);
            //STATE.countriesCode.push({name: element.name, code: element.alpha2Code}) //denna var till för eventuell mer info om landet /kaj
        });
    })
}

function patchBio(){
    let newBio = document.getElementById("patchBio").value;
    let inputFavs = document.getElementsByClassName("patchFavs");
    let inputWishes = document.getElementsByClassName("patchWishes");
    let favsArray = [];
    let wishesArray = [];
    for(let i=0; i<3; i++){
        let newWishes = inputWishes[i].value;
        wishesArray.push(newWishes);
    }
    for(let i=0; i<3; i++){
        let newFavs = inputFavs[i].value;
        favsArray.push(newFavs);
    }
    console.log(favsArray);
    console.log(wishesArray);
    let request = new Request("../admin/api.php", {
        method: "PATCH",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
            id: STATE.mainUserID,
            bio: newBio,
            top3Wishes: wishesArray,
            top3Favs: favsArray
        })
    })
    fetch(request)
    .then(response =>{
        return response.json();
    })
    .then(resource => {
        console.log(resource);
        //Laddar om sidan så att innehållet i profilen laddas om direkt och påsåvis uppdateras!
        window.location.reload();
    })
}

getCountries();


