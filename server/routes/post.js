const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model("Post")
const requireLogin = require('../middleware/requireLogin')

//view all post in home page
router.get('/allpost',requireLogin,(req,res)=>{
    Post.find()                                         // find all post when u not give any param to find method

    //populate 1st param expand attribute and 2nd param specify which content u want to display on that attribute
    .populate("postedBy","_id name")                    // In postedBy attribute display only id and name 
    .populate("comments.postedBy","_id name")                    // In postedBy attribute of comments array display only id and name 
    .then(posts=>{
        res.json({posts})                               // display all post 
    })
    .catch(err=>{
        console.log(err)
    })
})

//creating new post  
router.post('/createpost',requireLogin,(req,res)=>{
    const{title,body,pic}= req.body
    console.log(title,body,pic)
    if(!title || !body || !pic){
     return res.status(422).json({error:"please add all the fields"})
    }

    req.user.password = undefined

    const post = new Post({
        title,
        body,
        photo:pic,
        postedBy:req.user                      //who post data gives user details (id,email,name) from middleware(requireLogin)
    })
    post.save()
    .then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err)
    })
})

//list all posts of loged in user (profile page)
router.get('/mypost',requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})                   //get all post who is logged in 
    .populate("postedBy","_id name")                     // display only id and name of postedBy attribute
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err)
    })
})

//like post
router.put('/like',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}                    //person who has like post pushing to likes array
    },{
        new:true                                     //return new updated record
    })
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

//unlike post
router.put('/unlike',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}                    //person who has unlike post remove from likes array
    },{
        new:true                                     //return new updated record
    })
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

//add comment to post
router.put('/comment',requireLogin,(req,res)=>{
    const comment={
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}                        //comment contains(text,postedBy) pushing to comments array
    },{
        new:true                                        //return new updated record
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

//delete post 
router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){           //if post posted man id match with loged in id
            post.remove()                                                       // remove that post 
            .then(result=>{
                res.json(result)
            })
            .catch(err=>{
                console.log(err)
            })
        }
    })
})

// delete comment
// router.delete('/deletecomment/:commentId',requireLogin,(req,res)=>{
//     Post.findOne({_id:req.params.commentId})
//     .populate("postedBy","_id")
//     .exec((err,post)=>{
//         if(err || !post){
//             return res.status(422).json({error:err})
//         }  
//         if(post.postedBy._id.toString() === req.user._id.toString()){
//             post.remove()
//             .then(result=>{
//                 res.json(result)
//             })
//             .catch(err=>{
//                 console.log(err)
//             })
//         }
//     })
// })

module.exports=router