const Die = ({ value, isHeld, holdDice }) => {
  const style={
    backgroundColor:isHeld?"#59E391":"white"
  }
  return (
    <div className=" shadow-lg   flex justify-center bg-white items-center w-[50px] h-[50px] p-6 rounded-lg  " style={style} onClick={holdDice}>
      <h1 className="text-[1.5rem] font-bold"> {value}</h1>
    </div>
  );
};

export default Die;
