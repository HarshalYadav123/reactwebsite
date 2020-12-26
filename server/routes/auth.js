const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")                             // require User schema for manipulating with db
const bcrypt = require('bcryptjs')                              //encrypt password and then saved to db
const jwt = require('jsonwebtoken')                             // for creating token we require this package
const {JWT_SECRET} = require('../keys')                         // require secrete key for creating token 
const requireLogin = require('../middleware/requireLogin')      // require middleware for giving access resources
const nodemailer = require('nodemailer')
const sendgridTransport= require('nodemailer-sendgrid-transport')

const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:"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"
    }
}))


// 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
//  router.get('/protected',requireLogin,(req,res)=>{
//     res.send('hello user')
//  })

router.post('/signup',(req,res)=>{
    const{name,email,password,pic}=req.body
    if(!name || !email || !password){
    return res.status(422).json({error:"please add all fields"})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"user already exist with that email"})
        }
        bcrypt.hash(password,12)
        .then(hashedpassword=>{
            const user = new User({                        
                name,
                email,
                password:hashedpassword,
                pic:pic
            })
            user.save()
            .then(user=>{
                transporter.sendMail({
                    to:user.email,
                    from:"9.nikhilyadav@gmail.com",
                    subject:"signup success",
                    html:"<h1>Welcome to Instagram</h1>"
                })
                res.json({message:"SignUp successfuly"})
            })
            .catch(err=>{
                console.log(err)
            })
        })
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/signin',(req,res)=>{
    const{email,password}=req.body
    if(!email || !password){
       return res.status(422).json({error:"please add email or password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
           return res.status(422).json({error:"invalid email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
               // res.json({message:"signed in successfully"})
               const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
               const {_id,name,email,pic}=savedUser
                res.json({token,user:{_id,name,email,pic}})
            }
            else{
                return res.status(422).json({error:"invalid email or password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})

module.exports= router