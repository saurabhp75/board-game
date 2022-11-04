import React, { useEffect, useReducer, useRef } from "react";
import { motion } from "framer-motion";
import getRandomBoard from "../utils/utils.js";
import Cell from './Cell'
import "./board.css";

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
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={resetBoard}
        >
          Reset
        </motion.button>
      </div>
    </>
  );
};

export default Board;
