import { useEffect, useReducer, useRef } from "react";
import { cellState, cellAction } from "../types/boardTypes";

function cellReducer(state: cellState, action: cellAction): cellState {
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
    case "changeDuration":
      return {
        ...state,
        // duration,
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

  // Used to hide cells after "first-start"
  // or anytime cell-data changes
  useEffect(() => {
    // console.log(`useEffect:Cell num: ${num}`)
    cellDispatch({ type: "found" });
    const timerId = setTimeout(() => {
      cellDispatch({ type: "hide" });
    }, boardState.duration);

    return () => clearTimeout(timerId);
  }, [num]);

  // Used to hide cells after clicking "re-start"
  useEffect(() => {
    // console.log(`useEffect:Cell num: ${num}`)
    if (boardState.state === "reset") {
      cellDispatch({ type: "found" });
      const timerId = setTimeout(() => {
        cellDispatch({ type: "hide" });
      }, boardState.duration);
      return () => clearTimeout(timerId);
    }
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
    <div
      onClick={() => handleClick(num, cellState, boardState)}
      className="rounded-md bg-green-600 p-7 text-center text-4xl font-bold hover:scale-110 hover:bg-green-400"
    >
      {showText(cellState.state, num)}
    </div>
  );
  ṭ;
};

export default Cell;
