
// Redigera sin profil
function editProfile(){
    //Byter html element på sidan genom classerna hise & show för att kunna redigera bion
    //Hämtar innehållet från elementen och placerar i input fälten så användaren kan redigera sitt befintliga innehåll
    //BIO
    let profileBio = document.getElementById("profileBio");
    let bioText = profileBio.innerHTML;
    console.log(bioText);
    profileBio.classList.add("hide");
    let patchBio = document.getElementById("patchBio");
    patchBio.innerHTML = bioText;
    superToggle(patchBio,'hide', 'show');
    
    //SAVE
    let saveBio = document.getElementById("saveBio");
    superToggle(saveBio,'hide', 'show');
    //EDIT
    let settings = document.getElementById('profileSettings');
    settings.classList.add('hide');

    //TOP FAVS & WISHES
    let topFavs = document.getElementsByClassName("topFavsList");
    let topWishes = document.getElementsByClassName("topWishesList");
    let inputFavs = document.getElementsByClassName("patchFavs");
    let inputWishes = document.getElementsByClassName("patchWishes");
    for(let i=0; i<3; i++){
        //FAVS
        //adderar classen hide på alla elementen & show till input fälten
        let topFavsText = document.getElementsByClassName("topFavsList")[i].innerHTML;
        topFavs[i].classList.add("hide");
        inputFavs[i].value = topFavsText;
        superToggle(inputFavs[i],'hide', 'show');
        //WISHES
        let topWishesText = document.getElementsByClassName("topWishesList")[i].innerHTML;
        topWishes[i].classList.add("hide");
        inputWishes[i].value = topWishesText;
        superToggle(inputWishes[i],'hide', 'show');
    }
    saveNewBio();
}



//Click event för att spara den nya informationen i bio
function saveNewBio(){
    let saveBio = document.getElementById("saveBio");
    saveBio.addEventListener('click', function(){
    //kallar på patch funktionen för att uppdatera databasen och ladda om sidan
    patchBio()
})
}

function editProfilePic(){
    document.getElementById('uploadProfilePic').addEventListener('submit', function(event){
        event.preventDefault();
        let uploadForm = document.getElementById('uploadProfilePic');
    
        let formData = new FormData(uploadForm);

        //Adderar id till formData så vi kan nå användarens id i api.php
        formData.append("id", STATE.mainUserID);
    
        let request = new Request("../admin/api.php",{
            method: "POST",
            body: formData
        });
        fetch(request)
        .then(response =>{
            return response.json();
        })
        .then(resource =>{
            
            if(resource.errors !== undefined){
                //Feedback om uppladdning ej gått bra!
                alert(resource.errors);
            }else if(resource.data !== undefined){
                //Laddar om sidan när profilbilden är bytt för att uppdatera innehållet direkt på sidan
                window.location.reload();
            }
            
        })
    })
}



//Click event för att ändra sin profilBio
let edit = document.getElementById("profileSettings");
edit.addEventListener('click', function(){
    editProfile()
}) 
//Click event för att få fram form för att ladda upp ny profilbild
document.getElementById('postProfilePic').addEventListener('click', function(){
    let upload = document.getElementById('fileInfo');
    let saveButton = document.getElementById('savePic');
    superToggle(upload,'hide', 'show');
    superToggle(saveButton,'hide', 'show');
    //Kallar på requesten där POST körs
    editProfilePic();
})

//Function för att toggla mellan hide & show!
let superToggle = function(element, class0, class1) {
    element.classList.toggle(class0);
    element.classList.toggle(class1);
  }