const express = require("express");
const router = express.Router();

const authorController = require("../controllers/authorController")
const blogController = require("../controllers/blogController")
const middleware= require("../middleware/auth")




router.post("/authors", authorController.createAuthor)
router.post("/login",authorController.loginAuthor)

router.post("/blogs", middleware.authentication, blogController.createBlog)
router.get("/getBlogs", middleware.authentication, blogController.getBlogs)
router.put("/blogs/:id",middleware.authentication,middleware.authorization, blogController.updateBlogs)
router.delete("/blogs/:id", middleware.authentication,middleware.authorization, blogController.deleted)
router.delete("/blogs", middleware.authentication,middleware.authorization, blogController.queryDeleted)




module.exports= router;
