const express = require("express"),
      router = express.Router(),
      db = require("../models/dbconnection");

router.get("/users", (req, res) => {
    db.query("SELECT id, net_id, last_name, first_name, email, role FROM users", (err, result, fields) => {
        if(err) throw err;
        res.render("users", {users: result});
    });
});

// Form to add new user

router.get("/users/new", (req, res) => { 
    res.render("new-user");
});

// Add new user

router.post("/users", (req, res) => {
    var user = {
        net_id: req.body.net_id,
        last_name: req.body.last_name,
        first_name: req.body.first_name,
        email: req.body.email,
        role: req.body.role
    };
    db.query("INSERT INTO users SET ?", user, (err, result) => {
        if(err) throw err;
        req.flash("success", "User has been added");
        res.redirect("/users");
    });
});

//Delete user

router.delete("/users/:id", (req, res) => {
    var user_id = req.params.id;
    db.query("DELETE FROM users WHERE id = ?;", user_id, (err, result) => {
        if(err) throw err;
        req.flash("success", "The user has been deleted.");
        res.redirect("/users");
    });
});


module.exports = router;