import './App.css'
import React,{useEffect,createContext,useReducer,useContext} from 'react'
import Navbar from './components/Navbar'
import {BrowserRouter,Route,Switch,useHistory} from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Profile from './components/Profile'
import UserProfile from './components/UserProfile'
import Signup from './components/Signup'
import CreatePost from './components/CreatePost'
import {reducer,initialState} from './reducers/userReducer'

export const userContext = createContext()

const Routing = ()=>{
  const history = useHistory()
  const{state,dispatch}=useContext(userContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))    // get user and token from local storage
    //console.log(user)                                      // (id,name,email)
    if(user){
      dispatch({type:"USER",payload:user})                  // if user close window without logout then remains same state
    }else{
      history.push('/login')
    }
  },[])
  return(
    <Switch>
    <Route path="/signup" component={Signup}/>
    <Route path="/login" component={Login}/>
    <Route exact path="/" component={Home}/>
    <Route exact path="/profile" component={Profile}/>
    <Route exact path="/profile/:userid" component={UserProfile}/>
    <Route path="/create" component={CreatePost}/>
    </Switch>
  )
}

function App() {
  const[state,dispatch]= useReducer(reducer,initialState)
  return (
    <userContext.Provider value={{state,dispatch}}>
  <BrowserRouter>
   <Navbar/>
   <Routing/>
  </BrowserRouter>
  </userContext.Provider>
  );
}

export default App;
