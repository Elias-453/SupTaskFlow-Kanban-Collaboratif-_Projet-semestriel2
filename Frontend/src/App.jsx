import {useEffect, useState  } from "react"
import {toast,Toaster} from 'react-hot-toast'
import LoginRegisterPage from './pages/LoginRegisterPage'
import Header from './composants/Header/Header'
import MainContent from "./composants/MainContent/MainContent"

import './App.css'
function App() {
    
   


    const [erreurMsg,setErreurMsg] = useState("")
    const [succesMsg,setSuccesMsg] = useState("")
    
   
    
  /*  LA PARTİE TOKEN   */
  const [isLoggedIn,setIsLoggedIn]=useState(!!localStorage.getItem("jwt") || !!sessionStorage.getItem("jwt"))
  


  /* Token Jwt = localstorage jwt  or sessionstrorage jwt*/
  const [background,setBackground] = useState("/backgrounds/background6.jpg")
  const [columnColor,setColumnColor] = useState("gold");
  //body change
  useEffect(()=>{
    !isLoggedIn ? document.body.classList.add("login-page") : document.body.classList.remove("login-page")
    
  },[isLoggedIn])
  //customized things
  const [update,setUpdate] = useState(false) // c juste pour changer c pas important  le valeur

  useEffect(()=>{
    if(isLoggedIn){
    const jwt = !!localStorage.getItem("jwt") ?  localStorage.getItem("jwt"):sessionStorage.getItem("jwt")
    
    
  }
  },[isLoggedIn,update])
  //ERREUR MESSAGES
  useEffect(()=>{
    if(!erreurMsg) return;
    toast.error(erreurMsg);
    setErreurMsg("")
  },[erreurMsg])


  // MESSAGES DE SUCCéS
  useEffect(()=>{
    if(!succesMsg) return;
    toast.success(succesMsg);
    setSuccesMsg("")
  },[succesMsg])


  //navHeight
   const [navHeight,setNavHeight] = useState(null)
  return(
    <>
      <Toaster
          position="top-center"
          toastOptions={{
             className:"Toast-settings"
          }}
      />
      {isLoggedIn ? <>
          <Header setUpdate={setUpdate} update={update} setErreurMsg={setErreurMsg}   setSuccesMsg={setSuccesMsg} setBackground={setBackground}  setColumnColor={setColumnColor} setIsLoggedIn={setIsLoggedIn} setNavHeight={setNavHeight}></Header>
          <MainContent columnColor={columnColor} background={background} navHeight={navHeight} setSuccesMsg={setSuccesMsg}  setErreurMsg={setErreurMsg} />
          

      </> :
      <LoginRegisterPage  setIsLoggedIn={setIsLoggedIn} setErreurMsg={setErreurMsg} setSuccesMsg={setSuccesMsg}   />
}
    </>
  );
}

export default App;
