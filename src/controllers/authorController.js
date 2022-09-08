const authorModel = require('../models/authorModel')
const jwt = require("jsonwebtoken")
const { getBlogs } = require('./blogController')

/***************************************************Create Author********************************************************/
//
const createAuthor = async function (req, res) {

    try {
        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ Error: "Body  should be not empty" })
        }
        let data = req.body
        let savedData = await authorModel.create(data)
        res.status(201).send(savedData)
    }
    catch (error) {

        return res.status(500).send({ status: false, msg: error.message })
    }


}


/*************************************************Login Author**********************************************************/
let loginAuthor = async function (req, res) {
    try {
        let email = req.body.email;
        let password = req.body.password;

        if (!email) return res.status(400).send({ status: false, msg: 'please provide valid email id' });

        if (!password) return res.status(400).send({ status: false, msg: 'please provide valid password' })

        let authors = await authorModel.findOne({ email: email, password: password });
        if (!authors) return res.status(400).send({
            status: false, msg: "email or the password is not correct",
        });

        let token = jwt.sign(
            {
                authorId: authors._id.toString(),
                project: 1,
                group: "group-51",
            },
            "functionUp-project1"
        );
        console.log(token);
        res.status(201).send({ status: true, data: { token } });
    } catch (err) {
        res.status(500).send({ msg: "Error", msg: err.message })
    }
};


module.exports.createAuthor = createAuthor
module.exports.loginAuthor = loginAuthor




/***************************************************End******************************************************************/








/*

const isValidEmail = (mail) => {
    if (/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(mail))
        return true
}

*/