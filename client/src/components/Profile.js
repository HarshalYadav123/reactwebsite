import React,{useEffect,useState,useContext} from 'react'
import {userContext} from '../App'

const Profile = () => {
    const [mypics,setPics]=useState([])
    const {state,dispatch}=useContext(userContext)
   // console.log(state)                              //(_id,name,email)
    useEffect(() => {
        fetch('http://localhost:5000/mypost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result => {
           // console.log(result)               // (result is object(mypost) which contains array[id,title,body,photo])
            setPics(result.mypost)
        })
    }, [])

    return (
        <div style={{maxWidth:"550px",margin:"0px auto"}}>
            <div style={{
                display: "flex",
                justifyContent: "space-around",
                margin: "18px 0px",
                borderBottom:"1px solid grey"
            }}>
                <div>
                <img style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                    src={state?state.pic:"loading"} />
                </div>
                <div>
                     <h4>{state?state.name:"loading"}</h4> 
                     <h5>{state?state.email:"loading"}</h5> 
                    <div style={{
                        display:"flex",
                        justifyContent:"space-between",
                        width:"108%"
                        }}>
                        <h6>40 post</h6>
                        <h6>40 followers</h6>
                        <h6>40 followings</h6>
                    </div>
                </div>
            </div>
            <div className="gallery">
            {
                mypics.map(item=>{
                    return(
                        <img className="item" src={item.photo} alt={item.title}/>
                    )
                })
            }
            </div>
        </div>
    )
}
export default Profile
