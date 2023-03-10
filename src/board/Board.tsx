import { useReducer, useRef, useEffect, FC } from "react";
import getRandomBoard from "../utils/utils.js";
import Cell from "./Cell";
import Duration from "./Duration";
import CustomButton from "./CustomButton";
import useGdrive from "../hooks/useGdrive";
import { boardState, boardAction } from "../types/boardTypes";

function boardReducer(state: boardState, action: boardAction): boardState {
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
        duration: action.payload as number,
      };
    default:
      throw new Error("Unknown action type in board reducer");
  }
}

const Board: FC = () => {
  const startTime = useRef<number | null>(null);

  const [boardState, boardDispatch] = useReducer(boardReducer, {
    board: getRandomBoard(),
    searchNum: 1,
    state: "init", // init|reset|won|changeDuration
    won: false,
    duration: 3000, // 1000ms
  });

  const [
    createConfigFile,
    searchConfigFiles,
    deleteConfigFiles,
    handleSignout,
    authorizeClient,
    UpdateFile,
    getGameData,
  ] = useGdrive();

  if (boardState.state == "reset") {
    startTime.current = Date.now();
  }

  useEffect(() => {
    if (boardState.won) {
      console.log("You won!!!");
      console.log(boardState.duration);

      getGameData()
        .then((data) => {
          if (data.hasOwnProperty(boardState.duration)) {
            data[boardState.duration]++;
            console.log("has own property true");
          } else {
            data[boardState.duration] = 1;
          }
          console.log(data);
          return data;
        })
        .then((data) => UpdateFile(data))
        .then((data) => console.log(`file: ${data} updated`));
    }
  }, [boardState.state]);

  function resetBoard() {
    boardDispatch({ type: "reset" });
  }

  return (
    <>
      <div className="font-san mx-3 my-3 flex flex-col items-center justify-end">
        <div className="m-2 text-xl font-bold text-emerald-500">
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
      </div>

      <div className="flex items-stretch justify-around">
        <Duration boardState={boardState} boardDispatch={boardDispatch} />
        <CustomButton resetBoard={resetBoard} />
        {/* <button
          onClick={authorizeClient}
          className="mx-2 rounded-md bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
        >
          Authorize for GDrive
        </button>
        <button
          className="mx-2 rounded-md bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
          onClick={handleSignout}
        >
          Revoke token
        </button>

        <button
          className="mx-2 rounded-md bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
          onClick={createConfigFile}
        >
          Create Cfg file
        </button> 

        <button
          className="mx-2 rounded-md bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
          onClick={searchConfigFiles}
        >
          Search Cfg files
        </button>

        <button
          className="mx-2 rounded-md bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
          onClick={deleteConfigFiles}
        >
          Delete Cfg files
        </button> */}
      </div>
    </>
  );
};

export default Board;
