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
    //Check location code. If location is dynamic, route to that page instead of static location page
    if(location_code == "nstxlg" || location_code == "mstx" || location_code == "nstx"){
        db.query("SELECT dynamic_info.id AS dynamic_info_id, svgs.name AS svg_name, library, locations.name AS location_name, loc_info, message, shelf_range, shelf_range_side, start_range, end_range FROM locations JOIN dynamic_info ON locations.id = dynamic_info.location_id JOIN svgs ON svgs.id = dynamic_info.svg_id WHERE ? = locations.id", location_id, (err, result, fields) => {
            if(err) throw err;
            var location_name = (result[0].location_name),
                message = (result[0].message),
                library = (result[0].library),
                dynamic_info_id = (result[0].dynamic_info_id),
                svg_name = (result[0].svg_name),
                loc_info = (result[0].loc_info),
                shelf_range = (result[0].shelf_range),
                shelf_range_side = (result[0].shelf_range_side);
            res.render("dynamic-location", {location: result, location_code: location_code, location_name: location_name, location_id: location_id, message: message, library: library, dynamic_info_id: dynamic_info_id, svg_name: svg_name, loc_info: loc_info, shelf_range: shelf_range, shelf_range_side: shelf_range_side});
        });
    } else {
        db.query("SELECT library, locations.name AS location_name, message FROM locations WHERE ? = locations.id", location_id, (err, result, fields) => {
            if(err) throw err;
            var location_name = (result[0].location_name),
                message = (result[0].message),
                library = (result[0].library);
            res.render("static-location", {location: result, location_code: location_code, location_name: location_name, location_id: location_id, message: message, library: library});
        });
    }
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

// Update dynamic_info table call number start and end range

router.put("/locations/:id/:code/:dynamic_info_id", (req, res) => {
    var location_id = req.params.id,
        dynamic_info_id = req.params.dynamic_info_id,
        location_code = req.params.code,
        start_range = req.body.start_range,
        end_range = req.body.end_range,
        redirect_url = "/locations/" + location_id + "/" + location_code;
        console.log(dynamic_info_id);
    db.query("Update dynamic_info SET start_range = ?, end_range = ? WHERE id = ?" , [start_range, end_range, dynamic_info_id], (err, result, fields) => {
        if(err) throw err; 
        req.flash("success", "The shelf ranges have been updated.");
        res.redirect(redirect_url);
    });
});


module.exports = router;