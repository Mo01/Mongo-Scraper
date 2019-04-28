const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models");

module.exports = function(app) {
  //Scrape NPR for latest music news
  app.get("/api/scrape", (req, res) => {
    axios.get("https://www.npr.org/sections/movies/").then(response => {
      let $ = cheerio.load(response.data);

      $("article.item").each((i, element) => {
    
        let article = {
          title: $(element)
            .find($(".title"))
            .text(),
           image: $(element)
           .find($("img"))
           .attr("src")
        };

        db.Article.findOne({ title: article.title }).then(dbArticle => {
          if (!dbArticle) {
            db.Article.create(article)
              .then(dbArticle => {
                console.log("Creating article");
              })
              .catch(err => {
                console.log(err);
              });
          }
        });
      });
      res.json("Done");
    });
  });

  //Save an article for later
  app.put("/api/save", (req, res) => {
    db.Article.updateOne(
      { _id: req.body.id },
      { $set: { saved: true, createdAt: new Date() } }
    ).then(record => {
      res.json(record);
    });
  });

  //Remove an article from saved
  app.put("/api/delete", (req, res) => {
    db.Article.updateOne({ _id: req.body.id }, { $set: { saved: false } }).then(
      record => {
        res.json(record);
      }
    );
  });

  //Load comments for and article
  app.get("/api/comments/:id", (req, res) => {
    db.Article.findOne({ _id: req.params.id })
      .populate("comment")
      .then(response => {
        res.json(response);
      })
      .catch(err => {
        res.json(err);
      });
  });

  //Add comment to an article
  app.post("/api/addcomment/:id", (req, res) => {
    db.Comment.create(req.body).then(dbComment => {
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { comment: dbComment._id } },
        { new: true }
      ).then(dbArticle => {
        res.json(dbComment);
      });
    });
  });

  //Delete a comment from an article
  app.delete("/api/deletecomment/:id", (req, res) => {
    db.Comment.deleteOne({ _id: req.params.id }).then(result => {
      res.json(result);
    });
  });
};
