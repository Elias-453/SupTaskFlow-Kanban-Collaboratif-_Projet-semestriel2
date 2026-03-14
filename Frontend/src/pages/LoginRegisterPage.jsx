import { useEffect, useRef, useState } from "react";
import'./Login.css';
function LoginRegisterPage({setIsLoggedIn,setSuccesMsg,setErreurMsg}){
    const [passwordShow,setPasswordShow]=useState(false)
    const [mail,setMail]=useState("")
    const [password,setPassword]=useState("")
    const [passwordAgain,setPasswordAgain]=useState("")
    const [rememberMe,setRememberMe] = useState(false)
    const [pageLogin,setPageLogin] = useState(true)
    function cleanOldAccount(){
        localStorage.removeItem("jwt")
         sessionStorage.removeItem("jwt")
    }
    
    function loginInfoControl(){

        async function tokenGet(mail,password){
            try{
                const demande = await fetch("http://localhost:1337/api/auth/local",{
                method: "POST",
                headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                identifier:mail,
                password:password
            }),
            })
            if(!demande.ok){
            
            switch(demande.status){
                case 400:
                setErreurMsg("Email ou mot de passe incorrect");
                throw new Error("401 - Identifiants incorrects");
                
                case 404:
                    setErreurMsg("Service indisponible pour le moment");
                    throw new Error("404 - Endpoint introuvable");
                    
                case 500:
                    setErreurMsg("Erreur serveur, veuillez réessayer plus tard");
                    throw new Error("500 - Erreur serveur");
                default:
                    setErreurMsg("Erreur inconnue");
                    throw new Error(`${demande.status} - Erreur inconnue`);
            }
            } 
            const data = await demande.json()
            cleanOldAccount()
            
            if(rememberMe){
                localStorage.setItem("jwt",data.jwt)
            }else{
                 sessionStorage.setItem("jwt",data.jwt)
            }
            
            setIsLoggedIn(true)
            setSuccesMsg("Vous êtes connecté !")
            setMail("")
            setPassword("")
            }
            catch(err){
            console.error("Erreur détectée :", err.message);
            setIsLoggedIn(false)
            cleanOldAccount()
            setMail("")
            setPassword("")
            }
        }
        tokenGet(mail,password)
    }
    const antispamMsg= useRef(false)
    const antispam=useRef(0)
    function enterEvent(e){
        if(e.key !== "Enter")return;
        if(antispam.current>=3){
            if(!antispamMsg.current){
                setErreurMsg("Veuillez patienter avant de réessayer.")
                antispamMsg.current=true
                setTimeout(() => {
                    antispamMsg.current=false
                }, 3500);
            }
            return;
        }
        antispam.current++
        setTimeout(()=>{antispam.current--},3500)
        if(pageLogin){
            loginInfoControl();
        }else{
            handleRegister();
        }
    }

    function handleRegister(){
        if(password.length < 6){
             setErreurMsg("Le mot de passe doit contenir au moins 6 caractères");
             return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(mail)){
            setErreurMsg("Veuillez entrer une adresse e-mail valide");
            return;
        }
        if(!pageLogin && password !== passwordAgain){
            setErreurMsg("Les mots de passe ne correspondent pas");
            return;
        }
        
        async function register(mail,password){
            try{
                const demande = await fetch("http://localhost:1337/api/auth/local/register",{
                method: "POST",
                headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
            username: mail.split("@")[0].replace(/[^a-zA-Z0-9]/g, ""),
            email: mail,
            password: password
            }),
            })
            if(!demande.ok){
            
            switch(demande.status){
                case 400:
                    setErreurMsg("Email déjà utilisé");
                    throw new Error("400 - Email déjà utilisé");
                
                case 403:
                    setErreurMsg("Inscription désactivée");
                    throw new Error("403 - Inscription désactivée");
                    
                case 404:
                    setErreurMsg("Service indisponible pour le moment");
                    throw new Error("404 - Endpoint introuvable");
                    
                case 500:
                    setErreurMsg("Erreur serveur, veuillez réessayer plus tard");
                    throw new Error("500 - Erreur serveur");

                default:
                    setErreurMsg("Erreur inconnue");
                    throw new Error(`${demande.status} - Erreur inconnue`);
            }
            }
            setSuccesMsg("Vous êtes inscrit avec succès !") 
            setMail("")
            setPassword("")
            setPasswordAgain("")
            setPageLogin(!pageLogin)
            }

            catch(err){
            console.error("Erreur détectée :", err.message);
            setMail("")
            setPassword("")
            setPasswordAgain("")
            }
        }
        register(mail,password)


        
        
    } 

    useEffect(()=>{
        const handle = (e)=>enterEvent(e)
        window.addEventListener("keydown",handle)

        return()=>{
            window.removeEventListener("keydown",handle)
        };
    },[pageLogin,mail,password,passwordAgain])
    return(
        pageLogin ? 
        <>
            <div className="login-page-container">
                <h1 className="login-page-h1">Connexion</h1>
                <label className="login-page-rectangle"><input type="email"  placeholder="Mail" required  value={mail} onChange={(e)=>{setMail(e.target.value)}}/></label>
                <label className="login-page-rectangle"><input type={passwordShow? "text":"password"}  placeholder="Mot de passe" value={password}  required minLength={6} onChange={(e)=>{setPassword(e.target.value)}}/></label>
                <div className="login-page-choix">
                    <label htmlFor="remember"><input type="checkbox" name="remember" id="remember"  checked={rememberMe} onChange={()=>{setRememberMe(!rememberMe)}} />Se souvenir de moi</label>
                    <label htmlFor="show" ><input type="checkbox" name="show" id="show"  checked={passwordShow} onChange={()=>{setPasswordShow(!passwordShow)}}  />Afficher le mot de passe</label>
                </div>
                <button className="login-page-login" onClick={loginInfoControl}>Connexion</button>
                <p>Pas de compte ? <span className="login-page-redirect" onClick={()=>{setPageLogin(!pageLogin)}}>S’inscrire</span></p>
            </div>
        </>

        :

        <>
            <div className="login-page-container">
                <h1 className="login-page-h1" >S’inscrire</h1>
                <label className="login-page-rectangle"><input type="email"  placeholder="Mail" required  value={mail} onChange={(e)=>{setMail(e.target.value)}}/></label>
                <label className="login-page-rectangle"><input type={passwordShow? "text":"password"}  placeholder="Mot de passe" value={password}  required minLength={6} onChange={(e)=>{setPassword(e.target.value)}}/></label>
                <label className="login-page-rectangle"><input type={passwordShow? "text":"password"}  placeholder="Confirme le mot de passe" value={passwordAgain} onChange={(e)=>{setPasswordAgain(e.target.value)}}/></label>

                <div className="login-page-choix">
                    <label htmlFor="show" ><input type="checkbox" name="show" id="show"  checked={passwordShow} onChange={()=>{setPasswordShow(!passwordShow)}}  />Afficher le mot de passe</label>
                </div>
                <button className="login-page-login" onClick={()=>{handleRegister()}}>S’inscrire</button>
                <p>Vous avez un compte ?  <span className="login-page-redirect" onClick={()=>{setPageLogin(!pageLogin)}}>Connexion</span></p>
            </div>
        </>
    );
    
}
export default LoginRegisterPage