const express = require("express"),
      router = express.Router(),
      db = require("../models/dbconnection");

// Display all locations

router.get("/locations", (req, res) => {
    db.query("SELECT id, name, library, code, message FROM locations ORDER BY name", (err, result, fields) => {
        if(err) throw err;
        res.render("locations", {locations: result});
    });
});

// Display edit location form

router.get("/locations/:location_id/:location_code", (req, res) => {
    var location_id = req.params.location_id,
        location_code = req.params.location_code;
        db.query("SELECT library, locations.name AS location_name, message FROM locations WHERE ? = locations.id", location_id, (err, result, fields) => {
            if(err) throw err;
            var location_name = (result[0].location_name),
                message = (result[0].message),
                library = (result[0].library);
            res.render("edit-location", {location: result, location_code: location_code, location_name: location_name, location_id: location_id, message: message, library: library});
        });
    
});

// Display new location form

router.get("/locations/new", (req, res) => {
    res.render("new-location");
});

// Add new location to locations table

router.post("/locations", (req, res) => {
    var location = {
        code: req.body.location_code,
        name: req.body.location_name,
        library: req.body.library,
        message: req.body.message,
        loc_type: "static"
    };
    db.query("INSERT INTO locations SET ?", location, (err, result) => {
        if(err) throw err;
        console.log(result);
        var location_id = (result.insertId);
        req.flash("success", "Location has been added.");
        res.render("new-svg", {location_id: location_id});
    });
});

// Update locations table name

router.put("/locations/:location_id/:code/name", (req, res) => {
    var location_id = req.params.location_id,
        location_name = req.body.loc_name,
        location_code = req.params.location_code,
        redirect_url = "/locations/" + location_id + "/" + location_code;
    db.query("Update locations SET name = ? WHERE id = ?", [location_name, location_id], (err, result, fields) => {
       if(err) throw err; 
       req.flash("success", "The location has been updated.");
       res.redirect(redirect_url);
    });
});

//Update locations table message

router.put("/locations/:id/:code/message", (req, res) => {
    var location_id = req.params.id,
        location_message = req.body.location_message,
        location_code = req.params.code,
        redirect_url = "/locations/" + location_id + "/" + location_code;
    db.query("Update locations SET message = ? WHERE id = ?", [location_message, location_id], (err, result, fields) => {
       if(err) throw err; 
       req.flash("success", "The location message has been updated.");
       res.redirect(redirect_url);
    });
});



module.exports = router;