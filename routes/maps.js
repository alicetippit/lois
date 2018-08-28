const express = require("express"),
      router = express.Router(),
      db = require("../models/dbconnection");
    
router.get("/findMap", (req, res) => {
    var location_code = (req.query.location_code),
        call_number = (req.query.call_number);
    if(location_code == "nstx,lg" || location_code == "mstx" || location_code == "nstx"){
        db.query("SELECT maps.name AS map_name, image, x_coord, y_coord, library, locations.name AS loc_name, loc_info, message, shelf_range, shelf_range_side FROM maps JOIN dynamic_mapping ON maps.id = dynamic_mapping.map_id JOIN locations ON locations.id = dynamic_mapping.location_id JOIN svgs ON svgs.id = dynamic_mapping.svg_id WHERE ? BETWEEN start_range AND end_range;", call_number, (err, foundMap, fields) => {
            if(err){
                console.log(err.sqlMessage);
            }
            if(foundMap.length === 0){
                req.flash("error", "Location map not found.");
                res.redirect("error");
            } else {
            var loc_name = (foundMap[0].loc_name),
                map_name = (foundMap[0].map_name),
                loc_map = (foundMap[0].image),
                library = (foundMap[0].library),
                svg_name = (foundMap[0].svg_name),
                x_coord = (foundMap[0].x_coord),
                y_coord = (foundMap[0].y_coord),
                loc_info = (foundMap[0].loc_info),
                message = (foundMap[0].message),
                shelf_range = (foundMap[0].shelf_range),
                shelf_range_side = (foundMap[0].shelf_range_side);
            res.render("map", {loc_name: loc_name, map_name: map_name, loc_map: loc_map, library: library, svg_name: svg_name, x_coord: x_coord, y_coord: y_coord, loc_info: loc_info, message: message, shelf_range: shelf_range, shelf_range_side: shelf_range_side, call_number: call_number});
            }
        });
    } else {
    //use location code to display map
        db.query("SELECT maps.name AS map_name, image, x_coord, y_coord, library, locations.name AS loc_name, loc_info, message, shelf_range, code FROM maps JOIN static_mapping ON maps.id = static_mapping.map_id JOIN locations ON locations.id = static_mapping.location_id JOIN svgs ON svgs.id = static_mapping.svg_id WHERE ? = code;", location_code, (err, foundMap, fields) => {
            if(err) throw err;
            if(foundMap.length === 0){
                req.flash("error", "Location map not found.");
                res.redirect("error");
            } else {
            var loc_name = (foundMap[0].loc_name),
                map_name = (foundMap[0].map_name),
                loc_map = (foundMap[0].image),
                library = (foundMap[0].library),
                svg_name = (foundMap[0].svg_name),
                x_coord = (foundMap[0].x_coord),
                y_coord = (foundMap[0].y_coord),
                loc_info = (foundMap[0].loc_info),
                message = (foundMap[0].message),
                shelf_range = (foundMap[0].shelf_range);
            res.render("map", {loc_name: loc_name, map_name: map_name, loc_map: loc_map, library: library, svg_name: svg_name, x_coord: x_coord, y_coord: y_coord, loc_info: loc_info, message: message, shelf_range: shelf_range, call_number: call_number});
            }
        });
    }
});

module.exports = router;