import  {useEffect, useRef, useState } from "react";
import './BoardsBare.css'
import ValidationBox from "./ValidationBox";
function BoardsBare({navHeight , boards , setBoards,setBoardActive,boardActive,setUpdateBoards,updateBoards,setSuccesMsg,setErreurMsg,statusBoards}){
    
    const jwt = !!localStorage.getItem("jwt") ?  localStorage.getItem("jwt"):sessionStorage.getItem("jwt")
    
    
    const boardsNavRef = useRef(null);



    const liExampleRef = useRef(null)

    const [isClicked,setIsClicked] = useState(false)
    const [elemantLI,setElemantLI]=useState(0);

    

     //boardDelete et edit

     const[askForValidation,setAskForValidation] = useState(false)
     const[boardDelete,setBoardDelete]=useState(null)
     const[triggerBoardDel,setTriggerBoardDel] = useState(false)
     const[validationText,setValidationText] = useState("")

     const[gonnaChange,setGonnaChange]=useState(null)
     const refsInput = useRef([])
     refsInput.current = []; 
    
    const [inputValues, setInputValues] = useState([])
    const [numberBoard,setNumberBoard]=useState(0)

    async function createTable(jwt) {
        try{
            const demande = await fetch("http://localhost:1337/api/boards/createUserBoard",{
                method:'POST',
                headers:{
                    "Authorization": `Bearer ${jwt}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    data: { boardName: `Nouveau Tableau ${numberBoard == 0 ? "" : numberBoard}`}
                })
            });
            
            if (demande.ok){
                setBoards([...boards, {boardName: `Nouveau Tableau ${numberBoard == 0 ? "" : numberBoard}`}])
                setNumberBoard(numberBoard+1)
                setUpdateBoards(!updateBoards)
                }
            else{
                setErreurMsg("Impossible de créer le tableau. Réessayez.");
            }
        }
        catch(err){
                setErreurMsg("Impossible de créer le tableau. Réessayez.");
        }
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

     useEffect(()=>{
            async function deleteBoard(id){
                try {
                    const response = await fetch(`http://localhost:1337/api/boards/deleteUserBoard/${boardDelete}`, {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${jwt}`,
                            "Content-Type": "application/json"
                        }
                    });

                    if (response.ok) {
                        const copyBoards = [...boards];
                        const boardIndex = copyBoards.findIndex(board => board.id === boardDelete)
                        const newBoards = copyBoards.filter((board,index) => index !== boardIndex)
                        setBoards(newBoards)
                        setSuccesMsg("Tableau supprimé avec succès.")
                        cleanGlobaly()
                    } else {
                        setErreurMsg("Échec de la suppression. Veuillez réessayer.");
                    }
                }
                catch (err){
                   setErreurMsg("Échec de la suppression. Veuillez réessayer.");
                }
                finally{setBoardDelete(null)}
            }

            if(boardDelete){
                deleteBoard(boardDelete)
            }



     },[triggerBoardDel])


       function getLiHeight(){
            if(liExampleRef.current){
                const liHeight = liExampleRef.current.offsetHeight;
                setElemantLI(liHeight);
                
            }
    }
    
     useEffect(()=>{
        setInputValues(boards.map(board => board = ""))
        getLiHeight()
     },[boards])

    function isCanBeBoard(e){
        const board = e.target.value
        const characters = [
         "½","£","!", "\"", "#", "$", "%", "&", "'", "(", ")", "*","+", "/",":", ";", "<", "=", ">", "?","@","[", "\\", "]", "^", "`","{", "|", "}", "~"];
        if(characters.some(char => board.includes(char)))return false;
        return true;
    }
  
    async function changeBoardName(i,id,newName) {
        try {
            const response = await fetch(`http://localhost:1337/api/boards/changeBoardName/${id}`, {
                method: 'PUT', 
                headers: {
                    "Authorization": `Bearer ${jwt}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    data: { 
                        newBoardName: newName 
                    }
                })
            });
            if (response.ok) {
                const updatedData = await response.json();
                const copyBoards = [...boards];
                copyBoards[i] = {...copyBoards[i], boardName: inputValues[i]}
                setBoards(copyBoards)
                setInputValues()
                setGonnaChange(null);
                const copyInputs = [...inputValues];
                copyInputs[i] = "";
                setInputValues(copyInputs);
                
            } else {
                setErreurMsg("Impossible de modifier le nom du tableau. Veuillez réessayer plus tard.");
            }
        } catch (err) {
                 setErreurMsg("Impossible de modifier le nom du tableau. Veuillez réessayer plus tard.");
        }
    }

    useEffect(()=>{
        
        getLiHeight()
        window.addEventListener("resize",getLiHeight);

        return()=>{
            window.removeEventListener("resize",getLiHeight);
        };
    },[])
    
    useEffect(()=>
        {   
            boardsNavRef.current.style.marginTop=`${navHeight}px`; 
        },[navHeight])
    
    

    return(
        <>
        
        { askForValidation &&  <ValidationBox validationText={validationText} setTriggerBoardDel={setTriggerBoardDel} triggerBoardDel={triggerBoardDel} setAskForValidation={setAskForValidation} setBoardDelete={setBoardDelete} type={"board"}/>}
        <div className="boards" ref={boardsNavRef}>
            <div className="boardsNavContainer">
                <span className="boardSelected"  onClick={()=>{setIsClicked(!isClicked) 
                    setGonnaChange(null)}}>{boards.filter(board => board.id == boardActive)[0]?.boardName || statusBoards}</span>
                
                <ul style={isClicked ? {visibility:'visible'}: {visibility:'hidden'}}>
                    {boards.map((e,i) =>{
                        if(e.id !== boards?.[0].id || null ){
                            return <li key={i}  ref={i == 1 ? liExampleRef : null}
                            style={isClicked ?{
                                transform: `translateY(${((i)*(elemantLI ||20))}px)`,
                                transition:`${i*0.1}s`,
                                
                            }: {transition:`${i*0.1}s`} }>
                                
                                <span   onClick={()=>{
                                    
                                    const copyBoard = [...boards];
                                    const other = boardActive;
                                    const index = copyBoard.findIndex(board => board.id === other);
                                    const indexClicked = copyBoard.findIndex(board => board.id == e.id);
                                    const clicked = copyBoard[index];
                                    copyBoard[index] = e;
                                    copyBoard[indexClicked] = clicked;

                                    setBoards(boards => boards = copyBoard)
                                    
                                    setBoardActive(e.id);
                                
                                    
                                    setIsClicked(!isClicked);
                                    
                                    
                                     }}>  <p className="listText">{e.boardName}</p>   </span>
                                <p className="deleteSymbol"  onClick={()=>{
                                    setBoardDelete(e.id)
                                    setValidationText(`supprimer le bureau "${e.boardName}"`)
                                    setAskForValidation(true)
                                }} >❌</p> 
                                <p className="changeSymbol"   onClick={()=>{setGonnaChange(e.id)}}>🖆<span className="BoardNameChange" > {gonnaChange === e.id && <label htmlFor={`label${i}`}><input type="text" name={`label${i}`} id={`label${i}`}   value={inputValues[i]} onChange={(e) =>{
                                    if( !isCanBeBoard(e) || e.target.value.length >= 25)return;
                                    const copyInputs = [...inputValues]
                                    copyInputs[i]=e.target.value;
                                    setInputValues(copyInputs)
                                }}  onKeyDown={(event) => {
                                    if(event.key =="Enter"){
                                        if(inputValues[i].trim()=="")return;
                                        changeBoardName(i,e.id,inputValues[i]);

                                    }
                                    if(event.key == "Escape"){
                                        setGonnaChange(null);
                                        const copyInputs = [...inputValues];
                                        copyInputs[i] = "";
                                        setInputValues(copyInputs);
                                    }
                                }
                            }    placeholder="Nouveau nom" ref={element => refsInput.current[i] = element}/></label>} </span> </p></li>  
                        }   
                        
                    } )}

                    {boards.length  < 10 && <li key={"add"} className="addButton" style={isClicked ? {
                                    transform: `translateY(${((boards.length)*(elemantLI ||20))}px)`,
                                    transition:`${(boards.length )*0.1}s`
                                    }: {transition:`${(boards.length)*0.1}s`}}
                                    onClick={() =>{
                                        createTable(jwt)
                                        setUpdateBoards(!updateBoards)
                                    }} >➕</li>}
                </ul>
            </div>  
                
         
         
           
 
        </div>

        </>
        
    );
}

export default BoardsBare;