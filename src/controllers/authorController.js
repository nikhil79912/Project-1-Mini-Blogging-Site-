const authorModel = require('../models/authorModel')

const createAuthor = async function (req, res){

    try {
        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ Error: "Body  should be not emety" })
        }
        let data = req.body
        let savedData = await authorModel.create(data)
        res.status(201).send(savedData)
    }
    catch (error) {
        return res.status(500).send({status:false,msg:error.message})
    }


}

module.exports.createAuthor = createAuthor
