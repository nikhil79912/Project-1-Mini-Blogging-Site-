const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")


const createBlog = async function (req, res) {

    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "body should not be empty" })
        }
        let Id = data.authorId
        let authorId = await authorModel.findById(Id)
        if (!authorId) {
            return res.status(404).send({ status: false, msg: "authorid is not valid" })
        }
        let savedData = await blogModel.create(data)
        res.status(201).send(savedData)
    } catch (error) {
        return res.status(500).send({ msg: error.message })

    }
}
//

let getBlogs = async function (req, res) {
    try {
        const data = req.query;
        if (!Object.keys(data).length) {
            let blogs = await blogModel.find({ $and: [{ isDeleted: false }, { isPublished: true }] });
            if (!Object.keys(blogs).length) {
                return res.status(404).send({ status: false, msg: "No such blog eists" });
            }
            return res.status(200).send({ status: true, data: blogs });
        } else {
            let blogs = await blogModel.find({ $and: [{ isDeleted: false }, { isPublished: true }, data] });
            if (!Object.keys(blogs).length) {
                return res.status(404).send({ status: false, msg: "1.No such blog eists" });
            }
            return res.status(200).send({ status: true, list: blogs });
        }
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
};

//
const updateBlogs = async function (req, res) {
    try {
        let blogId = req.params.id
        console.log(blogId);
        let data = req.body
        let title = data.title
        let body = data.body
        let tags = data.tags
        let subcategory = data.subcategory

        if (!blogId) {
            return res.status(400).send({ status: false, msg: "please provide a blogId" })
        }
        let validId = await blogModel.findById(blogId)
        if (!validId) {
            return res.status(400).send({ status: false, msg: "This user is not present" })
        }
        let savedData = await blogModel.findOneAndUpdate({ _id: blogId }, { $set: { title: title, body: body, tags: tags, subcategory: subcategory, isPublished: true, publishedAt: Date.now() } }, { new: true })
        res.send(savedData)

    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

//

const deleted = async function (req, res) {
    try {
        let blogId = req.params.id
        if (!blogId) {
            return res.status(404).send({ status: false, msg: "blogid is require" })
        }
        let valid = await blogModel.findById(blogId)
        if (!valid) {
            return res.status(404).send({ status: false, msg: "invalid blog id" })
        }
        if (valid.isDeleted == true) {
            return res.status(404).send({ status: false, msg: "this blog is already deleted" })
        }
        if (valid.isDeleted == false) {
            let deletetion = await blogModel.findByIdAndUpdate({ _id: blogId }, { $set: { isDeleted: true, deletedAt: new Date() } })
            return res.status(200).send({ status: true, msg: "blog is deleted successfully" })
        }

    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}


//

const queryDeleted = async function (req, res) {
    try {
        const { category, authorId, isPublished, tags, subcategory } = req.query
        const result = { isDeleted: false }

        if (Object.keys(req.query).length === 0) {
            return res.status(400).send({ status: false, msg: "No blog to be deleted. Aborting deletion" })
        }
        let b = await blogModel.find({ authorId: authorId }).select({ _id: 1, isDeleted: 1 })

        if (b == null) {
            return res.status(404).send({ status: false, msg: "Blog document doesn't exists." })
        }
        if (category) {
            result.category = category
        }

        if (tags) {
            result.tags = { $in: [tags] }
        }

        if (subcategory) {
            result.subCategory = { $in: [subcategory] }
        }

        if (isPublished) {
            result.isPublished = isPublished
        }
        const blog = await blogModel.find(result)
        if (blog.length === 0) {
            return res.status(200).send({ status: true, msg: "No blog found." })
        }

        const updateData = await blogModel.updateMany(result, { isDeleted: true, deletedAt: Date.now() } ,{new: true})

        return res.status(200).send({ status: true, Data: updateData })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, msg: error.message })
    }
}







module.exports.createBlog = createBlog
module.exports.getBlogs = getBlogs
module.exports.updateBlogs = updateBlogs
module.exports.deleted = deleted
module.exports.queryDeleted = queryDeleted














// const getBlogs = async function (req, res) {
//     try {
//
//         else if ((authorId && category && subcategory)) {
//             let blogs = await blogModel.find({ subcategory: subcategory, authorId: authorId, subcategory: subcategory, isDeleted: false, isPublished: true })
//             if (blogs.length == 0) {
//                 res.status(404).send({ msg: "Blog are not available in given category , subcategory and author id!!" })
//             }
//             res.send({ status: true, data: blogs })

//         }
//         else if ((category && subcategory)) {
//             let blogs = await blogModel.find({ subcategory: subcategory, category: category, isDeleted: false, isPublished: true })
//             if (blogs.length == 0) {
//                 res.status(404).send({ msg: "Blog are not available in given category and subcategory!!" })
//             }
//             res.send({ status: true, data: blogs })


//         }
//         else if ((authorId && category)) {
//             let blogs = await blogModel.find({ category: category, authorId: authorId, isDeleted: false, isPublished: true })
//             if (blogs.length == 0) {
//                 res.status(404).send({ msg: "Blog are not available in given category and authorId!!" })
//             }
//             res.send({ status: true, data: blogs })
//         }
//         else if ((category && tags)) {
//             let blogs = await blogModel.find({ authorId: authorId, tags: tags, isDeleted: false, isPublished: true })
//             if (blogs.length == 0) {
//                 res.status(404).send({ msg: "Blog are not available in given category and tags!!" })
//             }
//             res.send({ status: true, data: blogs })
//         }
//         else if (authorId) {
//             let blogs = await blogModel.find({ authorId: authorId, isDeleted: false, isPublished: true })
//             if (blogs.length == 0) {
//                 res.status(404).send({ msg: "Blog are not available in given id!!" })
//             }
//             res.send({ status: true, data: blogs })
//         }
//         else if (category) {
//             let blogs = await blogModel.find({ category: category, isDeleted: false, isPublished: true })
//             if (blogs.length == 0) {
//                 res.status(404).send({ msg: "Blog are not available in given category!!" })
//             }
//             res.send({ status: true, data: blogs })

//         }
//         else if (subcategory) {
//             let blogs = await blogModel.find({ subcategory: subcategory, isDeleted: false, isPublished: true })
//             if (blogs.length == 0) {
//                 res.status(404).send({ msg: "Blog are not available in given subcategory!!" })
//             }
//             res.send({ status: true, data: blogs })

//         }
//         else if (tags) {
//             let blogs = await blogModel.find({ tags: tags, isDeleted: false, isPublished: true })
//             if (blogs.length == 0) {
//                 res.status(404).send({ msg: "Blog are not available in given tags!!" })
//             }
//             res.send({ status: true, data: blogs })

//         }

//         else {
//             let blogs = await blogModel.find({ isDeleted: false, isPublished: true })
//             if (blogs.length == 0) {
//                 res.status(404).send({ msg: "Blog are not available !!" })
//             }
//             res.send({ status: true, data: blogs })
//         }
//     } catch (error) {
//         return res.status(500).send({ status: false, msg: error.message })

//     }

// }






//

// const queryDeleted = async function (req, res) {
    //     try {
    //         let data= req.query
    //         let filter= {...data}
    //         if(!data){
    //             return res.status(404).send({status:false, msg:"query params is not given"})

    //         }
    //         let blogValid= await blogModel.findOne(filter)
    //         if(!blogValid){
    //             return res.status(404).send({status:false, msg:"this blog is not exist"})
    //         }
    //         if(blogValid.isDeleted== true){
    //             return res.status(404).send({status:false, msg:"this blog is already deleted"})
    //         }
    //         if(blogValid== false){
    //             let list= blogValid._id
    //             console.log(list);
    //             let deletion= await blogModel.findOneAndUpdate(filter,{ $set: {isDeleted: true, deletedAt: new Date()}})
    //             return res.status(200).send({status: true, msg: "blog is deleted successfully"})
    //         }
    //     } catch (error) {
    //         return res.status(500).send({ status: false, msg: error.message })
    //     }
    // }

//     let authorId = req.query.authorId
//     let category = req.query.category
//     let tags = req.query.tags
//     let subcategory = req.query.subcategory
//     let isPublished= req.query.isPublished
//     if ((category && authorId && tags && subcategory && isPublished)) {
//         let blogs = await blogModel.findOneAndUpdate({ category: category, authorId: authorId, tags: tags, subcategory: subcategory, isPublished: isPublished },{$set:{isDeleted: true}})
//         if (!blogs) {
//             res.status(404).send({ msg: "Blog are not available in given category , subcategory , tags and author id!!" })
//         }
//         res.send({ status: true, data: blogs })

//     }
// }

//