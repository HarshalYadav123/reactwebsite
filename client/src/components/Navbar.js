import React,{useContext,useRef,useEffect,useState} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {userContext} from '../App'
import M from 'materialize-css'
const Navbar = () => {
    const[search,setSearch]= useState('')
    const[userDetails,setUserDetails]= useState([])
    const searchModal = useRef(null)
    const{state,dispatch}=useContext(userContext)
    const history = useHistory()
    useEffect(()=>{
        M.Modal.init(searchModal.current)
    },[])
    const renderList = ()=>{
        //console.log(state)              // (id,email,name)
        if(state){
            return[
                <li key="1"><i data-target="modal1" className="large material-icons  modal-trigger" style={{color:"black"}}>search</i></li>,
                <li key="2"><Link to="/profile">Profile</Link></li>,
                <li key="3"><Link to="/create">Create Post</Link></li>,
                <li key="4"><button className="btn #c62828 red darken-3" onClick={()=>{
                    localStorage.clear()
                    dispatch({type:"CLEAR"})
                    history.push('/login')
                }}>
                 Logout
                 </button></li>
            ]
        }else{
            return[
                <li key="5"><Link to="/login">Login</Link></li>,
                <li key="6"><Link to="/signup">SignUp</Link></li>
            ]
        }
    }
    
    const fetchUsers=(data)=>{
        setSearch(data)
        fetch("http://localhost:5000/search-users",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({                               // convert javascript object to string
                query:data
            })
        }).then(res=>res.json())                                // convert string to json object
        .then(result=>{
            console.log(result)
            setUserDetails(result.user)
        })
    }

    return (
        <nav>
            <div className="nav-wrapper white">
                <Link to={state?"/":"/login"} className="brand-logo left">Instagram</Link>
                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>
            {/* <!-- Modal Structure --> */}
            <div id="modal1" className="modal" ref={searchModal} style={{color:"black"}}>
                <div className="modal-content">
                <input 
                    type="text"
                    placeholder="search user"
                    value={search}
                    onChange={(e)=>fetchUsers(e.target.value)} 
                />
                <ul className="collection">
                {
                    userDetails.map(item=>{
                        return <Link to={"/profile/"+item._id} onClick={()=>{
                            M.Modal.getInstance(searchModal.current).close()
                        }}><li className="collection-item">{item.email}</li></Link>
                    })
                }
                </ul>
                </div>
                <div className="modal-footer">
                <button href="#!" className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch('')}>Close</button>
                </div>
            </div>
        </nav>
    )
}
export default Navbar