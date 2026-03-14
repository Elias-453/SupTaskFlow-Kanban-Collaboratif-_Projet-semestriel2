import { forwardRef, useEffect, useState } from "react";

function HeaderSide({username,setUpdate,jwt,setErreurMsg,profile,userId,setClicked,setSuccesMsg,setIsLoggedIn,update},ref){

    function isCanBeBoard(e){
        const board = e.target.value
        const characters = [
         "½","£","!", "\"", "#", "$", "%", "&", "'", "(", ")", "*","+", "/",":", ";", "<", "=", ">", "?","@","[", "\\", "]", "^", "`","{", "|", "}", "~"];
        if(characters.some(char => board.includes(char)))return false;
        return true;
    }
    
    const[mode,setMode]=useState(localStorage.getItem("mode")||"dark")
    
    useEffect(()=>{
        if(mode=="light"){
            document.body.classList.add("light")
        }else{
            document.body.classList.remove("light")
        }
        console.log(mode)
    },[mode])

    const [user,setUser]=useState("")
    const [photoProfile,setPhotoProfile]=useState(null)
    const [bg,setBg]=useState(null)
    const [color,setColor]=useState(null)
    

    function cleanOldAccount(){
        localStorage.removeItem("jwt")
        sessionStorage.removeItem("jwt")
    }

    function saveCancel(which){
        setUser("")
        setPhotoProfile(null)
        setBg(null)
        setColor(null)
        if(which!="apply"){
            setClicked(false)
        }
    }

    async function saveChanges() {
        let changeName=false
        let changePhoto=false
        let changeColor=false
        let changeBg=false
        //control
        if(user.trim() !== ""){
            if(!(user.length>2)){
                setErreurMsg("Le pseudo doit faire au moins 3 caractères");
            }
            else{changeName=true}
            
        }
        
        if(photoProfile !== null){
            changePhoto=true
        }
        
        if(color !== null){
            changeColor = true
        }

        if(bg !== null){
            changeBg = true
        }
        let infos = {}

        if(changeName){
            infos = {...infos,username:user}
        }

        if(changePhoto){
            infos = {...infos,profilePicture:photoProfile}
        }
        if(changeColor){
             infos = {...infos,color:color}
        }
        if(changeBg){
             infos = {...infos,bg:bg}
        }
        
        try{
            const demande = await fetch(`http://localhost:1337/api/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwt}`
            },
            body: JSON.stringify(infos),
            
        });
        if (!demande.ok) {
            setErreurMsg( "Erreur lors de la mise à jour")
            return;
        }
        setSuccesMsg("Les Modifications sont appliquées")
        setUpdate(u => !u)
        }
        catch(err){

            setErreurMsg( "Erreur lors de la mise à jour")
            saveCancel()
            console.log(err)
        }
        saveCancel("apply")
    }


    function border(element,type){
        if(type=="photo"){
            return {border: photoProfile === element ? "7px solid darkred" : (mode =="light" ? "2px solid black" : "2px solid white") }
        }
        else if(type=="color"){
            return {border: color === element ? "7px solid darkred" : (mode =="light" ? "2px solid black" : "2px solid white") }
        }
        else{
            return {border: bg === element ? "7px solid darkred" : (mode =="light" ? "2px solid black" : "2px solid white") }
        }
        
    }

    return(
       <div className="Header-headerSide" ref={ref}>
            <span className="themeChange">{mode == "dark" ? <span onClick={()=>{
                localStorage.setItem("mode","light")
                setMode(localStorage.getItem("mode"))
            } }>🌙</span>:<span onClick={()=>{
                localStorage.setItem("mode","dark")
                setMode(localStorage.getItem("mode"))
            }}>☀️</span>}</span>
            <div className="Header-userinfos">
                <img className="Header-bigPhoto" src={profile} alt="Photo de profil" />
                <p>{username}</p>
            </div>
            <div className="Header-pictureBigContainer">
                <p>Photos de Profile</p>
                <div className="Header-pictures">
                    <img src="/profilPictures/picture1.jpg" style={border("picture1.jpg","photo")} onClick={()=>setPhotoProfile("picture1.jpg")} alt="Photo de Profil"  />
                    <img src="/profilPictures/picture2.jpg" style={border("picture2.jpg","photo")} onClick={()=>setPhotoProfile("picture2.jpg")}    alt="Photo de Profil"  />
                    <img src="/profilPictures/picture3.jpg" style={border("picture3.jpg","photo")} onClick={()=>setPhotoProfile("picture3.jpg")} alt="Photo de Profil"  />
                    <img src="/profilPictures/picture4.jpg" style={border("picture4.jpg","photo")} onClick={()=>setPhotoProfile("picture4.jpg")} alt="Photo de Profil" />
                    <img src="/profilPictures/picture5.jpg" style={border("picture5.jpg","photo")} onClick={()=>setPhotoProfile("picture5.jpg")}  alt="Photo de Profil"  />
                    <img src="/profilPictures/picture6.jpg" style={border("picture6.jpg","photo")} onClick={()=>setPhotoProfile("picture6.jpg")}  alt="Photo de Profil"  />
                    <img src="/profilPictures/picture7.jpg" style={border("picture7.jpg","photo")} onClick={()=>setPhotoProfile("picture7.jpg")} alt="Photo de Profil" />
                    <img src="/profilPictures/picture8.jpg" style={border("picture8.jpg","photo")} onClick={()=>setPhotoProfile("picture8.jpg")} alt="Photo de Profil"  />
                    <img src="/profilPictures/picture9.jpg" style={border("picture9.jpg","photo")} onClick={()=>setPhotoProfile("picture9.jpg")} alt="Photo de Profil"  />
                    <img src="/profilPictures/picture10.jpg" style={border("picture10.jpg","photo")} onClick={()=>setPhotoProfile("picture10.jpg")} alt="Photo de Profil"  />
                </div>
            </div>

            <div className="Header-colorBigContainer">
                <p>Couleur des Colonnes</p>
                <div className="Header-colors">
                    <div className="Header-buble b1" style={border("violet","color")} onClick={()=>setColor("violet")} ></div>
                    <div className="Header-buble b2" style={border("palevioletred","color")} onClick={()=>setColor("palevioletred")} ></div>
                    <div className="Header-buble b3" style={border("purple","color")} onClick={()=>setColor("purple")} ></div>
                    <div className="Header-buble b4" style={border("gold","color")} onClick={()=>setColor("gold")} ></div>
                    <div className="Header-buble b5" style={border("orange","color")} onClick={()=>setColor("orange")}  ></div>
                    <div className="Header-buble b6" style={border("maroon","color")} onClick={()=>setColor("maroon")} ></div>
                    <div className="Header-buble b7" style={border("gray","color")} onClick={()=>setColor("gray")} ></div>
                    <div className="Header-buble b8" style={border("black","color")} onClick={()=>setColor("black")} ></div>
                    <div className="Header-buble b9" style={border("cadetblue","color")} onClick={()=>setColor("cadetblue")}  ></div>
                    <div className="Header-buble b10" style={border("blue","color")} onClick={()=>setColor("blue")} ></div>
                </div>
            </div>

            <div className="Header-colorBigContainer">
                <p>Fonds D'écran</p>
                <div className="Header-pictures">
                        <img src="/backgrounds/background1.jpg" style={border("background1.jpg","bg")} onClick={()=>setBg("background1.jpg")} alt="Photo de Profil"  />
                        <img src="/backgrounds/background2.jpg" style={border("background2.jpg","bg")} onClick={()=>setBg("background2.jpg")}  alt="Photo de Profil" />
                        <img src="/backgrounds/background3.jpg" style={border("background3.jpg","bg")} onClick={()=>setBg("background3.jpg")}  alt="Photo de Profil"  />
                        <img src="/backgrounds/background4.jpg" style={border("background4.jpg","bg")} onClick={()=>setBg("background4.jpg")}  alt="Photo de Profil" />
                        <img src="/backgrounds/background5.jpg" style={border("background5.jpg","bg")} onClick={()=>setBg("background5.jpg")}  alt="Photo de Profil"  />
                        <img src="/backgrounds/background6.jpg" style={border("background6.jpg","bg")} onClick={()=>setBg("background6.jpg")} alt="Photo de Profil" />
                        <img src="/backgrounds/background7.jpg" style={border("background7.jpg","bg")} onClick={()=>setBg("background7.jpg")} alt="Photo de Profil"  />
                        <img src="/backgrounds/background8.jpg" style={border("background8.jpg","bg")} onClick={()=>setBg("background8.jpg")} alt="Photo de Profil" />
                        <img src="/backgrounds/background9.jpg" style={border("background9.jpg","bg")} onClick={()=>setBg("background9.jpg")} alt="Photo de Profil"  />
                        <img src="/backgrounds/background10.jpg" style={border("background10.jpg","bg")} onClick={()=>setBg("background10.jpg")} alt="Photo de Profil" />
                </div>
            </div>

            <label className="Header-Label">Pseudo<input type="text"  value={user} onChange={(e) =>{
                                    if( !isCanBeBoard(e) || e.target.value.length >= 15)return;
                                    setUser(e.target.value)
                                }}/></label>
            <div className="headerAllBtns">
                <div className="Header-buttonsFirstHalf">
                    <button onClick={()=>saveChanges(user,photoProfile,bg,color,update,setUpdate)}>Appliquer</button>
                    <button onClick={()=>saveCancel("annuler")}>Annuler</button>
                </div>
                <button className="deconnecte" onClick={()=>{
                    cleanOldAccount()
                    setIsLoggedIn(false)
                    setSuccesMsg("Vous vous êtes déconnecté avec succès");
                }}>Déconnexion</button>
            </div>
       </div>
    );

}

export default forwardRef(HeaderSide)