import {useState} from "react";

const UtilsActions = () =>  {
    const [diceSize, setDiceSize] = useState<number>(20)
    const [responseText, setResponseText] = useState<string>("")
    const rollDice =  ()=>{
        let number = Math.floor(Math.random()*diceSize+1);
        if(number == diceSize+1){
            number-=1;
        }
        setResponseText("Resultado del dado: "+number);
    }
    return(<>
        <div  style={{marginTop:"24px"}} className={"formNewCommand"}>
        <div><span>{responseText}</span></div>
        <div>
            <button onClick={()=>rollDice()}>Roll Dice</button>
            <input type={"number"} min={0} onChange={(e)=>{ setDiceSize(parseInt(e.target.value))}} value={diceSize}/>
        </div>
        </div>
    </>)

}
export {UtilsActions}
