const blogModel = require("../models/blogModel")


const Blog = async function(req,res){

try {
    let data= req.body
    let authorId= data.authorId
    if(!authorId){
        return res.status(401).send({status: false, msg: "authorid is not valid"})
    }
    let savedData= await blogModel.create(data)
    res.status(201).send(savedData)
} catch (error) {
    return res.status(400).send({msg: error.message})
    
}
}




module.exports.Blog= Blog