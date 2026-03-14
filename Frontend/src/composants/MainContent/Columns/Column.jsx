import {  useEffect , useState} from "react";
import ValidationBox from '../ValidationBox'
import './Columns.css'
import '../Cards/Card.css'
import {SortableContext, verticalListSortingStrategy,useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Card from '../Cards/Card'
import CardInfo from '../Cards/CardInfo'

function Columns({columnColor,setSuccesMsg,setErreurMsg,title,columnId,setUpdateColumns,updateColumns,cards}){
    
    const {attributes,listeners,setNodeRef,transform,transition, } = useSortable({ id:columnId, data: {type: "Column"}});



    const style = {
            transform: CSS.Transform.toString(transform),
            transition,
        };

    const[askForValidation,setAskForValidation] = useState(false)
    const[columnDelete,setColumnDelete]=useState(null)
    const[triggerColumnDel,setTriggerColumnDel] = useState(false)
    const[validationText,setValidationText] = useState("")
    
    const[isInputVisible,setIsInputVisible]=useState(false)
    const [inputValue,setInputValue] = useState("")
    




    const jwt = !!localStorage.getItem("jwt") ?  localStorage.getItem("jwt"):sessionStorage.getItem("jwt")
    
    const [isClicked,setIsClicked] = useState(false)

    const [infoWanted,setInfoWanted]=useState(false)

    const [cardActiveId,setCardActiveId]=useState(null)


    function isCanBeColumn(e){
        const column = e.target.value
        const characters = [
         "½","£","!", "\"", "#", "$", "%", "&", "'", "(", ")", "*","+", "/",":", ";", "<", "=", ">", "?","@","[", "\\", "]", "^", "`","{", "|", "}", "~"];
        if(characters.some(char => column.includes(char)))return false;
        return true;
    }

    async function cleanGlobaly() {
      
        try{
            await fetch("http://localhost:1337/api/boards/globalCleanup", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${jwt}`, 
                "Content-Type": "application/json"
            }
        });

        }catch(err){
            console.log(err)
        }
    }

    async function createCarte(columnId) {

        
        try {
            
            const demande = await fetch("http://localhost:1337/api/tasks/createUserCarte", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${jwt}`
                },
                body: JSON.stringify({
                    data: {
                        Order: cards.length + 1,   
                        columnId: columnId  
                    }
                })
            });

            if (demande.ok) {
                const result = await demande.json();

                setUpdateColumns(!updateColumns); 
            } else {
                
                setErreurMsg("Erreur lors de la création");
            }
        } catch(err) {
            console.log(err)
            setErreurMsg("Erreur lors de la création");
        }
    }

     useEffect(()=>{
        async function deleteColumnFunc(columnId) {
            
            try{
                const response = await fetch(`http://localhost:1337/api/columns/deleteUserColumn/${columnId}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${jwt}`
                    }
                });

                if (response.ok) {

                    setUpdateColumns(!updateColumns);
                    setSuccesMsg("Colonne supprimée avec succès.");
                    cleanGlobaly()
                    setColumnDelete(null)
                }
                else{
                    setErreurMsg("Suppression échouée. Veuillez rafraîchir la page.");
                }
            }catch(err){
                setErreurMsg("Suppression échouée. Veuillez rafraîchir la page.");
                console.log(err)
            }
        }

            if(columnDelete){
                deleteColumnFunc(columnDelete)
            }



     },[triggerColumnDel])  



    async function changeBoardName(name) {
        try {
            const response = await fetch(`http://localhost:1337/api/columns/changeColumnName/${columnId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${jwt}`
                },
                body: JSON.stringify({
                    data: { newColumnName: name } 
                })
            });

            if (response.ok) {
                setIsInputVisible(false);
                setInputValue("")
                setUpdateColumns(!updateColumns)
            }else{
                setErreurMsg("La modification a échoué. Veuillez rafraîchir la page.");
            }
        } catch (err) {
            setErreurMsg("La modification a échoué. Veuillez rafraîchir la page.");
            console.log(err)
        }
    }

    
    const[askForValidationCard,setAskForValidationCard] = useState(false)
    const[cardDelete,setCardDelete]=useState(null)
    const[triggerCardDel,setTriggerCardDel] = useState(false)
    const[validationTextCard,setValidationTextCard] = useState("")

    async function updateTaskOrder(allCards) {
                
                try {
                    const response = await fetch('http://localhost:1337/api/tasks/orderChange', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${jwt}` 
                        },
                        body: JSON.stringify({ 
                            cards: allCards 
                        })
                    });
    
                    if (!response.ok) {
                        setErreurMsg("Impossible de sauvegarder l'ordre. Veuillez rafraîchir.");
                    }
                        
                    
    
                
                } catch (err) {
                    setErreurMsg("Impossible de sauvegarder l'ordre. Veuillez rafraîchir.");
                    console.log(err)
                }
        }

    useEffect(()=>{
         const allCards = cards.map((card, i) => ({...card,order: i + 1}));
         try{
            updateTaskOrder(allCards)
         }catch(err){
            console.log(err)
         } // on mets rien parce que si jamais il echoue l'utilisateur peut pas savoir et pas besoin de confondre sa tete non plus en tout cas meme s'il marche juste une fois il va regler tout les problémes
     },[updateColumns])



     useEffect(()=>{
        async function deleteUserCard(cardDelete) {
            
            try{
                const response = await fetch(`http://localhost:1337/api/tasks/deleteUserCard/${cardDelete}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${jwt}`
                    }
                });
                
                if (response.ok) {
                    
                    setUpdateColumns(!updateColumns);
                    setSuccesMsg("Carte supprimée avec succès.");
                    cleanGlobaly()
                    setCardDelete(null)
                }
                else{
                    setErreurMsg("Suppression échouée. Veuillez rafraîchir la page.");
                }
            }catch(err){
                setErreurMsg("Suppression échouée. Veuillez rafraîchir la page.");
                console.log(err)
            }
        }

            if(cardDelete){
                deleteUserCard(cardDelete)
            }



     },[triggerCardDel])
    
    return(
        <>      {infoWanted &&  <CardInfo card={cards.find(card => card.id === cardActiveId)}  setInfoWanted={setInfoWanted} setErreurMsg={setErreurMsg} setSuccesMsg={setSuccesMsg}  setUpdateColumns={setUpdateColumns} updateColumns={updateColumns}/> }
                { askForValidation &&  <ValidationBox validationText={validationText}  setAskForValidation={setAskForValidation}  type={"column"} triggerColumnDel={triggerColumnDel} setTriggerColumnDel={setTriggerColumnDel} setColumnDelete={setColumnDelete}/>}
                { askForValidationCard &&  <ValidationBox validationText={validationTextCard}  setAskForValidationCard={setAskForValidationCard}  type={"card"} triggerCardDel={triggerCardDel} setTriggerCardDel={setTriggerCardDel} setCardDelete={setCardDelete}/>}

                <div  className="columnContainer" style={{ ...style, backgroundColor: columnColor }} ref={setNodeRef} 
            {...attributes} 
            {...listeners}>
                    <div className="columnTitle"> 
                        { isClicked && <ul className="columnOptionsContainer">
                                <li>Liste des actions <span className="columnDel"  onClick={(e)=>{setIsClicked(false)
                                    e.stopPropagation()
                                    setInputValue("")
                                    setIsInputVisible(false)
                                }}  >❌</span></li>
                                <li ><span className="optionColumnsText" onClick={()=>{
                                    setColumnDelete(columnId)
                                    setValidationText(`supprimer le column "${title}"`)
                                    setAskForValidation(true)
                                }}>Supprimer</span></li>
                                <li ><span className="optionColumnsText" onClick={()=>setIsInputVisible(true)}>Renommer {isInputVisible && <label htmlFor={columnId}> <input className="changeNameColumn" type="text" id="columnId" htmlFor={columnId} placeholder="Nouveau Nom" value={inputValue} onChange={e=>{
                                    if(isCanBeColumn(e) && e.target.value.length <=30){
                                        setInputValue(e.target.value)
                                    }
                                } }  onKeyDown={e=>{
                                        if(e.key =="Enter"){
                                            if(inputValue.trim()=="")return;
                                            changeBoardName(inputValue);
                                            setIsInputVisible(false)
                                            setIsClicked(false)
                                        }
                                        if(e.key == "Escape"){
                                            setIsInputVisible(false)
                                            setInputValue("");
                                            
                                        }                                    

                                    
                                }} /></label>} </span> </li>
                        </ul>}{title} {!isClicked && <span className="columnOptionsButton" onClick={()=>setIsClicked(true)} >...</span>}</div>
                        
                        <ul className="cardsContainer">
                               
                                <SortableContext items={cards} strategy={verticalListSortingStrategy}>
                                    {cards.length !== 0 ? cards.map((card,i) => {return(<Card  key={i} setInfoWanted={setInfoWanted}   card={card} setCardActiveId={setCardActiveId}  setValidationTextCard={setValidationTextCard} setAskForValidationCard={setAskForValidationCard} setCardDelete={setCardDelete} cardDelete={cardDelete} />)}) : <p>Aucune carte, veuillez en ajouter une.</p> }
                                </SortableContext>
            
                            <li className="carteAdd" onClick={()=>{createCarte(columnId)}}>➕ Ajouter une carte</li>
                        </ul>
                </div>        
        </>
        
    );
}

export default Columns;




