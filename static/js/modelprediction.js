// Getting references to the input fields, button, and lists
var $submitBtn = document.querySelector("#submit");

// When the submit button is clicked, call the handleSubmitClick function
$submitBtn.addEventListener("click", handleSubmitClick);

function handleSubmitClick(event) {
  
  // The default behavior of a button clicked inside of a form is to try to submit the form somewhere (which we don't want)
  event.preventDefault();

  // Clear out results
  d3.select("h2>span").text("");

  // Add notice to show user that program is searching for text
  d3.select("h3>span").text("Searching...");

  // Call Flask app
  Plotly.d3.json("/model", function(error, response) {
  
    // Get input text from user and make it lower case
    var phrase = d3.select("#phrase").node().value.toLowerCase(); 

    // Search for probability in JSON and round it to nearest decimal
    var right_proba = Math.round(response[0][phrase] * 100);

    // Calculate probability for other side
    var left_proba = 100 - right_proba;
  
    // If probability is NaN
    if (isNaN(right_proba)){
      d3.select("h2>span").text("Term(s) not found");
    }
    else{
      if (right_proba > left_proba) {
        d3.select("h2>span").text(right_proba + "% probability the site's bias is Right");
      }
      else {
        d3.select("h2>span").text(left_proba + "% probability the site's bias is Left");
      }
    }

    d3.select("h3>span").text("");
    
  }); //Plotly

} //Function