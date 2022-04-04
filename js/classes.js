"use strict";


//BASEN TILL BÅDE POLAROIDFOTON PÅ STARTSIDA, HEM/PROFIL FEED & MODAL NÄR MAN KLICKAR PÅ POLAROID
class PolaroidBase{
    constructor(data){
        this.postID = data.postID;
        this.coverImg = data.coverImg;
        this.creatorID = data.creatorID; //Username, UserPic
        this.country = data.country;
        this.title = data.title;
        this.albumID = data.albumID;
        this.categoryID = data.categoryID;
        this.description = data.description;
        this.images = data.images;
    }
}


//POLAROIDFOTONA PÅ STARTSIDAN
class PolaroidStatic extends PolaroidBase{
    constructor(data){
        super(data); 

        this.polaroidBottom = document.createElement("div");
        this.polaroidBottom.classList.add("polaroidBottom");

        this.polaroidInfo = document.createElement("div");
        this.polaroidInfo.classList.add("polaroidInfo");

        //this.descriptionBox = document.createElement("div");
        //this.descriptionBox.classList.add("descriptionBox");
    }

    createPolaroidBase(arr){//Går igenom den array som skickats från funktionen, tex STATE.users
        let userInfo

        arr.forEach(user => {
            if (user.id == this.creatorID) {
               userInfo = user;
            }
         });

        //.polaroid
        let html = document.createElement("div");
        html.classList.add("polaroid", `polaroid${this.postID}`);
        let filter = document.createElement("div");
        filter.classList.add("filter", `filter${this.postID}`);

        //.polaroidPic
        let pic = document.createElement("div");
        pic.style.backgroundImage = `url('${this.coverImg}')`;
        pic.classList.add("polaroidPic");
        let that = this.postID;
        pic.addEventListener("click", function(){
            makeNewShowPost(that);//Öppnar modalfönstret för posten som klickats på
        });

        //.polaroidBottom --> KOMMA ÅT I ACTIVE
        //skapas på i constructorn

        //.polaroidInfo --> KOMMA ÅT I POLAROIDUSER & FEED
        //skapas på i constructorn

        //.polaroidUser
        let polaroidUser = document.createElement("div");
        polaroidUser.classList.add("polaroidUser");
        //.polaroidUserPic
        let polaroidUserPic = document.createElement("div");
        if (!userInfo.profilePic){
            polaroidUserPic.style.backgroundImage = 'url("../images/stockImages/userPic.png")';
        } else {
            polaroidUserPic.style.backgroundImage = `url('${userInfo.profilePic}')`;
        }
        polaroidUserPic.classList.add("polaroidUserPic");
        //.polaroidUserName //HÄR SKA SKAPAS ETT CLICKEVENT
        let polaroidUserName = document.createElement("a");
        // Här sätts a länk som innehåller en get-parameter som kollas i home.php
        polaroidUserName.setAttribute('href', `../home.php?profile=${this.creatorID}`);
        polaroidUserName.innerHTML = `${userInfo.username}`;
        polaroidUserName.classList.add("polaroidUserName");

        polaroidUser.append(polaroidUserPic, polaroidUserName);    

        //.polaroidText
        let polaroidText = document.createElement("div");
        polaroidText.classList.add("polaroidText", "flexCenter");
        //.polaroidCountry
        let polaroidCountry = document.createElement("a");
        polaroidCountry.setAttribute('href', `../home.php?country=${this.country}`)
        if (this.country.length > 15) {
            polaroidCountry.innerHTML = `${this.country.substring(0, 15)}...`;//max 15 tecken för landnamn
        } else {
            polaroidCountry.innerHTML = this.country;
        }
                        
        polaroidCountry.classList.add("polaroidCountry");
        //.polaroidTitle
        let polaroidTitle = document.createElement("div");
        polaroidTitle.innerHTML = `${this.title}`;
        polaroidTitle.classList.add("polaroidTitle");

        polaroidText.append(polaroidCountry, polaroidTitle);  
                
        //let description = this.description
        //let shortDescription = description.slice(0, 10);
        //this.descriptionBox.append(shortDescription) //descriptionBox skapades tidigare och nu läggs description in
        this.polaroidInfo.append(polaroidUser, polaroidText); // här ska även .polaroidIcon appendas men den skapas i active
        this.polaroidBottom.append(this.polaroidInfo); // här ska även .descriptionBox appendas men den skapas i active
        html.append(filter, pic, this.polaroidBottom);


        //tar alla polaroider
        //let polaroidDiv = document.querySelectorAll('.polaroid');
        //console.log(polaroidDiv);

        //html.addEventListener('mouseover', function() {
            // console.log("hej");

            //this.setAttribute('class', 'icon active');
            //let child = this.children[0]
            //let childName = child.id
            //child.style.backgroundImage = `url('../images/stockImages/icons/${childName}_white.png')`;

        //});


        return html;
            
    }
}


//POLAROIDFOTONA ANTINGEN PÅ HOME FEED ELLER PROFIL FEED (GÅR ATT KLICKA PÅ OSV) Används inte, skulle vara till för att visa beskrivning av post vid hover
class PolaroidActive extends PolaroidStatic{
    constructor(data){
        super(data);

    }


    //Metod där polaroiden får en hover effekt, description ska synas
    //Click event på hela polaroiden som gör att posten öppnas
}
class PolaroidUser extends PolaroidActive{//Polaroid för profil
    constructor(data){
        super(data)
        this.descriptionBox = document.createElement("div");
        this.descriptionBox.classList.add("descriptionBox");
    }

    htmlElement(arr) {
        this.polaroidInfo.innerHTML = "";
        let html = super.createPolaroidBase(arr);
        let iconDiv = document.createElement("div");
        let icon = document.createElement("div");
        icon.setAttribute('id', `trashIcon_${this.postID}`);
        icon.style.backgroundImage = "url('../images/stockImages/icons/trash.png')";
        iconDiv.classList.add("polaroidIcon");
        iconDiv.append(icon);

        //Används ej, skulle vara för att vid beskrivning vid hover
        /*let description = this.description
        let shortDescription = description.slice(0, 10);
        this.descriptionBox.append(shortDescription) //descriptionBox skapades tidigare och nu läggs description in*/

        this.polaroidInfo.append(iconDiv);
        //this.polaroidBottom.append(this.descriptionBox);

        icon.addEventListener('click', function(){
            let trashID = this.getAttribute('id');
            let subClicked = trashID.substr(10)
            //console.log(subClicked);

            //kalla på funktion som raderar post
            removePostFromDB(subClicked)
        })

        return html;
    }
}
class PolaroidFeed extends PolaroidActive{//För alla andra polaroider utanför profil
    constructor(data){
        super(data);
    }

    htmlElement(arr) {
        this.polaroidInfo.innerHTML = "";
        let html = super.createPolaroidBase(arr);
        let iconDiv = document.createElement("div");
        let icon = document.createElement("div");
        icon.setAttribute('id', `icon_${this.postID}`);
        iconDiv.classList.add("polaroidIcon");
        iconDiv.append(icon);
        this.polaroidInfo.append(iconDiv);

        icon.addEventListener('click', function(){
            let clickedPostId = this.getAttribute('id');
            let subClicked = clickedPostId.substr(5)
            //console.log(subClicked);
            
            // skicka clickedPostId som en post till db -> users -> som har inloggade userID -> saved
            // sparas i en array i STATE - mainUserSavedPosts
            postSavedToDB(subClicked)
            // en funktion ska finnas i functions som placerar pics från den arrayen i saved när man klickar i sidebar
            // klick igen = avmarkeras och splice från array 
            if (icon.classList.contains("markedSaved")) {
                deleteSavedPostFromDB(subClicked);
            } else {
            }
        })

        return html;
    }
}


//STRUKTUREN PÅ MODALFÖNSTER NÄR MAN KLICKAR PÅ EN POLAROID
class PostStructure extends PolaroidBase{
    constructor(data){
        super(data);
    }
    htmlElement() {
        //wrapper som håller ihop vit ruta med kryss
        let newModalWrapper = document.createElement("div");
        newModalWrapper.setAttribute("id", "newPostWrapper");
        //stäng-kryss
        let modalClose = document.createElement("div");
        modalClose.setAttribute("id","postClose");
        modalClose.innerHTML = "X";
        modalClose.addEventListener("click", () => {
            document.getElementById("showPost").style.display = "none";
        });
        //container för postinformation
        let modalContainer = document.createElement("div");
        modalContainer.setAttribute("id","showPostContainer");

        //div för bilder
        let postPictureContainer = document.createElement("div");
        postPictureContainer.setAttribute("id", "showPostPictures");

        //div för postdescription --> innehåll läggs till i andra klasser då det är antingen formulär eller divar
        let postDescriptionContainer = document.createElement("div");
        postDescriptionContainer.setAttribute("id", "showPostInfo");

        //html-tree
        modalContainer.append(postPictureContainer, postDescriptionContainer);
        newModalWrapper.append(modalClose, modalContainer);
        return newModalWrapper;
    }
}

class PostShow extends PostStructure{
    constructor(data){
        super(data);
    }
    //postID finns på polaroid, leta upp posten och anropa constructor med hela objektet
    htmlElement() {
        //finns endast 2 lådor under varandra
        //överst med coverImg till vänster, userdiv och sparadiv samt info till höger
        //nederst med images[] till vänster, 2 buttons till höger
        let outerShell = super.htmlElement();
            //hämta hela category
        let categoryObj = travelCategoriesArray.find(category => {
            return category.categoryID == this.categoryID;
        });
        //hämta hela user
        let userObj = STATE.users.find(user => {
            return user.id == this.creatorID;
        });
        //vänster sida
        //coverImg
        let coverImage = document.createElement("div");
        coverImage.style.backgroundImage = `url(${this.coverImg})`;
        coverImage.setAttribute("id", "showPostCoverImg");
        //miniBilder
        let previewImageContainer = document.createElement("div");
        previewImageContainer.setAttribute("id", "showPostImagesContainer");
        this.images.forEach(image => {
            let previewImage = document.createElement("div");
            previewImage.classList.add("previewImage");
            previewImage.style.backgroundImage = `url(${image})`;
            previewImageContainer.appendChild(previewImage);
            //funktion som byter plats mellan coverImg och lilla bild vid klick på de små
            previewImage.addEventListener("click", function(){
                let chosenPic = this.style.backgroundImage;
                let coverImgContainer = document.getElementById("showPostCoverImg");
                let coverImg = coverImgContainer.style.backgroundImage;
                coverImgContainer.style.backgroundSize = "contain";
                coverImgContainer.style.backgroundRepeat = "no-repeat";
                coverImgContainer.style.backgroundImage = chosenPic;
                this.style.backgroundImage = coverImg; 
            });
        });
        

        //höger sida
        //information om usern och save
        let showPostInfoContainer = document.createElement("div");
        showPostInfoContainer.setAttribute("id", "showPostInfoContainer");
        let userContainer = document.createElement("div");
        userContainer.setAttribute("id", "showPostUser")
        // let saveBtn = document.createElement("div");
        // saveBtn.setAttribute("id", `icon_${this.postID}`);
        // saveBtn.classList.add("saveBtn");
        // saveBtn.style.backgroundImage = "url(../images/stockImages/icons/saved.png)";
        let userPicture = document.createElement("div");
        userPicture.classList.add("polaroidUserPic", "showPostUserPic");
        userPicture.style.backgroundImage = `url('${userObj.profilePic}')`;
        let userName = document.createElement("div");
        userName.innerHTML = `${userObj.username}`;
        userName.classList.add("showPostUserName");

        // saveBtn.addEventListener("click", function(){
        //     let clickedPostId = this.getAttribute("id");
        //     let subClicked = clickedPostId.substr(5);
        //     postSavedToDB(subClicked);
        //     if (saveBtn.classList.contains("markedSaved")) {
        //         console.log("den är markerad");
        //         deleteSavedPostFromDB(subClicked);
        //     } else {
        //         console.log("den är ej markerad");
        //     }
        // });

        userContainer.append(userPicture, userName);



        //information om posten
        let postInformation = document.createElement("div");
        postInformation.setAttribute("id", "showPostInformation")
        let postCountry = document.createElement("div");
        postCountry.innerText = this.country;
        postCountry.setAttribute("id", "showPostCountry");
        let postCategory = document.createElement("div");
        postCategory.innerText = categoryObj.travelCategory;
        postCategory.setAttribute("id", "showPostCategory");
        let postTitle = document.createElement("div");
        postTitle.setAttribute("id", "showPostTitle");
        postTitle.innerText = this.title;
        let postDescription = document.createElement("div");
        postDescription.innerText = this.description;
        postDescription.setAttribute("id", "showPostDescription");
        postInformation.append(postCountry, postCategory, postTitle, postDescription);
        showPostInfoContainer.append(userContainer, postInformation);

        //buttons
        let buttonsContainer = document.createElement("div");
        buttonsContainer.setAttribute("id", "showPostButtonContainer")
        let countryLink = document.createElement("a");
        //ska länkas till countrysidan
        countryLink.setAttribute("href", `../home.php?country=${this.country}`); 
        let countryButton = document.createElement("div");
        countryButton.setAttribute("id", "showPostCountryBtn");
        countryButton.innerHTML = `view country`; 
        let profileLink = document.createElement("a");
        let profileButton = document.createElement("div");
        profileButton.setAttribute("id", "showPostProfileBtn");
        //ska länkas till personens profil
        profileLink.setAttribute("href", `../home.php?profile=${this.creatorID}`); 
        profileButton.innerHTML = `view profile`;
        countryLink.append(countryButton);
        profileLink.append(profileButton);
        
        buttonsContainer.append(countryLink, profileLink);

        //sätta ihop vänster sida
        outerShell.querySelector("#showPostPictures").append(coverImage, previewImageContainer);
        outerShell.querySelector("#showPostInfo").append(showPostInfoContainer, buttonsContainer);
        
        return outerShell;
    }
}

//inga html-element som skapas med denna eftersom det inte displayas någon info från db, skickar endast och validerar
class CreatePost extends PostStructure{
    constructor(data){
        super(data);
        this.images = data.images;
    }
    //använder klassen endast för att kolla av om allt är ifyllt
    validate(){
        if (this.title === "" || this.coverImg === "undefined" || this.description === "" || typeof this.creatorID !== "number" || STATE.addedPictures.length === 0) {
            return false;
        } else {
            return true;
        }
    }
    //Funktioner: Klick funktioner, ladda upp bilder, postknapp, Välj coverIMG!
    //Högerspalt: Skapa inputfält, select counrty, description, travelCategory, skriv titel, select album (new!!), postknapp
    //
}


//KATEGORI-/ALBUMCIRKLAR PÅ HOMEPAGE ELLER PROFILSIDA
class CategoryBox{
    constructor(data){
        this.categoryBox = document.createElement("div");
        this.categoryBox.classList.add("categoryBox");

        this.icon = document.createElement("div");
        this.icon.classList.add("categoryIcon");

        this.title = document.createElement("div");
        this.title.classList.add("categoryTitle");

        this.categoryBox.append(this.icon, this.title);
    }

    //Skapa div categoryBox, innehåller 1 cirkeldiv categoryIcon + div med cetegoryTitle
    //Här får de hover effekt + click event för att visa alla under samma category!
}

class TravelCategory extends CategoryBox{
    constructor(data){
        super(data);
        this.travelCategory = data.travelCategory;
        this.categoryID = data.categoryID;
        this.categoryIcon = data.categoryIcon;
    }

    html(country){ //skickas från funktionen loadCircles om användaren är på ett specifikt land
        this.categoryBox.id = "category_" + this.categoryID; 

        this.categoryBox.addEventListener("click", function(){
            //console.log(country);
            let id = this.id.substr(9);
            loadPosts(STATE.allPosts, "categoryID", id);
            //ta bort class från alla som är samma typ av objeect
            let elementArray = document.querySelectorAll('.categoryBox');
            elementArray.forEach(function(el){
                el.classList.remove('showBG');
                el.classList.add('hideBG');
            })
            this.classList.remove('hideBG');
            this.classList.add('showBG');
        })

        let icon = document.createElement("div");
        icon.style.backgroundImage = `url('${this.categoryIcon}')`;
        this.icon.append(icon);

        this.title.innerHTML = this.travelCategory;

        return this.categoryBox;
    }
}

class Album extends CategoryBox{
    constructor(data){
        super(data);
        this.albumID = data.albumID;
        this.albumTitle = data.albumTitle;
        this.albumCoverImg = data.albumCoverImg;
    }

    html(){
        this.categoryBox.id = "category_" + this.albumID; 
        this.categoryBox.addEventListener("click", function(){
            let id = this.id.substr(9);
    
            if (profileParameter == STATE.mainUserID) {
                //loadPosts(STATE.mainUserPosts, "albumID", id); 
            } else {
                //loadPosts(STATE.clickedUserPosts, "albumID", id); 
            }

            //ta bort class från alla som är samma typ av object
            let elementArray = document.querySelectorAll('.categoryBox');
            elementArray.forEach(function(el){
                el.classList.remove('showBG');
                el.classList.add('hideBG');
                })
            this.classList.remove('hideBG');
            this.classList.add('showBG');
        })
        
        this.icon.style.backgroundImage = `url('${this.albumCoverImg}')`;
        this.title.innerHTML = this.albumTitle;
        return this.categoryBox;
    }
}
