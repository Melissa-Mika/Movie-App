// Author: Melissa Mika
// Date: 4/24/23
// Project: Movie App


//upon loading of window, invokes the anonymous function
window.addEventListener('load', function () {

    var grid = document.getElementById('container');
    grid.classList.add('row');//add the row class to the container. This is for the bootstrap grid where the three movie divs will be displayed

    //api call to retrieve information about movies
    axios.get('https://api.themoviedb.org/3/movie/now_playing?api_key=cd68dac4dd30c317aa425410192f2177&language=en-US&page=1')
        .then(response => {
            console.log(response.data);//print api JSON results to console

            //for loop to cycle through three movie results retrieved by the api call, the limit is 3 movies
            for (let i = 0; i < 3; i++) {

                var movie = document.createElement('div')//grab div and create movie variable
                movie.classList.add('col-md-4', 'mx-auto'); // add col-md-4 class to each movie div.  This makes each div take up four columns each (out of 12). The 'mx-auto' class is a bootstrap class that centers the movie divs horizontally
                movie.setAttribute('id', 'movieDiv');//give id so to style in css

                //create movie image element, pull the image from the JSON results, and make it the source of the newly created element
                var movieImage = document.createElement('img');
                movieImage.src = 'https://image.tmdb.org/t/p/w500/' + response.data.results[i].poster_path;
                movie.appendChild(movieImage);
                movieImage.setAttribute('id', 'movieImage')//give id so to style in css

                //create movieTitle variable, pull movie titles from the JSON results, and assign them to variable
                var movieTitle = document.createElement('div');
                movieTitle.textContent = response.data.results[i].title;
                movie.appendChild(movieTitle);
                movieTitle.setAttribute('id', 'movieTitle');

                //create description variable, pull movie descriptions from JSON results, and assign them to variable
                var description = document.createElement('div');
                description.innerHTML = response.data.results[i].overview;
                movie.appendChild(description);
                description.setAttribute('id', 'description');

                grid.appendChild(movie);
            }


            /* THIS SECTION IS FOR THE CREATION OF THE FIRST FORM */

            // Get the movie form element
            var movieForm = document.getElementById('movieForm');

            // Loop through the movie results from the API call and create an option element and quantity dropdown for each movie
            for (let i = 0; i < 3; i++) {

                // Create a new div to contain the movie title and quantity dropdown elements
                var movieDiv = document.createElement('div');
                movieDiv.setAttribute('id', 'movie-div');
                movieDiv.classList.add('d-flex', 'align-items-center', 'justify-content-center');//add these Bootstrap classes to flex items and vertically and horizontally center them

                // Create movie option element
                var movieOption = document.createElement('option');
                movieOption.value = response.data.results[i].title;
                movieOption.text = response.data.results[i].title;//pulls the title of the movies out of the array, the for loop has it set at 3 movies. 
                movieOption.setAttribute('id', 'movieOption');//give variable id so to style with CSS
                movieOption.classList.add('mr-3');//Bootstrap class for margin-right with a value of 3

                //create 'select' element and create the movieTitle variable
                var quantitySelect = document.createElement('select');
                var movieTitle = response.data.results[i].title;
                quantitySelect.name = movieTitle;


                /*CREATE QUANTITY DROPDOWN ELEMENT*/
                for (let j = 0; j <= 10; j++) {
                    var quantityOption = document.createElement('option');//uses for loop to create option elements from 1 - 10
                    quantityOption.value = j;
                    quantityOption.text = j;
                    quantityOption.setAttribute('id', 'quantityOption');//give variable id so to style with CSS
                    quantitySelect.appendChild(quantityOption);
                }

                // Append the quantity dropdown to the movie div
                movieDiv.appendChild(movieOption);
                movieDiv.appendChild(quantitySelect);

                // Append the movie div to the movie form
                movieForm.appendChild(movieDiv);
                movieForm.setAttribute('id', 'movieDiv')
            }

            // CREATE THE ORDER BUTTON
            var orderButton = document.createElement('input');
            orderButton.type = 'submit';
            orderButton.value = 'Place Order';
            orderButton.setAttribute('id', 'button');//give id element so to style in CSS
            movieForm.appendChild(orderButton);//append button to movie form
            movieForm.classList.add('text-center');//center the order button

        })
        .catch(error => {
            console.error(error)
        });

    // Create the popcorn image
    var popcornImage = document.createElement('img');
    popcornImage.src = 'popcorn2.jpg';
    popcornImage.alt = 'movie popcorn';
    popcornImage.width = 300;
    popcornImage.height = 200;
    popcornImage.setAttribute('id', 'popcorn');

})

/*This section is for validating the second form entries. The "name" field is tested to determine whether the field is blank or the user entered less than 5 characters. Regular expressions for different credit cards (visa, mastercard, american express, discover) test the credit card number entry*/

// Get form elements
var ticketForm = document.getElementById('ticketForm');
var nameInput = document.getElementById('name');
var cardInput = document.getElementById('card');
var orderButton = document.getElementById('order');

//create array for the created divs so all three movies will print to the screen after successful form submission
var keyValueDivs = [];

// Add event listener to form submit
ticketForm.addEventListener('submit', function (e) {
    // Prevent the form from submitting so entries can be validated
    e.preventDefault();

    // VALIDATE NAME INPUT
    var name = nameInput.value.trim();//removes excess spaces
    var nameValid = true;
    //If name text box is empty, display error message and make box red
    if (name.length == 0) {
        document.getElementById('emptyName').style.display = 'inline';
        document.getElementById('errName').style.display = 'none';
        nameInput.style.backgroundColor = "red";
        nameValid = false;
        //If name text box contains less than 5 characters, display error message and make box red
    } else if (name.length < 5) {
        document.getElementById('emptyName').style.display = 'none';
        document.getElementById('errName').style.display = 'inline';
        nameInput.style.backgroundColor = "red";
        nameValid = false;
        //If everything validates, hide error message and keep or return background color to white
    } else {
        document.getElementById('emptyName').style.display = 'none';
        document.getElementById('errName').style.display = 'none';
        nameInput.style.backgroundColor = "";
    }

    // VALIDATE CREDIT CARD NUMBER
    //create variables for the different types of credit cards->Regular Expressions
    var mastercardRegex = /^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/;
    var visaRegex = /^4[0-9]{12}(?:[0-9]{3})?$/;
    var amexRegex = /^3[47][0-9]{13}$/;
    var discoverRegex = /^6(?:011|5[0-9]{2})[0-9]{12}$/;

    //trim spaces to only the numbers/characters entered
    var card = cardInput.value.trim();
    var cardValid = true;
    //compare entered credit card number to the regex to see if they match. If they don't match, display error message and make box red
    if (!(card.match(mastercardRegex) || card.match(visaRegex) || card.match(amexRegex) || card.match(discoverRegex))) {
        document.getElementById('errcard').style.display = 'inline';
        cardInput.style.backgroundColor = "red";
        cardValid = false;
    } else {
        document.getElementById('errcard').style.display = "none";
        cardInput.style.backgroundColor = "";
    }

    /*VALIDATION SUCCESSFUL*/
    //If the name and credit card fields validate, continue with submission of the form 
    if (nameValid && cardValid) {

        /*GET THE USER'S NAME AND LAST 4 DIGITS OF CREDIT CARD NUMBER*/

        //card.length gets the length of the string (card number). Four characters are extracted from the end of the string to the index of the character of the string after the subtraction of 4.  The 4 characters are put into the variable "lastFour"
        var lastFour = card.substr(card.length - 4);

        // Create a div to contain the user's name and last 4 digits of the credit card
        var userDiv = document.createElement('div');
        userDiv.textContent = 'Name: ' + name + ' | Card ending in #' + lastFour;

        // Add class names for styling
        userDiv.className = 'output';

        // Append the divs to the output section of the page
        var output = document.getElementById('output');
        output.appendChild(userDiv);

        var formHeading = document.getElementById('infoHeading');

        ticketForm.style.display = "none";
        formHeading.style.display = "none";

        /* PRINTING OUT MOVIE TITLES*/
        // Pull everything in the URL after the ? mark
        var query = window.location.search.substring(1);
        // Split the query string into an array of key-value pairs using & as the separator
        var vars = query.split("&");

        // Loop through each key-value pair
        for (var i = 0; i < vars.length; i++) {
            // Each key-value pair is then split further into an array with = as the separator
            var pair = vars[i].split("=");

            // Create a div for each key-value pair
            var keyValueDiv = document.createElement("div");

            // Use the cleanTitle() function to remove characters that were printing between the words of the movie titles (see cleanTitle function on "purchase.html" page)
            keyValueDiv.textContent = pair[1] + " tickets for " + cleanTitle(pair[0]);

            // Add class name for styling in CSS
            keyValueDiv.className = "output";
            // Append newly created divs to the body
            document.body.appendChild(keyValueDiv);

            keyValueDivs.push(keyValueDiv); // Push newly created divs to the keyValueDiv array
        }

        // Show keyValueDivs when the form is successfully submitted
        keyValueDivs.forEach(function (div) {
            div.style.display = "block";
        });
    }
});



