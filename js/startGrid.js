"use strict";

//Används ej
function randomNumber(min, max) {
	// Returns a random integer between the integers min and max. Max not included.
	// Example: randomNumber(3, 6) will return 3, 4 or 5.
	return min + Math.floor((max - min) * Math.random())
}

//Laddar upp polaroiderna på startsidan
function loadStartGrid(){
    //gå igenom adminPolaroidArrayen, för varje ska den skapa en instans 
    adminPolaroidArray.forEach( polaroid => {
        let newPolaroid = new PolaroidStatic(polaroid);
        let grid = document.getElementById("startGrid");
        //Kallar på metoden createPolaroidBase för att få ut alla html element
        //Skickar med alla users för att få upp användarnamnet, profilbild osv
        grid.append(newPolaroid.createPolaroidBase(adminUsersArray));
    })
}

//Background overlay på scroll
//TO DO: kolla hur bred viewern är och sätt scroll beroende på det
//Skapar inloggningsform när användaren scrollat 700 px
let darkOnScroll = function() {
  let y = window.scrollY;
  if (y >= 700) {
      document.getElementById("bgDark").style.display = "block";
      document.getElementById("startModalWrapper").style.display = "flex";
      document.getElementById("loginModal").style.display = "flex";
      document.getElementById("close").style.display = "block";
  }
};

// Show an element
let show = function (elem, setting) {
	elem.style.display = setting;
};

// Hide an element
let hide = function (elem) {
	elem.style.display = "none";
};

//Event handlers för startsida
window.addEventListener("scroll", darkOnScroll);

//Click event för att stänga modal fönstret för login / registrera
document.getElementById("close").addEventListener("click", function(){
    document.getElementById("bgDark").style.display = "none";
    document.getElementById("startModalWrapper").style.display = "none";
    document.getElementById("loginModal").style.display = "none";
    document.getElementById("close").style.display = "none";

    document.querySelector(".error").innerHTML = "";
    document.getElementById("errorRegister").innerHTML = "";
});
//Click event för att visa login/registrera modal fönstret
document.getElementById("navLoginBtn").addEventListener("click", function(){
    document.getElementById("bgDark").style.display = "block";
    document.getElementById("startModalWrapper").style.display = "flex";
    document.getElementById("loginModal").style.display = "flex";
    document.getElementById("close").style.display = "block";
})

//Click event för att välja flikar i modal login / registrera
document.getElementById("modalLoginBtn").addEventListener("click", function(event){
    let elementShow = document.getElementById("login");
    let elementHide = document.getElementById("join");
    //Kallar på funktionen som displayar eller gömmer elementen
    show(elementShow, "flex");
    hide(elementHide);
    document.getElementById("modalJoinBtn").parentElement.classList.remove("active");
    this.parentElement.classList.add("active");

    document.querySelector(".error").innerHTML = "";
    document.getElementById("errorRegister").innerHTML = "";
})
//Click event för att välja flikar i modal login / registrera
document.getElementById("modalJoinBtn").addEventListener("click", function(){
    let elementShow = document.getElementById("join");
    let elementHide = document.getElementById("login");
    show(elementShow, "flex");
    hide(elementHide);
    document.getElementById("modalLoginBtn").parentElement.classList.remove("active");
    this.parentElement.classList.add("active");

    document.querySelector(".error").innerHTML = "";
    document.getElementById("errorRegister").innerHTML = "";
})

loadStartGrid();

 //FÖRSÖK TILL ATT ANIMERA STARTSIDANS POLAROIDER../Kaj
/*let idTime = setInterval(function () {
    let random = randomNumber(0, adminPolaroidArray.length);
    let filter = document.getElementsByClassName(`filter${random}`);
    filter.style.opacity = "0";
}, 1000)*/

//setTimeout(function(){
   // filter.classList.remove("filter");
//}, 1500);