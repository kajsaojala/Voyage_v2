// sköter kontakt med php
//----------------------VARIABLER-------------------------------//
// lilla "button" med +
const addNewImg = document.getElementById("pic_"); 
// gömd input för previewbilderna
let previewInput = document.getElementById("hiddenInput");//små bilder
// gömd input för coverImg
let coverImageInput = document.getElementById("coverImageInput");
// själva coverImg
let coverImage = document.getElementById("newPostBigPicture");
// form för all post-info som ska till db
let newPostForm = document.getElementById("postInformation");
// button för att submitta hela
let newPostButton = document.getElementById("newPostSubmit");
// soptunna för coverImg
let trashButton = document.querySelector("#newPostBigPicture .imgTrash");

//----------------------------FUNCTIONS---------------------------//

//function för att lägga till all info i databasen under posts 
function newPostToDB() {
    //skicka info till db: kolla om iaf coverimage och fälten är ifyllda innan det skickas --> görs i classes 
    //postInformation är id:n --> behöver ej skriva getdocument... elementet för form
    let formData = new FormData(postInformation);
    //lägger till en ny property i formdata med creator ID, eftersom vi inte har det i formuläret
    formData.set("creatorID", mainUserID);
    //Loopa igenom våra små bilder, för varje bild så appendar vi de till formDatan så de skickas med
    STATE.addedPictures.forEach(picture => {
        //halparanteserna gör att php kan läsa att det är en array, appendar in alla bilder i nyckeln images som skapas här
        //både bild och filnamnet skickas med till images nyckeln
        formData.append("images[]", picture, picture.name);
    });
    //egentligen var tanken att skicka hela instansen, men det gick ej, så jag behöll den delen, men valideringen utgår från class CreatePost
    //Nedan används endast för att kolla så att all information från formet kommer med, görs via validate nedan
    let newPost = new CreatePost({
        creatorID: mainUserID,
        title: formData.get("title"),
        country: formData.get("country"),
        categoryID: formData.get("categoryID"),
        description: formData.get("description"),
        coverImg: formData.get("coverImg"),
        images: formData.getAll("images[]")
    });
    // Kollar om alla fält är ifyllda med validate(), isf begäran skickas som post, returnerar true om allt är ifyllt
    if (newPost.validate()) {
        let nyRequ = new Request("/admin/uploadPost.php", {
            method: "POST",
            body: formData
        });
        fetch(nyRequ)
            .then(resp => resp.json())
            .then(resource => {
                // Om alla fällt är ifyllda men det är ett fel i det, skickas det med ett felmeddelande från apin som kommer det att visas för användaren i en alert
                if (resource.error !== undefined){
                    alert(resource.error)
                }
                // Om det inte skickas med något felmeddelande går posten igenom och sidan laddas om
                else if (resource.error == undefined){
                    window.location.reload();
                }
            });
            // Om alla fält inte är ifyllda får användaren detta felmeddelande
    } else {
        alert("Please fill all mandatory fields and add at least two photos to continue")
    }
    return newPost; // används endast för att concole loggas
}

//funktionen som producerar de små preview-bilderna
function renderPreviewImages(){
    //hämtar in föräldern till previewbilderna
    let previewPictureList = document.getElementById("picPreview");
    //tömmer den då vi alltid appendar alla previewbilder vid varje tillagd bild
    previewPictureList.innerHTML = "";
    //Loopar igenom alla objekt som finns, alla bilder som laddats upp
    STATE.addedPictures.forEach(picture => {
        let nPreviewImg = document.createElement("div");
        let trashCan = document.createElement("img");
        trashCan.setAttribute("src", "../images/stockimages/icons/trash.png");
        trashCan.classList.add("imgTrash");
        nPreviewImg.appendChild(trashCan);
        nPreviewImg.classList.add("nyPic");
        //URL.createObjectURL kan användas för att hämta sökvägen för bilden
        //Blobb, skapar en tillfällig URL till bilen för att kunna visa den
        let previewURL = URL.createObjectURL(picture);
        nPreviewImg.style.backgroundImage = `url(${previewURL})`;
        nPreviewImg.style.backgroundSize = "cover";
        previewPictureList.appendChild(nPreviewImg);
        trashCan.addEventListener("click", clearPreviewImage);
    });
    //om användaren redan lagt till 5 stycken minibilder, försvinner den lägga till button, finns nog en snyggare lösning men blev trött i huvudet haha
    if (STATE.addedPictures.length >= 5) {
        addNewImg.style.display = "none";
    } else {
        addNewImg.style.removeProperty("display");
    }

    //flyttar lägga till button 15px åt sidan när första previewbilden har lagts till
    if (STATE.addedPictures.length >= 1) {
        addNewImg.style.marginLeft = "15px";
    } else {
        //raderar det man stylat på js
        addNewImg.style.removeProperty("marginLeft");
    }
}

//lägger till senaste bild som finns under e.target.files[0], e.target är elementet man klickat på och det finns under files[0], sen producerar vi minibilden 
function addPreviewImage(e) {   
    //e.target.files är den filen som användaren laddat upp nu, på första index finns hela filinfon som pushas in 
    STATE.addedPictures.push(e.target.files[0]);
    renderPreviewImages();
}

//för borttag vid klick på soptunnan, obs, e.target är själva soptunnan 


function clearPreviewImage(e) {
    //vi vill veta vilket barn diven är det är till föräldern
    //föräldern
    let previewPictureList = document.getElementById("picPreview");
    //hämtar in alla bilder som lagts till som preview-image
    let allPics = previewPictureList.querySelectorAll(".nyPic");
    //loopar över alla nodes vi har där och om det är 
    for (let i = 0; i < allPics.length; i++) {
        //om den aktuella noden är samma som bortklickad previewbild, då ska elementet tas bort från STATE.addedPictures-arr
        if (allPics[i] == e.target.parentElement) {
            STATE.addedPictures.splice(i, 1);
        }
    }
    //sen skapar vi nya preview-images
    renderPreviewImages();
}


//-------------------------Eventhandlers--------------------------//

//plus för att lägga till ny bild
addNewImg.addEventListener("click", function (e) {
    //triggar igång inputen så att dialogfönstret öppnas
    previewInput.click();
});

//plus på coverImage för att lägga till ny bild
coverImage.addEventListener("click", function() {
    //bara om det inte finns någon bild redan, ska dialogfönstret öppnas
    if (!coverImage.classList.contains("filled")) {
        coverImageInput.click();
    }
});

//så fort användaren har valt ut en coverbild och det läggs in i den coverimageinput, dvs att den changes, då ändras backgrundsbilden
coverImageInput.addEventListener("change", function(e){
    //hämta ut sökvägen till bilden
    let previewURL = URL.createObjectURL(e.target.files[0]);
    coverImage.style.backgroundImage = `url(${previewURL})`;
    coverImage.style.backgroundSize = "cover";
    //filled classen gör att dialogfönstret för filuppladning inte går att klicka upp
    coverImage.classList.add("filled");
});

//klickar man på trash på coverImg, så återställs allt till innan och inputen töms så att man inte skickar med fel bild
trashButton.addEventListener("click", function(e){
    coverImage.style.removeProperty("background-image");
    coverImage.style.removeProperty("background-size");
    coverImage.classList.remove("filled");
    //Stoppar eventet att bubbla till föräldern
    e.stopPropagation();
    coverImageInput.value = "";
});

//så fort användaren har valt ut en liten bild, så körs addPreviewImage()
//change kontrollerar om något fyllt i / ändrats i input fältet, i detta fall fil / bild namnet
previewInput.addEventListener("change", addPreviewImage, false);

//när man klickar på post-btn i skapa ny post
newPostForm.addEventListener("submit", function (e) {
    //så att fönstret inte stängs
    e.preventDefault();
    let successUpload = newPostToDB();
    console.log(successUpload);
    
});