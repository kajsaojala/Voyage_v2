//Click event för registration!
let register = document.getElementById("register");
register.addEventListener('submit', function(event){
    event.preventDefault();

    //Hämtar värdet av nedan element
    let UserName = document.getElementById("newUsername").value;
    let UserPassword = document.getElementById("newPassword").value;
    let UserEmail = document.getElementById("newEmail").value;
    let UserTravelStatus = document.getElementById("travelStatus").checked;

    let request = new Request("../admin/api.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: UserName,
            password: UserPassword,
            email: UserEmail,
            travelStatus: UserTravelStatus
        })
    })
    fetch(request)
    .then(response => {
        return response.json();
    })
    .then(resource => {
        console.log(resource)
        if (resource.errors !== undefined) {
            let errorRegister = document.getElementById("errorRegister");
            errorRegister.innerHTML = "";
            let message = document.createTextNode(resource.errors)
            errorRegister.appendChild(message)
            document.getElementById("newUsername").value = "";
            document.getElementById("newPassword").value = "";
            document.getElementById("newEmail").value = "";        
        }  else if (resource.data !== undefined) {
            // Om användaren fyllt i input fälten korrekt så skapas en ny användare med feedback om att det går att logga in
            let errorRegister = document.getElementById("errorRegister");
            errorRegister.innerHTML = "";
            let message = document.createTextNode("Registration successful. Welcome to Voyage!")
            errorRegister.appendChild(message)
            document.getElementById("newUsername").value = "";
            document.getElementById("newPassword").value = "";
            document.getElementById("newEmail").value = ""; 
            
        }
    })
})

// OBS! inget får vara under denna