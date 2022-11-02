import React, { useEffect, useReducer, useRef } from "react";
import "./board.css";
import getRandomBoard from "../utils/utils.js";

// const BoardContext = React.createContext()
// BoardContext.displayName = 'BoardContext'

function cellReducer(state, action) {
  switch (action.type) {
    case "hide":
      return {
        ...state,
        found: false,
      };
      break;
    case "found":
      return {
        ...state,
        found: true,
      };
      break;
    // case "wrong":
    //   return {
    //     ...state,
    //     found: true,
    //   };
    //   break;
    default:
      throw new Error("Unknown action type in cellReducer");
  }
}

const Cell = ({ num, boardState, boardDispatch }) => {
  const [cellState, cellDispatch] = useReducer(cellReducer, {
    found: true, // wrong click
  });

  const cellRef = useRef()

  useEffect(() => {
    // console.log(`useEffect:Cell num: ${num}`)
    cellDispatch({ type: "found" });
    const timerId = setTimeout(() => {
      cellDispatch({ type: "hide" });
    }, 1000);

    return () => clearTimeout(timerId);
  }, [num]);

  // function showText(state) {
  //   switch(state) {
  //     case "found"

  //   }
  // }

  const handleClick = (num, boardState) => {
    if (num === boardState.searchNum) {
      // console.log("handleClick: in if");
      cellDispatch({ type: "found" });
      boardDispatch({ type: "correctClick" });
    } else {
      // boardDispatch({ type: "wrong" });
    }
    // console.log(`handleClick: num: ${num}, searchNum: ${boardState.searchNum}`);
    return;
  };

  return (
    <td value = {cellRef} onClick={() => handleClick(num, boardState)}>
      {cellState.found ? num : "?"}
    </td>
  );
};

function boardReducer(state, action) {
  switch (action.type) {
    case "reset":
      return {
        board: getRandomBoard(),
        searchNum: 1,
        won: false,
      };
      break;
    case "correctClick":
      return {
        ...state,
        searchNum: state.searchNum + 1,
        won: state.searchNum >= 9 ? true : false,
      };
      break;
    case "incorrectClick":
      return {
        ...state,
      };
      break;
    case "won":
      return {
        ...state,
        searchNum: 0,
      };
    default:
      throw new Error("Unknown action type in board reducer");
  }
}

const Board = () => {
  const [boardState, boardDispatch] = useReducer(boardReducer, {
    board: getRandomBoard(),
    searchNum: 1,
    won: false,
  });

  function resetBoard() {
    boardDispatch({ type: "reset" });
  }

  console.log(boardState.board);

  // const handleClick = (num) => {
  //   // setSearchNum(() => searchNum + 1);
  //   // if(searchNum >= 9) {
  //   //   setWon(true)
  //   // }
  //   console.log("handleClick: In Board");
  //   // console.log(num);
  //   boardDispatch({ type: "click" });
  // };

  return (
    <div className="container">
      <span className="game-heading">Photo memory</span>
      <table>
        <tbody>
          <tr>
            <Cell
              num={boardState.board[0]}
              boardState={boardState}
              boardDispatch={boardDispatch}
            />
            <Cell
              num={boardState.board[1]}
              boardState={boardState}
              boardDispatch={boardDispatch}
            />
            <Cell
              num={boardState.board[2]}
              boardState={boardState}
              boardDispatch={boardDispatch}
            />
          </tr>
          <tr>
            <Cell
              num={boardState.board[3]}
              boardState={boardState}
              boardDispatch={boardDispatch}
            />
            <Cell
              num={boardState.board[4]}
              boardState={boardState}
              boardDispatch={boardDispatch}
            />
            <Cell
              num={boardState.board[5]}
              boardState={boardState}
              boardDispatch={boardDispatch}
            />
          </tr>
          <tr>
            <Cell
              num={boardState.board[6]}
              boardState={boardState}
              boardDispatch={boardDispatch}
            />
            <Cell
              num={boardState.board[7]}
              boardState={boardState}
              boardDispatch={boardDispatch}
            />
            <Cell
              num={boardState.board[8]}
              boardState={boardState}
              boardDispatch={boardDispatch}
            />
          </tr>
        </tbody>
      </table>
      <button onClick={resetBoard}>Reset</button>
      <div className="game-heading">
        {boardState.won ? "You win!" : `Search for ${boardState.searchNum}`}
      </div>
    </div>
  );
};

export default Board;
