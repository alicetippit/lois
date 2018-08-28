const express = require("express"),
      router = express.Router(),
      db = require("../models/dbconnection");

// Display all static location mapping
      
router.get("/mappings", (req, res) => {
    db.query("SELECT static_info.id AS static_info_id, locations.name AS location_name, loc_info, svgs.name AS svg_name, svgs.id AS svg_id, maps.name AS map_name, maps.id AS map_id FROM static_info JOIN locations ON locations.id = static_info.location_id JOIN maps ON maps.id = static_info.map_id JOIN svgs ON svgs.id = static_info.svg_id ORDER BY location_name;", (err, result, fields) => {
        if(err) throw err;
        res.render("mappings", {mappings: result});
    });
});

// Get static location mapping

router.get("/mappings/:id", (req, res) => {
    var static_info_id = req.params.id;
    db.query("SELECT static_info.id AS static_info_id, locations.name AS location_name, loc_info, svgs.name AS svg_name, svgs.id AS svg_id, x_coord, y_coord, maps.name AS map_name, maps.id AS map_id, image FROM static_info JOIN locations ON locations.id = static_info.location_id JOIN maps ON maps.id = static_info.map_id JOIN svgs ON svgs.id = static_info.svg_id WHERE ? = static_info.id;", static_info_id, (err, result, fields) => {
        if(err) throw err;
        var location_name = (result[0].location_name),
            map_name = (result[0].map_name),
            map_id = (result[0].map_id),
            loc_map = (result[0].image),
            svg_name = (result[0].svg_name),
            svg_id = (result[0].svg_id),
            x_coord = (result[0].x_coord),
            y_coord = (result[0].y_coord),
            loc_info = (result[0].loc_info);
        res.render("static-mapping", {static_info_id: static_info_id, location_name: location_name, map_name: map_name, map_id: map_id, loc_map: loc_map, svg_name: svg_name, svg_id: svg_id, x_coord: x_coord, y_coord: y_coord, loc_info: loc_info});
    });
});

// Get dynamic section mapping

router.get("/mappings/locations/sections", (req, res) => {
   db.query("SELECT svgs.name AS svg_name, svgs.id as svg_id, dynamic_info.location_id FROM svgs JOIN dynamic_info ON svgs.id=dynamic_info.svg_id GROUP BY svgs.id;", (err, result, fields) => {
       if(err) throw err;
       res.render("sections", {mappings: result});
   });
});

// Get section call number ranges

router.get("/mappings/locations/ranges/:id", (req,res) => {
    var svg_id = req.params.id;
    db.query("SELECT svgs.name AS svg_name, svgs.id AS svg_id, dynamic_info.id AS dynamic_mapping_id, start_range, end_range, shelf_range, shelf_range_side, loc_info FROM svgs JOIN dynamic_info ON svgs.id=dynamic_info.svg_id WHERE svg_id = ?", svg_id, (err, result, fields) => {
        if(err) throw err;
        var svg_name = [result[0].svg_name];
        res.render("ranges", {mappings: result, svg_name: svg_name});
    });
});

//Create new SVG

router.post("/mappings/:id/svg", (req, res) => {
    var location_id = req.params.id,
        svg  = {
        name: req.body.svg_name,
        x_coord: parseInt(req.body.x_coord, 10),
        y_coord: parseInt(req.body.y_coord, 10)
        };
    db.query("INSERT INTO svgs SET ?", svg, (err, result) => {
        if(err) throw err;
        var svg_id = (result.insertId);
        req.flash("success", "Highlight has been added.");
        res.render("new-mapping", {location_id: location_id, svg_id: svg_id});
    });
});

//Create new mapping row in static_info table

router.post("/mappings/:id/:svg_id/mapping", (req, res) => {
    var mapping = {
        svg_id: parseInt(req.params.svg_id, 10),
        location_id: parseInt(req.params.id, 10),
        map_id: parseInt(req.body.map, 10),
        loc_info: req.body.loc_info
    };
    db.query("INSERT INTO static_info SET ?", mapping, (err, result) => {
        if(err) throw err;
        req.flash("success", "New location mapping has been added.");
        res.redirect("/mappings");
    });
});

// Update map for location

router.put("/mappings/:id/map", (req,res) => {
    var redirect_url = ("/mappings/" + req.params.id),
        map_id = req.body.map,
        static_info_id = req.params.id;
    db.query("UPDATE static_info SET map_id = ? WHERE id = ?;", [map_id, static_info_id], (err, result) => {
        if(err) throw err;
        req.flash("success", "The location map has been updated.");
        res.redirect(redirect_url);
    });
});

// Update SVG 

router.put("/mappings/locations/:id", (req, res) => {
    var svg_id = req.params.svg_id,
        svg_name = req.body.svg_name,
        x_coord = (req.body.x_coord),
        y_coord = (req.body.y_coord),
        redirect_url = ("/mappings/" + req.params.id);
    db.query("UPDATE svgs SET name = ?, x_coord = ?, y_coord = ? WHERE id = ?;", [svg_name, x_coord, y_coord, svg_id], (err, result) => {
        if(err) throw err;
        req.flash("success", "The location highlight has been updated.");
        res.redirect(redirect_url);
    });
});

// Update dynamic_info table call number start and end range

router.put("/mappings/locations/ranges/:id/:dynamic_mapping_id", (req, res) => {
    var svg_id = req.params.id,
        dynamic_mapping_id = req.params.dynamic_mapping_id,
        start_range = req.body.start_range,
        end_range = req.body.end_range,
        redirect_url = "/mappings/locations/ranges/" + svg_id;
    db.query("Update dynamic_info SET start_range = ?, end_range = ? WHERE id = ?", [start_range, end_range, dynamic_mapping_id], (err, result, fields) => {
        if(err) throw err; 
        req.flash("success", "The shelf range has been updated.");
        res.redirect(redirect_url);
    });
});

module.exports = router;