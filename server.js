/**
 * Created by rishabhshukla on 28/03/17.
 */


// ./node_modules/.bin/webpack -d


const express = require("express");

const app= express();

app.use (express.static("static"));
app.listen(4000, function(){


    console.log("Listening on port 4000")

});