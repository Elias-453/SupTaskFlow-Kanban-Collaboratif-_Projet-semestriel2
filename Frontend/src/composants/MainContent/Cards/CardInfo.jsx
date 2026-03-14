import {  useState} from "react";

import './CardInfo.css'



function CardInfo({card,setInfoWanted,setErreurMsg,setSuccesMsg,setUpdateColumns,updateColumns}){
    const jwt = !!localStorage.getItem("jwt") ?  localStorage.getItem("jwt"):sessionStorage.getItem("jwt")
    if(card==null)return;
    
    const [cartName,setCartName]=useState("")
    const [isModifyName,setIsModifyName]=useState(false)
    
    function isCanBeCarte(e){
        const column = e.target.value
        const characters = [
         "½","£","!", "\"", "#", "$", "%", "&", "'", "(", ")", "*","+", "/",":", ";", "<", "=", ">", "?","@","[", "\\", "]", "^", "`","{", "|", "}", "~"];
        if(characters.some(char => column.includes(char)))return false;
        return true;
    }
    
    const [description,setDescription]=useState("")
    const [isModifyDescription,setIsModifyDescription]=useState(false)

    const [date,setDate]=useState("")
    const [isModifyDate,setIsModifyDate]=useState(false)

    const [statue,setStatue]=useState("")
    const [isModifyStatue,setIsModifyStatue]=useState(false)


    async function saveChanges() {
        let changeName=false
        let changeDate=false
        let changeDescription=false
        let changeStatue=false

        let DateValue = ""
        if(cartName.trim() !== "" && cartName !== card.taskName){
            changeName = true
        }
            
        
        
        if(date.trim() !== "" && date !== card?.date){
            changeDate = true
            DateValue=date
        }
        if(date == "Aucune date précise"){
            DateValue=null
        }
        
        if(description.trim() !== "" && description !== card?.description){
            changeDescription = true
        }

        if(statue.trim() !== "" && statue !== card?.statue){
            changeStatue = true
        }
        let infos = {}

        if(changeName){
            infos = {...infos,taskName:cartName}
        }

        if(changeDate){
            infos = {...infos,date:DateValue}
        }
        if(changeDescription){
             infos = {...infos,description:description}
        }
        if(changeStatue){
             infos = {...infos,statue:statue}
        }
        
        try{
            const demande = await fetch(`http://localhost:1337/api/tasks/changeCard/${card.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwt}`
            },
            body: JSON.stringify({changes:infos}),
            
        });
        if (!demande.ok) {
            setErreurMsg( "Erreur lors de la mise à jour")
            return;
        }
        setSuccesMsg("Les Modifications sont appliquées")
        setInfoWanted(false)
        setCartName("")
        setDescription("")
        setDate("")
        setStatue("")
        setUpdateColumns(!updateColumns)
        }
        catch(err){
            console.log(err)
            setErreurMsg( "Erreur lors de la mise à jour")
            
        }
    }        

    

    return(
        <>  
           <div className="cardInfoContainer">
                    <span className="closeButton" onClick={()=>{setInfoWanted(false)}}>❌</span>
                    
                    <div className="cardsContainerBig">
                        <span className="title">Titre</span>
                        <span className="cardsContainerLittle">
                            <p className="widthLimiter">{cartName || card.taskName}</p>
                            <button className="modifyButton"  onClick={()=>{setIsModifyName(!isModifyName)}}>Modifier</button>
                        </span> {isModifyName &&  <label htmlFor="cartNameChanger" > <input className="inputCardChanger" type="text"  value={cartName} 
                                onChange={e=>{
                                                if(isCanBeCarte(e) && e.target.value.length <=50){
                                                    setCartName(e.target.value)
                                                }
                                            }}
                                onKeyDown={e=>{
                                                    if(e.key =="Enter"){
                                                        if(cartName.trim()=="")return;
                                                        setIsModifyName(false)
                                                       
                                                    }
                                                    if(e.key == "Escape"){
                                                        setIsModifyName(false)
                                                        setCartName("");
                                                        
                                                    }                                    

                                                
                                            }} /> </label>}  
                    </div>

                    <div className="cardsContainerBig">
                        <span className="title">Date</span>
                        <span className="cardsContainerLittle">
                            <p >{date || card.date ? (date || card.date) : "Aucune date précise"}</p>
                            <button className="modifyButton"  onClick={()=>{setIsModifyDate(!isModifyDate)}}>Modifier</button>
                            <span onClick={()=>{setDate("Aucune date précise")}}>🗑️</span>
                        </span> {isModifyDate &&  <label htmlFor="inputDateChanger" > <input className="inputDateChanger" type="date"  value={date} 
                                onChange={e=>{
                                                if( e.target.value.length <=200){
                                                    setDate(e.target.value)
                                                }
                                            }}
                                onKeyDown={e=>{
                                                    if(e.key === "Enter"){
                                                        if(date.trim()=="")return;
                                                        setIsModifyDate(false)
                                                        
                                                    }
                                                    if(e.key == "Escape"){
                                                        setIsModifyDate(false)
                                                        setDate("");
                                                        
                                                    }                                    

                                                
                                            }} /> </label>}  
                    </div>


                    <div className="cardsContainerBig">
                        <span className="title">Description</span>
                        <span className="cardsContainerLittle">
                            <p className="widthLimiter">{description || card.description ? (description || card.description) : "Aucune description"}</p>
                            <button className="modifyButton"  onClick={()=>{setIsModifyDescription(!isModifyDescription)}}>Modifier</button>
                        </span> {isModifyDescription &&  <label htmlFor="inputDescriptionChanger" > <textarea className="inputDescriptionChanger" type="text"  value={description} 
                                onChange={e=>{
                                                if( e.target.value.length <=200){
                                                    setDescription(e.target.value)
                                                }
                                            }}
                                onKeyDown={e=>{
                                                    if(e.key === "Enter" && !e.shiftKey){
                                                        if(description.trim()=="")return;
                                                        setIsModifyDescription(false)
                                                       
                                                    }
                                                    if(e.key == "Escape"){
                                                        setIsModifyDescription(false)
                                                        setDescription("");
                                                        
                                                    }                                    

                                                
                                            }} /> </label>}  
                    </div>


                    <div className="cardsContainerBig">
                        <span className="title">Statut</span>
                        <span className="cardsContainerLittle">
                            <p className="cardDescription">{((statue && statue !== "space" )|| (card.statue &&  card.statue !=="space") ) ? (statue || card.statue) : "Sans étiquette"}</p>
                            <button className="modifyButton"  onClick={()=>{setIsModifyStatue(!isModifyStatue)}}>Modifier</button>
                        </span> {isModifyStatue &&  <label htmlFor="statusChanger"> <select className="statusChanger" name="statusChanger" id="statusChanger" value={statue} onChange={(e)=> setStatue(e.target.value)}>
                                                                                    <option  value="space" >Sans étiquette</option>
                                                                                    <option value="À faire">À faire </option>
                                                                                    <option value="En cours">En cours </option>
                                                                                    <option value="Terminé">Terminé </option>
                                                                        </select> </label>}  
                    </div>

                    <div className="CartInfobuttonContainer">
                        <button onClick={()=>{
                            saveChanges()
                            
                        }}>Appliquer</button>
                        <button onClick={()=>{
                            setInfoWanted(false)
                               setCartName("")
                               setDescription("")
                               setDate("")
                               setStatue("")

                        }}>Annuler</button>
                        
                    </div>
           </div>

        </>
        
    );
}

export default CardInfo;




