import React from "react";

function Duration({ boardState, boardDispatch }) {
  function handleChange(e) {
    // e.preventDefault();
    // if(e.target.value)
    boardDispatch({ type: "changeDuration", payload: e.target.value });
  }
  return (
    <>
      <div>
        <label
          htmlFor="duration"
          className="m-2 text-xl font-bold text-emerald-500"
        >
          Duration(ms)
        </label>
        <input
          className="mb-2 rounded-md border-4 border-emerald-500 text-xl font-bold text-emerald-500"
          type="number"
          id="duration"
          name="duration"
          min="1000"
          max="15000"
          value={boardState.duration}
          // defaultValue={boardState.duration}
          step="200"
          onChange={handleChange}
        />
      </div>
    </>
  );
}

export default Duration;
