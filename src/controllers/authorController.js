const authorModel = require("../models/authorModel")
const createAuthor = async function(req,res){
    try {
        let data= req.body
    let savedData= await authorModel.create(data)
    res.status(201).send(savedData)
        
    } catch (error) {
        return res.status(400).send({msg: error.message})
        
    }
    
}





module.exports.createAuthor= createAuthor  