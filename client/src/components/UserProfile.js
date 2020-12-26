import React,{useEffect,useState,useContext} from 'react'
import {userContext} from '../App'
import {useParams} from 'react-router-dom'

//profile page of other user
const UserProfile = () => {
    const [userProfile,setProfile]=useState(null)
    const {state,dispatch}=useContext(userContext)
    const {userid}=useParams()
    console.log(userid)                              
    useEffect(() => {
        fetch(`http://localhost:5000/user/${userid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result => {
           //console.log(result)               // result contanis posts[array]and user object(_id,name,emil)
            setProfile(result)
        })
    }, [])

    return (
        <>
        {userProfile? 
            <div style={{maxWidth:"550px",margin:"0px auto"}}>
            <div style={{
                display: "flex",
                justifyContent: "space-around",
                margin: "18px 0px",
                borderBottom:"1px solid grey"
            }}>
                <div>
                <img style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                    src={userProfile.user.pic}/>
                </div>
                <div>
                     <h4>{userProfile.user.name}</h4> 
                     <h5>{userProfile.user.email}</h5> 
                    <div style={{
                        display:"flex",
                        justifyContent:"space-between",
                        width:"108%"
                        }}>
                        <h6>{userProfile.posts.length} post</h6>
                        <h6>40 followers</h6>
                        <h6>40 followings</h6>
                    </div>
                </div>
            </div>
            <div className="gallery">
            {
                userProfile.posts.map(item=>{
                    return(
                        <img className="item" src={item.photo} alt={item.title}/>
                    )
                })
            }
            </div>
        </div>
        :<h2>loading...!</h2>
        }
        </>
    )
}
export default UserProfile
