import React, { useState, useEffect,useContext } from 'react'
import {userContext} from '../App'
import {Link} from 'react-router-dom'

const Home = () => {
    const [data, setData] = useState([])
    const{state,dispatch} = useContext(userContext)
    useEffect(() => {
        fetch('http://localhost:5000/allpost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())                //send json response
            .then(result => {
                console.log(result)
                //console.log(result.posts)        // [_id,title,body,photo,postedBy(id,name)]
                setData(result.posts)               // result->boject   posts->array
            })
    }, [])

    const likePost = (id) => {
        fetch('http://localhost:5000/like', {
            method: "put",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({                       // convert javascript object to string(When sending data to a web server the data has to be a string)
                postId: id                                // id = postId
            })
        }).then(res => res.json())
            .then(result => {
                //console.log(result)
                const newData = data.map(item => {
                    if (item._id == result._id) {               // if match    
                        return result                           //then return updated record
                    } else {
                        return item                             //else return old record
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }

    const unlikePost = (id) => {
        fetch('http://localhost:5000/unlike', {
            method: "put",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({                       // convert javascript object to string(When sending data to a web server the data has to be a string)
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                // console.log(result)
                const newData = data.map(item => {
                    if (item._id == result._id) {                   //if existing postId match with this postId then
                        return result                               //return updated record
                    } else {
                        return item                                 //else return old record
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }

    const makeComment = (text,postId)=>{
        fetch("http://localhost:5000/comment",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                text:text,
                postId:postId
            })
        }).then(res=>res.json())
        .then(result=>{
           console.log(result)
            const newData = data.map(item => {
                if (item._id == result._id) {                   //if existing postId match with this postId then
                    return result                               //return updated record
                } else {
                    return item                                 //else return old record
                }
            })
            setData(newData)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const deletePost = (postId)=>{
        fetch(`http://localhost:5000/deletepost/${postId}`,{
            method:"delete",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData=data.filter(item=>{
                return item._id !== result._id                // if existing postId not match with resultant updated Id then return remaining posts(existing items)
            })
            setData(newData)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    // const deleteComment=(commentId)=>{
    //     fetch(`http://localhost:5000/deletecomment/${commentId}`,{
    //         method:"delete",
    //         headers:{
    //             "Authorization":"Bearer "+localStorage.getItem("jwt")
    //         }
    //     }).then(res=>res.json())
    //     .then(result=>{
    //         console.log(result)
    //     })
    // }

    return (
        <div className="home">
            {
                data.map(item => {
                    return (
                        <div className="card home-card">
                            <h5><Link to={"/profile/"+item.postedBy._id}>{item.postedBy.name}</Link>
                            { item.postedBy._id == state._id 
                            && <i className="material-icons" style={{float:"right"}} onClick={() => {deletePost(item._id)}}>delete</i>
                            }
                            </h5>
                            <div className="card-image">
                                <img src={item.photo} />
                            </div>
                            <div className="card-content">
                                <i className="material-icons" style={{ color: "red" }}>favorite</i>
                                {item.likes.includes(state._id)
                                ?
                                <i className="material-icons" onClick={() => { unlikePost(item._id) }}>thumb_down</i>
                                :
                                <i className="material-icons" onClick={() => { likePost(item._id) }}>thumb_up</i>
                                }
                                <h6>{item.likes.length} likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record=>{
                                        return(
                                            <h6><span style={{fontWeight:"500"}}>{record.postedBy.name} </span>{record.text}
                                            </h6>
                                        )
                                    })
                                   
                                }
                                <form onSubmit={(e)=>{
                                    e.preventDefault()
                                    makeComment(e.target[0].value,item._id)
                                }}>
                                <input type="text" placeholder="add comment" />
                                </form>
                            </div>
                        </div>
                    )
                })
            }

        </div>
    )
}
export default Home