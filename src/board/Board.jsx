import React, { useEffect, useReducer, useRef } from "react";
import { motion } from "framer-motion";
import "./board.css";
import getRandomBoard from "../utils/utils.js";

// const BoardContext = React.createContext()
// BoardContext.displayName = 'BoardContext'

function cellReducer(state, action) {
  switch (action.type) {
    case "hide":
      return {
        ...state,
        state: "hide",
      };
    case "found":
      return {
        ...state,
        state: "found",
      };
    case "cross":
      return {
        ...state,
        state: "cross",
      };
    default:
      throw new Error("Unknown action type in cellReducer");
  }
}

const Cell = ({ num, boardState, boardDispatch }) => {
  const [cellState, cellDispatch] = useReducer(cellReducer, {
    state: "hide", // hide|found
  });

  const timerId = useRef(null);

  useEffect(() => {
    // console.log(`useEffect:Cell num: ${num}`)
    cellDispatch({ type: "found" });
    const timerId = setTimeout(() => {
      cellDispatch({ type: "hide" });
    }, 1000);

    return () => clearTimeout(timerId);
  }, [num]);

  useEffect(() => {
    // console.log(`useEffect:Cell num: ${num}`)
    if (boardState.state === "reset") {
      cellDispatch({ type: "found" });
      const timerId = setTimeout(() => {
        cellDispatch({ type: "hide" });
      }, 1000);
    }

    return () => clearTimeout(timerId);
  }, [boardState]);

  function showText(state, num) {
    switch (state) {
      case "hide":
        return "?";
      case "found":
        return num;
      case "cross":
        return "X";
      default:
        throw new Error("Unknown action type in showText");
    }
  }

  const handleClick = (num, cellState, boardState) => {
    if (num === boardState.searchNum) {
      cellDispatch({ type: "found" });
      boardDispatch({ type: "correctClick" });
    } else {
      // Do nothing if cell is already found
      if (cellState.state === "found") {
        return;
      }
      cellDispatch({ type: "cross" });
      timerId.current = setTimeout(() => {
        cellDispatch({ type: "hide" });
      }, 500);
    }
    // console.log(`handleClick: num: ${num}, searchNum: ${boardState.searchNum}`);
    return () => {
      if (timerId.current) {
        clearTimeout(timerId.current);
      }
    };
  };

  return (
    <motion.div
      whileHover={{ scale: 1.1}}
      whileTap={{ scale: 0.9 }}
      onClick={() => handleClick(num, cellState, boardState)}
    >
      {showText(cellState.state, num)}
    </motion.div>
  );
};

function boardReducer(state, action) {
  switch (action.type) {
    case "reset":
      return {
        board: getRandomBoard(),
        searchNum: 1,
        state: "reset",
        won: false,
      };
    case "correctClick":
      return {
        ...state,
        searchNum: state.searchNum + 1,
        state: state.searchNum >= 9 ? "won" : "init",
        won: state.searchNum >= 9 ? true : false,
      };
    case "incorrectClick":
      return {
        ...state,
      };
    case "won":
      return {
        ...state,
        searchNum: 0,
        state: "init",
      };
    default:
      throw new Error("Unknown action type in board reducer");
  }
}

const Board = () => {
  const [boardState, boardDispatch] = useReducer(boardReducer, {
    board: getRandomBoard(),
    searchNum: 1,
    state: "init", // "init", "reset", "won"
    won: false,
  });

  function resetBoard() {
    boardDispatch({ type: "reset" });
  }

  console.log(boardState.board);

  return (
    <>
      <div className="container">
        <div className="game-heading">Photo memory</div>
        <div className="game-heading">
          {boardState.won ? "You win!" : `Search for ${boardState.searchNum}`}
        </div>
        <div className="parent">
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
        </div>
        <motion.button whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }} onClick={resetBoard}>Reset</motion.button>
      </div>
    </>
  );
};

export default Board;
