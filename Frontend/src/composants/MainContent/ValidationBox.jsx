
import './ValidationBox.css'
function ValidationBox({validationText,setTriggerBoardDel,triggerBoardDel,setAskForValidation,setBoardDelete,type,triggerColumnDel,setTriggerColumnDel,setColumnDelete,setAskForValidationCard,triggerCardDel,setTriggerCardDel,setCardDelete}){
    
    function response(answer,type){
        if(answer){
            
            if(type == "card"){
                 setAskForValidationCard(false)
            }else{
                 setAskForValidation(false)
            }
            
            if(type == "board"){
                setTriggerBoardDel(!triggerBoardDel)
            }
            else if(type =="card"){
                setTriggerCardDel(!triggerCardDel)
            }
            else{
                setTriggerColumnDel(!triggerColumnDel)
            }
        }
        else{

            if(type == "card"){
                 setAskForValidationCard(false)
            }else{
                 setAskForValidation(false)
            }
           
            if(type == "board"){
                setBoardDelete(null)
            }
            else if(type =="card"){
                setCardDelete(null)
            }
            else{
                setColumnDelete(null)
            }
        }

        }

    return(<>
            <div className="validationContainer">

            <p>Etes vous sur que vous voulez {validationText} ?</p>

            <div className="validationButtonContainer">
                <button onClick={()=>response(false,type)}>Annuler</button>
                <button onClick={()=>response(true,type)}>Confirmer</button>
            </div>
    </div>
    
    
    </>);
}

export default ValidationBox;