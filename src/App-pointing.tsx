import { useState } from 'react';

interface SquareProps {
  spot:number;
  valueB: number;
  valueR: number;
  onSquareClick: () => void;
}

function Square({ spot,valueB,valueR, onSquareClick }: SquareProps) {
  let teamColor:string
  let sum_value:number = valueB - valueR;

  if(sum_value>0)teamColor ="square background-Blue";
  else if(sum_value<0)teamColor ="square background-Red";
  else teamColor ="square background-White";
  
  let spotName:String;
  switch(spot){
    case 0: spotName = "A1";break;
    case 1: spotName = "A2";break;
    case 2: spotName = "A3";break;
    case 3: spotName = "B1";break;
    case 4: spotName = "B2";break;
    case 5: spotName = "B3";break;
    case 6: spotName = "C1";break;
    case 7: spotName = "C2";break;
    case 8: spotName = "C3";break;
    default: spotName = "?";break;
  }
  let value_abs = Math.abs(sum_value);

  return (
    <button type="button" className={teamColor} onClick={onSquareClick} >
      {spotName+"\n"+value_abs}
    </button>
  );
}

function Board({
  BlueIsNext,
  squaresB,
  squaresR,
  move,
  onPlay,
}: {
  BlueIsNext: boolean;
  squaresB: (number)[];
  squaresR: (number)[];
  move:(number),
  onPlay: (squaresB: (number)[],squaresR:(number)[]) => void;
}) {
  function handleClick(i: number) {
    if (calculateWinner(squaresB,squaresR,move)) {
      return;
    }
    const nextSquaresB = squaresB.slice();
    const nextSquaresR = squaresR.slice();
    if (BlueIsNext) {
      nextSquaresB[i] += 1;
    } else {
      nextSquaresR[i] += 1;
    }
    onPlay(nextSquaresB,nextSquaresR);
  }

  const winner = calculateWinner(squaresB,squaresR,move);
  let status: string;
  if (winner) {
    status = `Winner: ${winner}`;
  } else {
    status = `Next player: ${BlueIsNext ? 'Blue' : 'Red'}`;
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square spot={0} valueB={squaresB[0]} valueR={squaresR[0]} onSquareClick={() => handleClick(0)} />
        <Square spot={1} valueB={squaresB[1]} valueR={squaresR[1]} onSquareClick={() => handleClick(1)} />
        <Square spot={2} valueB={squaresB[2]} valueR={squaresR[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square spot={3} valueB={squaresB[3]} valueR={squaresR[3]} onSquareClick={() => handleClick(3)} />
        <Square spot={4} valueB={squaresB[4]} valueR={squaresR[4]} onSquareClick={() => handleClick(4)} />
        <Square spot={5} valueB={squaresB[5]} valueR={squaresR[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square spot={6} valueB={squaresB[6]} valueR={squaresR[6]} onSquareClick={() => handleClick(6)} />
        <Square spot={7} valueB={squaresB[7]} valueR={squaresR[7]} onSquareClick={() => handleClick(7)} />
        <Square spot={8} valueB={squaresB[8]} valueR={squaresR[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [historyB, setHistoryB] = useState<(number)[][]>([
    Array(9).fill(null),
  ]);
  const [historyR, setHistoryR] = useState<(number)[][]>([
    Array(9).fill(null),
  ]);
  const [currentMoveB, setCurrentMoveB] = useState(0);
  const [currentMoveR, setCurrentMoveR] = useState(0);
  const currentSquaresB = historyB[currentMoveB];
  const currentSquaresR = historyR[currentMoveR];
  const BlueIsNext = (currentMoveB) % 2 === 0;

  function handlePlay(nextSquaresB: (number)[], nextSquaresR: (number)[]) {
    const nextHistoryB = [...historyB.slice(0, currentMoveB + 1), nextSquaresB];
    const nextHistoryR = [...historyR.slice(0, currentMoveR + 1), nextSquaresR];
    setHistoryB(nextHistoryB);
    setHistoryR(nextHistoryR);
    setCurrentMoveB(nextHistoryB.length - 1);
    setCurrentMoveR(nextHistoryR.length - 1);
  }

  function jumpTo(nextMove: number) {
    setCurrentMoveB(nextMove);
    setCurrentMoveR(nextMove);
  }

  const moves = historyB.map((_squares, move=currentMoveB+currentMoveR) => {
    let description: string;
    if (move > 0) {
      description = `Go to move #${move}`;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button type="button" onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board BlueIsNext={BlueIsNext} squaresB={currentSquaresB} squaresR={currentSquaresR} move={(currentMoveB+currentMoveR)/2} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squaresB: (number)[],squaresR: (number)[],move:(number)) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let Blue_bingo=0;
  let Red_bingo=0;
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squaresB[a]-squaresR[a] > 0 && squaresB[b]-squaresR[b] > 0 && squaresB[c]-squaresR[c] > 0) 
      Blue_bingo++;
    else if(squaresB[a]-squaresR[a] < 0 && squaresB[b]-squaresR[b] < 0 && squaresB[c]-squaresR[c] < 0)
      Red_bingo++;
  }
  if(Blue_bingo>=2) return "Blue";
  else if(Red_bingo>=2) return "Red";

  if(move>=40){
    let sumB = squaresB[0]+squaresB[1]+squaresB[2]+(squaresB[3]+squaresB[4]+squaresB[5])*2+(squaresB[6]+squaresB[7]+squaresB[8])*3;
    let sumR = squaresR[0]+squaresR[1]+squaresR[2]+(squaresR[3]+squaresR[4]+squaresR[5])*2+(squaresR[6]+squaresR[7]+squaresR[8])*3;
    const sum = Math.abs(sumB-sumR);
    if(sumB>sumR)
      return "Blue:"+sum+"points";
    else if(sumB<sumR)
      return "Red:"+sum+"points";
  }
  return null;
}
