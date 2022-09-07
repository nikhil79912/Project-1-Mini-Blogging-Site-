const authorModel = require('../models/authorModel')
const blogModel = require("../models/blogModel")
const jwt = require("jsonwebtoken")



const authentication = function (req, res, next) {
    {
        try {
            let token = req.headers["x-api-key"];
            
            if (!token){
             return res.send({ status: false, msg: "token must be present in the request header" })
            }
            let decodedToken = jwt.verify(token, "functionUp-project1")
            console.log(decodedToken);
            console.log(decodedToken.authorId);

            if (!decodedToken) return res.status(401).send({ status: false, msg: "token is not valid" })
            req["decodedToken"] = decodedToken
            next()
        } catch (err) {
            console.log("This is the error :", err.message)
            res.status(500).send({ msg: " server Error", error: err.message })

        }
    }
}



const authorization = async function(req, res, next) {
    try {
        let token = req.headers["x-api-key"]

        let blogId = req.params.id
        blogId.query.id
        console.log(blogId);

        if (!blogId) {
            return res.status(400).send({ status: false, msg: "Blog ID is not valid." })
        }

        let a = await blogModel.findById(blogId).select({ authorId: 1, _id: 0 })
        if (!a) {
            return res.status(404).send({ status: false, msg: "Blog document doesn't exist.." })
        }

        let authorId = a.authorId
        console.log(authorId);

        let decodedToken = jwt.verify(token, "functionUp-project1");
        console.log(decodedToken);

        if (authorId != decodedToken.authorId) {

            return res.status(403).send({ status: false, msg: 'Access is Denied' })

        }
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
    
    next()
};


module.exports.authentication = authentication;
module.exports.authorization = authorization;