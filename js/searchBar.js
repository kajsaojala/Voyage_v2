//Sökfunktionen
document.getElementById('homeSearchField').addEventListener('focus', function(){
    //Loopa igenom STATE.allposts för att jämföra text med min sökning.
    //isf pusha in objektet i en array men först töm den så att det inte ligger någon gammal sökning där
    //Loada sedan posterna med loadposts för att visa de som matchar min söking!
    this.addEventListener('keyup', function(){
        let inputText = this.value;
        let searchArray = [];

        STATE.allPosts.forEach(function(post){
            // varje gång vi hittar en match ska den pushas in i en array
            let postInfo = post.country + post.title + post.description
            let searchSmall = postInfo.toLowerCase();
            if (postInfo.includes(inputText)){
                searchArray.push(post);
            } else if (searchSmall.includes(inputText)){
                searchArray.push(post);
            }
        })
        // skicka med ny array som parameter till loadpost
        document.getElementById('homeSearchField').addEventListener('keyup', function (event){
            
            if (event.keyCode == 13) {
                // Hämta det sökta ordet
                let thisValue = this.value;
                //console.log(thisValue)
                //Försök till deepcopy, spelar ingen roll...
                let copyThisValue = JSON.parse(JSON.stringify(thisValue));
                
                let view = document.getElementById("homeFeedTitle"); //för att ge feedback om vad anv har sökt på
                view.innerHTML = `\xa0\matching: ${ copyThisValue}`; //skapar mellanslag
                
                let elementArray = document.querySelectorAll('.categoryBox');
                elementArray.forEach(function(el){
                    el.classList.remove('showBG');
                    el.classList.add('hideBG');

                    this.addEventListener('click', function(){
                        let searchfield = document.getElementById('homeSearchField');
                        searchfield.value = ''
                        view.innerHTML = ''
                    })
                })
                // här ska en ny array med den arrayen som har alla sökresultat
                loadPosts(searchArray);
            }
        });

    })
})

