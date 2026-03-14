import  { useRef, useEffect, useState } from "react"
import './Header.css'
import HeaderSide from "./HeaderSide";
function Header({setUpdate,update,setErreurMsg,setSuccesMsg,setColumnColor,setBackground,setIsLoggedIn,setNavHeight}){

    const jwt = !!localStorage.getItem("jwt") ?  localStorage.getItem("jwt"):sessionStorage.getItem("jwt")
    const [clicked,setClicked] = useState(false)
    const [profile,setProfile] =useState("/profilPictures/profilbase.jpg")
    const [username,setUsername] = useState("")
    const [userId,setUserId]=useState("")
    



        const headerRef = useRef(null)
        useEffect(
            ()=>{
                
                function getHeight(){
                    const bareHeight = headerRef.current.offsetHeight;
                    setNavHeight(bareHeight)
            
                    
                };
                getHeight();
                window.addEventListener("resize",getHeight)
                
                return()=>{
                    window.removeEventListener("resize",getHeight)
                };
            },
        [])

    async function getCustomInfos(){
        try{
            const demande = await fetch(
            "http://localhost:1337/api/users/me?fields=username",
            {
                headers: {
                    "Authorization": `Bearer ${jwt}`
                }
            }
            )
            if(demande.ok){
                const data = await demande.json()
                let user = data.username
                setUsername(user)
                let id = data.id
                setUserId(id)
            }
            else{
                setUsername("N/A")
                setUserId("N/A")
                setErreurMsg("Impossible de charger les informations du profil.")
            }


        }catch(err){
                setUsername("N/A")
                setUserId("N/A")
                setErreurMsg("Impossible de charger les informations du profil.")
                console.log(err)
        }
        try{
            const demande = await fetch('http://localhost:1337/api/users/me', {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
            });

            const data = await demande.json()
            const picture = !!data.profilePicture ? `/profilPictures/${data.profilePicture}`:"/profilPictures/profilbase.jpg"
            setProfile(picture)

            const bg = !!data.bg ? `/backgrounds/${data.bg}`:"/backgrounds/background6.jpg"
            setBackground(bg)

            const cColor= !!data.color ?   data.color:"gold"
            setColumnColor(cColor)

            if(!(demande.ok)){
                setErreurMsg("Impossible de récupérer les paramétres");
            }
        }
        catch(err){
            setErreurMsg("Impossible de récupérer les paramétres");
            console.log(err)
        }
    }

    const headerSide = useRef(null)

    useEffect(() => {
        if(headerSide.current) {
            headerSide.current.style.display = clicked ? "block" : "none"
        }
    }, [clicked])

    useEffect(()=>{
        getCustomInfos()
        
    },[update])

    return(
        <>
        <div className="Header-container" ref={headerRef}>
            <h1>Flowy</h1>
            <div className="Header-img" onClick={()=>{setClicked(!clicked)}}>
                <img src={profile} alt="Le Photo de Profil"/>
            </div>
        </div>      
        
        
        <HeaderSide username={username} setUpdate={setUpdate} jwt={jwt}  setErreurMsg={setErreurMsg} profile={profile} setClicked={setClicked}  userId={userId} setSuccesMsg={setSuccesMsg} setIsLoggedIn={setIsLoggedIn} update={update} ref={headerSide} /> 
        
        </>
    );
}

export default Header