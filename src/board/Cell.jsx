import React, { useEffect, useReducer, useRef } from "react";
import { motion } from "framer-motion";

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
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => handleClick(num, cellState, boardState)}
    >
      {showText(cellState.state, num)}
    </motion.div>
  );
};

export default Cell;
