"use strict";


let STATE = {
    mainUserID, //denna får ett värde i home.php genom att den kollar $_SESSION["userID"]. Den kommer antingen vara en siffra eller false 
    users: [], //En array av alla users som finns i databasen
    mainUserPosts: [], //användarens posts
    mainUserSavedPosts: [], //användarens sparade posts, hittas i db --> user --> savedPosts
    countries: [],
    countriesInSidebar: [], //avser länderna i sidebar som åker ut när man klickar på globen
    clickedUserPosts: [], // posts från den användare som man klickar på
    allPosts: [], //alla posts
    addedPictures: [] //alla tillagda bilder i newPost
};

//Funktion för att appenda posts i feed
function loadPosts(posts, filter, sort) { //posts = vilken array, filer = vilken nyckel soma ska jämföras med tex creatorID/countryName, sort = ett värde den ska jämföra med
    
    let grid = document.getElementById("homeFeedGrid");
    grid.innerHTML = ""; //tömmer gridden
    let copyPosts = [...posts]; //kopierar arrayen som skickats, spread by value!

    if (copyPosts.length == 0) {//Om det inte finns några posts
        grid.innerHTML = "Oh no! No posts yet.. Please add one!";
    }

    let viewing = document.getElementById("homeFeedView"); //för att sätta tillbaka att det står att alla posts visas när funktionen anropas
    viewing.innerHTML = "All Posts";

    if (sort !== undefined) { //Om arreyen ska sorteras
        copyPosts = copyPosts.filter(p => p[filter] == sort); //Sortering för land & resekategori

        if (copyPosts.length == 0) {
            grid.innerHTML = "Oh no! No posts yet.. Please add one!";
        }

        if (countryParameter !== "false") { //om man har klickat på ett land SAMT klickar på en kategori så filtrerar vi arrayen på landet man är på
            copyPosts = copyPosts.filter(p => p.country == countryParameter); 
        }


        //byta ut "all posts" till "reset filter" om man har klickat på en kategori / album:
        if (filter == "categoryID" || filter == "albumID") {
            viewing.innerHTML = "Back to all post";

            function viewAll(){
                viewing.style.cursor = "default";

                // Tar bort bg på alla categoryBoxes om du klickar på texten "back to all posts"
                let elementArray = document.querySelectorAll('.categoryBox');
                elementArray.forEach(function(el){
                    el.classList.remove('showBG');
                })

                if (filter == "albumID" && profileParameter == STATE.mainUserID) {
                    loadPosts(STATE.mainUserPosts);
                } else if (filter == "albumID") {
                    loadPosts(STATE.clickedUserPosts);
                } else if (countryParameter !== "false") {
                    loadPosts(STATE.allPosts, "country", countryParameter);
                } else {
                    loadPosts(STATE.allPosts);
                }
    
                viewing.removeEventListener("click", viewAll) //eftersom det inte ska gå att klicka på "all posts" tar vi bort eventlistener
                //viewing.style.cursor = "none";
            }
    
            viewing.addEventListener("click", viewAll); //vid klick laddas alla posts för aktuell filtrering, tex vilket land man står på
            viewing.style.cursor = "pointer";
        }

    }

    copyPosts.forEach(post => {
        grid.prepend(post.htmlElement(STATE.users));
        //metoden hmtlElement skapar elementen för posten, skickar med users för att ladda profilbild, namn osv
    });

    if(profileParameter !== STATE.mainUserID){
        checkAndMark();
        //Kontrollerar om någon post är sparad hon den inloggade användaren och ger ifylld ikon om den är sparad osv.
    }

}


// funktion för att ta fram travel category / album cirklarna
function loadCircles(array, sort, country){ //array: antingen travelCategoriesArray eller db -> user.album
    let categoryBar = document.getElementById("barCategories");

    if (sort == "album") {
        array.forEach(element => {
            let constructor = new Album(element);
            categoryBar.append(constructor.html());
        })
    } else if (sort == "country") {
 
        array.forEach(category => {
            let categoryExists = STATE.allPosts.some(post => {
                return post.country == country && post.categoryID == category.categoryID;
            })
            if (categoryExists) {
                let constructor = new TravelCategory(category);
                categoryBar.append(constructor.html(country));
            }
        })
    }
    else {
        array.forEach(element => {
            let constructor = new TravelCategory(element);
            categoryBar.append(constructor.html());
        })
    }

    //if det finns en post i allposts (some) ska cirkeln dyka upp
}

//funktion för att hämta hela user-objektet genom ett id, för att kunna få tex en users nyckel
function getUserObjectByID(id){
    let user = STATE.users.find(user => {
        return user.id == id;
    })

    return user;
}


//visar post när man klickar på polaroid
function makeNewShowPost(id) {
    //leta upp post med hjälp av id som skickas med från klickeventet på polaroidklassen som skapar dem
    let postObj = STATE.allPosts.find(post => {
        return post.postID == id;
    });
    let newInstance = new PostShow(postObj);
    let container = document.getElementById("showPost");
    container.innerHTML = "";
    container.style.display = "flex";
    container.appendChild(newInstance.htmlElement());
}


//---------------- MAKE NEW POST --------------------------


//här görs options i newPostContainern, där respektive array skickas med samt i vilken container de options ska appendas
function makePostOptions(element, container, value = element){
    let newOption = document.createElement("option");
    newOption.innerHTML = element;
    newOption.setAttribute("value", value);
    newOption.setAttribute("name", element);
    container.appendChild(newOption);
    
}

//öppnar modalfönstret för ny Post samt laddar in alla länder och categories
document.getElementById("add").addEventListener("click", function(){
    let optionsCategory = document.getElementById("postCategorySelect");
    let optionsCountry = document.getElementById("postCountrySelect");
    STATE.countries.forEach(country => {
        makePostOptions(country, optionsCountry);
    });
    travelCategoriesArray.forEach(category => {
        makePostOptions(category.travelCategory, optionsCategory, category.categoryID);
    });
    document.getElementById("newPostOverlay").style.display = "flex";
});

//stänger modalfönstret för ny Post
document.getElementById("postClose").addEventListener("click", function(){
    document.getElementById("newPostOverlay").style.display = "none";

    if (profileParameter !== "false") {
        markIconNav(document.getElementById("profileNavBtn"));
    } else if (countryParameter !== "false") {
        markIconNav(document.getElementById("countriesNavBtn"));
    } else if (savedParameter !== "false") {
        markIconNav(document.getElementById("savedNavBtn"));
    } else {
        markIconNav(document.getElementById("homeNavBtn"));
    }
});


//--------------- SIDE BAR ---------------------

// click för att öppna/stänga slide i sidebar
let slider = document.getElementById('slider');
let toggle = document.getElementById('countriesNavBtn');
toggle.addEventListener('click', function() {
    placeCountriesInSidebar(STATE.countriesInSidebar);
    let isOpen = slider.classList.contains('slide-in');
    slider.setAttribute('class', isOpen ? 'slide-out' : 'slide-in');
});


function placeCountriesInSidebar(countriesArray){
    countriesArray.sort(sortByName); //sorterar enligt namn på land, kallar på funktionen sortbyname

    let sliderList = document.getElementById("sliderList");
    sliderList.innerHTML = "";
   
    // placerar länder från adminArray.js -> countriesArray i sliden
    countriesArray.forEach(function(country){
        let newLi = document.createElement("li");
        newLi.innerHTML = country.name;
        let cName = country.name.replace(/ /g, '+');
        // click på ett land
        newLi.addEventListener('click', function(){
            window.location = `../home.php?country=${cName}`;
        }) 

        sliderList.append(newLi);
    })
}


function sortByName(a,b){ //jämför landnamnen
    return a.name < b.name ? -1 : 1;
}



// clickfunktion för sidebar
// hämtar alla element med class .icon
let sideBarIcon = document.querySelectorAll('.icon');
// loopar alla för att ge alla ett klickevent

function markIconNav(element){
    sideBarIcon.forEach(function(el){
        el.removeAttribute('class', 'active')
        // var tvungen att lägga till class .icon igen för den togs bort vid ovan linje
        el.setAttribute('class', 'icon')
        // child = varje elements barn (den div där iconen ligger)
        let child = el.children[0]
        // id = divens id
        let childName = child.id
        // sätter alla iconer till svart
        child.style.backgroundImage = `url('../images/stockImages/icons/${childName}.png')`;
    });

    if (element !== undefined) {
        element.setAttribute('class', 'icon active');
        let child = element.children[0]
        let childName = child.id
        child.style.backgroundImage = `url('../images/stockImages/icons/${childName}_white.png')`;
    }
}

sideBarIcon.forEach(function(element){
    element.addEventListener('click', function() {
        // Vid klick ska classen .active tas bort från alla element - därav loop igen
        sideBarIcon.forEach(function(el){
            el.removeAttribute('class', 'active')
            // var tvungen att lägga till class .icon igen för den togs bort vid ovan linje
            el.setAttribute('class', 'icon')
            // child = varje elements barn (den div där iconen ligger)
            let child = el.children[0]
            // id = divens id
            let childName = child.id
            // sätter alla iconer till svart
            child.style.backgroundImage = `url('../images/stockImages/icons/${childName}.png')`;
        });
        // endast det element som är klickat ska få class .active & vit icon
        this.setAttribute('class', 'icon active');
        let child = this.children[0]
        let childName = child.id
        child.style.backgroundImage = `url('../images/stockImages/icons/${childName}_white.png')`;
    });
})



