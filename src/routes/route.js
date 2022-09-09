const express = require("express");
const router = express.Router();

const authorController = require("../controllers/authorController")
const blogController = require("../controllers/blogController")
const middleware = require("../middleware/auth")



//create 
router.post("/authors", authorController.createAuthor)

//login
router.post("/login", authorController.loginAuthor)

//create blog
router.post("/blogs", middleware.authentication, blogController.createBlog)

//get blog
router.get("/getBlogs", middleware.authentication, blogController.getBlogs)

//update blog
router.put("/blogs/:id", middleware.authentication, blogController.updateBlogs)

//delete
router.delete("/blogs/:id", middleware.authentication, blogController.deleted)

//delete by query
router.delete("/blogs", middleware.authentication, blogController.queryDeleted)




module.exports = router;
