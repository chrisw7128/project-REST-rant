const router = require("express").Router();
const db = require("../models");

router.get("/", (req, res) => {
  db.Place.find()
    .then(places => {
      res.render("places/index", { places });
    })
    .catch(err => {
      console.log(err);
      res.render("error404");
    });
});

router.post("/", (req, res) => {
  if (!req.body.pic) {
    // Default image if one is not provided
    req.body.pic = "http://placekitten.com/400/400";
  }

  db.Place.create(req.body)
    .then(() => {
      res.redirect("/places");
    })
    .catch(err => {
      console.log("err", err);
      res.render("error404");
    });
});

router.get("/new", (req, res) => {
  res.render("places/new");
});

router.get("/:id", (req, res) => {
  db.Place.findById(req.params.id)
    .populate("comments")
    .then(place => {
      console.log(place.comments);
      res.render("places/show", { place });
    })
    .catch(err => {
      console.log("err", err);
      res.render("error404");
    });
});

router.put("/:id", (req, res) => {
  db.Place.findByIdAndUpdate(req.params.id, req.body)
    .then(() => {
      res.redirect(`/places/${req.params.id}`);
    })
    .catch(err => {
      console.log("err", err);
      res.render("error404");
    });
});

router.delete("/:id", (req, res) => {
  res.send("DELETE /places/:id stub");
});

router.get("/:id/edit", (req, res) => {
  db.Place.findById(req.params.id)
    .then(place => {
      res.render("places/edit", { place });
    })
    .catch(err => {
      res.render("error404");
    });
});

router.post("/:id/comment", (req, res) => {
  console.log(req.body);
  if (req.body.rant) {
    req.body.rant = true;
  } else {
    req.body.rant = false;
  }
  res.send("GET /places/:id/comment stub");
});

router.post("/", (req, res) => {
  db.Place.create(req.body)
    .then(() => {
      res.redirect("/places");
    })
    .catch(err => {
      if (err && err.name == "ValidationError") {
        let message = "Validation Error: ";
        for (var field in err.errors) {
          message += `${field} was ${err.errors[field].value}. ${err.errors[field].message}\n`;
        }
        res.render("places/new", { message });
      } else {
        res.render("error404");
      }
    });
});

router.delete("/:id", (req, res) => {
  db.Place.findByIdAndDelete(req.params.id)
    .then(place => {
      res.redirect("/places");
    })
    .catch(err => {
      console.log("err", err);
      res.render("error404");
    });
});

module.exports = router;
