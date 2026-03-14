
import './Card.css'
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';



function Card({card,setInfoWanted,setCardActiveId,setValidationTextCard,setAskForValidationCard,setCardDelete}){
    
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: card.id,data: {type: "Card"}});


    const style = {
            transform: CSS.Transform.toString(transform),
            transition,
            opacity: isDragging ? 0.5 : 1, 
        };





    return(
        <>  
        

        <li className="card" ref={setNodeRef}     
            style={style}       
            {...attributes}      
            {...listeners}      
        onClick={() => {
            setInfoWanted(true);
            setCardActiveId(card.id);
        }}>
            
            <div className="cardInside">
                <span className="taskNameText">{card.taskName} <span className="cardDeleteButton" onClick={(e)=>{
                    e.stopPropagation();
                    setCardDelete(c => c = card.id)
                    setValidationTextCard(`supprimer la carte "${card.taskName}"`)
                    setAskForValidationCard(true)}
                    }>❌</span></span>
                {card?.date && <span className="textLittle">{card.date}</span>}
                {(card?.statue && card?.statue !== "space" ) && <span className="textLittle">{card.statue}</span>}
            </div>
        </li>
        </>
        
    );
}

export default Card;




