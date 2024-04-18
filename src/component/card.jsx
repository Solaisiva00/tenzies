import { useEffect, useState } from "react";
import Die from "./die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
const Card = () => {
  const [bestScore,setBestScore]=useState(null)
  const [score, setScore] = useState([]);
  const [die, setDie] = useState(allNewDice());
  const [tezies, setTenzies] = useState(false);
  const [move, setMove] = useState(0);
  useEffect(() =>{
    if(score.length>0) 
    {
      let min=score[0]
      for( let i=0;i<score.length;i++){
         if(min>score[i]){
          min=score[i]
         }
         setBestScore(min)
      }
  }else{
    setBestScore(0)
  }
}, [score]);
  useEffect(()=>{
    const storedScore = localStorage.getItem("score");
    if (storedScore) {
      setScore(JSON.parse(storedScore));
    }
  },[])
  useEffect(() => {
    if (tezies) {
      localStorage.setItem("score", JSON.stringify(score));
    }
  }, [tezies, score]);
  useEffect(() => {
    if (move === 0) {
      return;
    } else {
      setScore((preScore) => [...preScore, move]);
      console.log("changed", move);
      console.log(score);
    }
  }, [tezies]);
  useEffect(() => {
    const allHeld = die.every((isDie) => isDie.isHeld);
    const firstValue = die[0].value;
    const allSameValue = die.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
    }
  }, [die]);

  function allNewDice() {
    const randomArray = [];
    for (let i = 0; i < 10; i++) {
      randomArray.push({
        value: Math.floor(Math.random() * (6 - 1) + 1),
        isHeld: false,
        id: nanoid(),
      });
    }
    return randomArray;
  }
  function holdDice(id) {
    setDie((prevDie) =>
      prevDie.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }
  function rollDie() {
    if (!tezies) {
      setMove((prevMove) => prevMove + 1);
      setDie((oldDie) => {
        return oldDie.map((die) => {
          return die.isHeld
            ? die
            : {
                value: Math.floor(Math.random() * (6 - 1) + 1),
                isHeld: false,
                id: nanoid(),
              };
        });
      });
    } else {
      setTenzies(false);
      setDie(allNewDice());
      setMove(0);
    }
  }
  const dieCard = die.map((val) => (
    <Die
      value={val.value}
      key={val.id}
      isHeld={val.isHeld}
      holdDice={() => holdDice(val.id)}
    />
  ));

  return (
    <div className="bg-[#F5F5F5] p-5 h-screen text- rounded-md select-none relative flex flex-col  justify-center items-center">
      <p className="font-mono font-bold bg-emerald-800 p-2 text-sm rounded-md absolute top-2 right-2 text-white ">🏆best score :{bestScore}</p>
      <h1 className="font-bold text-[30px] mt-4 mb-1">Tenzies</h1>
      <p className="text-[#4A4E74] text-wrap mb-5 text-center font-medium w-[70vw] text-[13px]">
        Roll until all dice are the same. Click <br /> each die to freeze it at
        its current value <br />
        between rolls.
      </p>
      {tezies && (
        <p className="text-sm font-mono animate-bounce font-bold my-2">
          YOU WON THIS WITH {move} MOVES
        </p>
      )}
      {!tezies && <p className="mb-4 text-sm font-mono">move:{move}</p>}
      <main className="grid grid-cols-5 gap-7">{dieCard}</main>
      <button
        className="w-[150px] h-[50px] p-2 my-10   text-white font-bold rounded-md bg-[#5035FF]"
        onClick={rollDie}
      >
        {tezies ? "NEW GAME" : "ROLL"}
      </button>
      {tezies && <Confetti />}
    </div>
  );
};

export default Card;
