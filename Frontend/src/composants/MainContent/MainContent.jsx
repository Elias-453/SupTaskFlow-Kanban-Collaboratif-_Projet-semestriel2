import { useEffect , useState} from "react";
import './MainContent.css'
import './Columns/Columns.css'
import BoardsBar from './BoardsBare'
import Column from './Columns/Column'

import { DndContext,PointerSensor,useSensor,useSensors,TouchSensor,pointerWithin} from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';

function MainContent({columnColor,background,navHeight,setSuccesMsg,setErreurMsg}){
    
    const[updateBoards,setUpdateBoards]=useState(false)
    const [boards, setBoards] = useState([])
    const jwt = !!localStorage.getItem("jwt") ?  localStorage.getItem("jwt"):sessionStorage.getItem("jwt")
    const[boardActive,setBoardActive] = useState(null)
    const[statusBoards,setStatusBoards]=useState("En Chargement...")

    
    
    const [columns, setColumns] = useState([])
    const [updateColumns,setUpdateColumns]=useState(true)

    const [lenColumns,setLenColums]=useState(columns.length)

    const sensors = useSensors(
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250, 
                tolerance: 5,
            },
        }),
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 } 
        })
    );
  
    useEffect(() => {
            async function getUserBoards(jwt) {
                try{
                    const demande = await fetch(
                    "http://localhost:1337/api/boards/getUserBoards",
                    {   
                        headers: {
                            "Authorization": `Bearer ${jwt}`
                        }
                    }
                );
                const data = await demande.json();

                if(demande.ok){
                     if (data && data.length > 0) {
                        setBoards(data);
                        if(!boardActive){
                            setBoardActive(b => b= data[0].id)
                            console.log(boardActive)
                        }
                        

                  
                    }else{
                        setStatusBoards("Créer Un Tableau")
                    }
                }
                
                else{
                   setErreurMsg("Erreur de chargement. Veuillez rafraîchir la page.");
                   setStatusBoards("Veuillez rafraîchir la page.")
                }

                }catch(err){
                    setErreurMsg("Erreur de chargement. Veuillez rafraîchir la page.");
                    setStatusBoards("Veuillez rafraîchir la page.")
                    console.log(err)
                }

               
            }

           
            getUserBoards(jwt);
            if(boards.length > 1){
                console.log(boards.filter((board) => board.id !== -1));
            }            


        }, [updateBoards]); 

        async function keepOrderSafe(columns){
            const allColumns = columns.map((column,i) => {return({id : column.id,order : i + 1})})
            
            try {
                const response = await fetch(`http://localhost:1337/api/columns/orderChange`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${jwt}`
                    },
                    body: JSON.stringify({
                        columns: allColumns
                    })
                });

                if (response.ok) {

                }else{
                    setErreurMsg("La mise à jour de l'ordre a échoué. Veuillez rafraîchir la page.");
                }
            } catch (err) {
                setErreurMsg("La mise à jour de l'ordre a échoué. Veuillez rafraîchir la page.");
                console.log(err)
            }
        }
        

    useEffect(() => {
        async function getColumnsCards(){
        try {
                const demande = await fetch(`http://localhost:1337/api/columns/getActiveBoardElements/${boardActive}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${jwt}`
                }
                });
                const data = await demande.json();

                if (demande.ok) {
                console.log(data)
                const orderedColums=data.sort((a, b) => a.order - b.order);
                
                orderedColums.map((column,i) => {
                    if(column.cards){
                        const cards = column.cards.sort((a, b) => a.order - b.order);
                        orderedColums[i].cards = cards;
                    }

                })

                setColumns(orderedColums)
                
                if(lenColumns != orderedColums.length){
                    await keepOrderSafe(orderedColums)
                    setLenColums(orderedColums.length)
                }

                } else {
                setErreurMsg("Chargement échoué. Veuillez rafraîchir la page.");
                }

            } catch(err) {
                console.log(err)
                setErreurMsg("Chargement échoué. Veuillez rafraîchir la page.");
            }
        };

        if (boardActive) {
        getColumnsCards();
        }
 
    }, [boardActive,updateColumns]);



    const [numberColumn,setNumberColumn]=useState(0)

    async function createColumn() {
        if(!boardActive){
            setErreurMsg("Veuillez d'abord créer un tableau.");
            return;
        }
        try {
           
            const demande = await fetch("http://localhost:1337/api/columns/createUserColumn", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${jwt}`
                },
                body: JSON.stringify({
                    data: {
                        columnName:`Nouvelle Column ${numberColumn == 0 ? "" : numberColumn}`,
                        boardId: boardActive,
                        order:columns.length + 1
                    }   
                })
            });

            if (demande.ok) {

                setNumberColumn(numberColumn+1)
                setUpdateColumns(!updateColumns)
            } else {
                setErreurMsg("Création échouée. Veuillez rafraîchir la page.");
            }
        } catch(err) {     

            setErreurMsg("Création échouée. Veuillez rafraîchir la page.");
            console.log(err)

        }
    }


    function dragHandle(e){
        const { active, over } = e;
        if (!over || active.id === over.id) return;
   
        
        if (!over) return;

        const activeType = active.data.current?.type;
        const overType = over.data.current?.type;

       
        if (activeType === "Column" && overType === "Column") {
            if (active.id !== over.id) {
                orderExchange(e); 
            }
            return;
        }

       
        if (activeType === "Card" && overType === "Card") {
           orderExchangeCards(e)
            return;
        }

    
        if (activeType === "Column" && overType === "Card") {
            return; 
        }
    
    }
    
    async function updateTaskOrder(allCards) {
                
                try {
                    const demande = await fetch('http://localhost:1337/api/tasks/orderChange', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${jwt}` 
                        },
                        body: JSON.stringify({ 
                            cards: allCards 
                        })
                    });
    
                    if (!demande.ok) {
                        setErreurMsg("Impossible de sauvegarder l'ordre. Veuillez rafraîchir.");
                    }
                    else{
                        return true
                    }
                        
                    
    
                
                } catch (err) {
                    setErreurMsg("Impossible de sauvegarder l'ordre. Veuillez rafraîchir.");
                    console.log(err)
                }
        }

    function orderExchange(e) {
        const { active, over } = e;
        if (!over || active.id === over.id) return;

        setColumns((items) => {
          
            const activeIndex = items.findIndex(item => item.id === active.id);
            const overIndex = items.findIndex(item => item.id === over.id);
            
            
            const columnsNew = arrayMove(items, activeIndex, overIndex);
            
            const ordersChanged = columnsNew.map((col, index) => ({
                ...col,
                order: index + 1 
            }));

            keepOrderSafe(ordersChanged); 
            
            return ordersChanged; 
        });
    }

async function orderExchangeCards(e) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;

 
    const activeColumn = columns.find(col => 
        col.cards?.some(card => card.id === active.id)
    );

    if (!activeColumn) return;


    const cards = [...activeColumn.cards];
    const activeIdx = cards.findIndex(card => card.id ===active.id);
    const overIdx = cards.findIndex(card => card.id === over.id);

 
    if (activeIdx !== -1 && overIdx !== -1) {
      
        const cardsNew = arrayMove(cards, activeIdx, overIdx);
        const orderedCards = cardsNew.map((card, i) => ({ ...card, order: i + 1 }));

    
        

     
        const columnsNew = columns.map(col => {
            if (col.id === activeColumn.id) {
                return { ...col, cards: orderedCards };
            }
            return col;
        });


        const resultat = await updateTaskOrder(orderedCards);
        if(resultat){
            setColumns(columnsNew);
        }

    }
}
    return(
        <>
        
        <div className="bodyFake"   style={{ backgroundImage: `url(${background})`}}> </div>

        <div className="orderchange" style={["purple","maroon","black","blue","cadetblue"].includes(columnColor) ? {color:"white"}:{color:"black"}}>
            <BoardsBar navHeight={navHeight} boards={boards} setBoards={setBoards} setBoardActive={setBoardActive} boardActive={boardActive} setUpdateBoards={setUpdateBoards} updateBoards={updateBoards} setSuccesMsg={setSuccesMsg} setErreurMsg={setErreurMsg}  statusBoards={statusBoards}/>
            <DndContext collisionDetection={pointerWithin} onDragEnd={dragHandle} sensors={sensors}>
                <ul className="ulColumns" style={{marginTop:`${navHeight + 50}px`}}>
                    
                    {columns.length == 0 && <p className="placeholderColumn">Aucune colonne créée. Cliquez sur le bouton "+" pour commencer.</p>}
                    <SortableContext items={columns} strategy={horizontalListSortingStrategy}>
                        {columns.map((column,i) => { return(<li key={column.id}><Column columnColor={columnColor}  setSuccesMsg={setSuccesMsg} setErreurMsg={setErreurMsg} title={columns[i].columnName} columnId={column.id} setUpdateColumns={setUpdateColumns} updateColumns={updateColumns} cards={column.cards} /></li>)})}
                    </SortableContext>
                    <li className="ColumnAdd" style={{backgroundColor:columnColor}} onClick={createColumn}>➕</li>
                </ul>
            </DndContext>    
        </div>
        </>
        
    );
}

export default MainContent;