import React, { useState, useReducer } from "react";
import getRandomBoard from "../utils/utils.js";
import Cell from "./Cell";
import Duration from "./Duration";
import SocialShare from "./SocialShare.jsx";

function boardReducer(state, action) {
  switch (action.type) {
    case "reset":
      return {
        board: getRandomBoard(),
        searchNum: 1,
        state: "reset",
        won: false,
        duration: state.duration,
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
    case "changeDuration":
      return {
        ...state,
        state: "changeDuration",
        duration: action.payload,
      };
    default:
      throw new Error("Unknown action type in board reducer");
  }
}

function CustomButton({ resetBoard }) {
  // Used for button animation
  const [effect, setEffect] = useState(false);

  function handleClick() {
    setEffect(true);
    resetBoard();
  }

  return (
    <button
      onClick={handleClick}
      className={`${
        effect && "animate-wiggle"
      } m-2 rounded-md bg-green-600 p-4 text-3xl font-bold hover:scale-90 hover:bg-green-400`}
      onAnimationEnd={() => setEffect(false)}
    >
      Start
    </button>
  );
}

const Board = () => {
  const [boardState, boardDispatch] = useReducer(boardReducer, {
    board: getRandomBoard(),
    searchNum: 1,
    state: "init", // init|reset|won|changeDuration
    won: false,
    duration: 1000, // 1000ms
  });

  function resetBoard() {
    boardDispatch({ type: "reset" });
  }

  console.log(boardState.state);

  return (
    <>
      <div className="font-san mx-3 my-3 flex flex-col items-center">
        {/* <div className="m-2 text-3xl font-bold text-emerald-500">
          Photo memory
        </div> */}
        <div className="m-2 text-3xl font-bold text-emerald-500">
          {boardState.won ? "You win!" : `Search for ${boardState.searchNum}`}
        </div>
        <div className="m-2 grid grid-cols-cell grid-rows-cell gap-2">
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
        <Duration boardState={boardState} boardDispatch={boardDispatch} />
        <CustomButton resetBoard={resetBoard} />
        {/* <SocialShare /> */}
      </div>
    </>
  );
};

export default Board;
