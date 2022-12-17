import React from "react";

function ActionButtons({ isLogin = true }) {
  return (
    <div>
      {" "}
      {isLogin ? null : (
        <button
          onClick={authorizeClient}
          className="mx-2 rounded-md bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
        >
          Authorize for GDrive
        </button>
      )}
      {isLogin ? (
        <button
          className="mx-2 rounded-md bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
          onClick={handleSignout}
        >
          Revoke token
        </button>
      ) : null}
      {isLogin ? (
        <button
          className="mx-2 rounded-md bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
          onClick={createConfigFile}
        >
          Create Cfg file
        </button>
      ) : null}
      {isLogin ? (
        <button
          className="mx-2 rounded-md bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
          onClick={searchConfigFiles}
        >
          Search Cfg files
        </button>
      ) : null}
      {isLogin ? (
        <button
          className="mx-2 rounded-md bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
          onClick={deleteConfigFiles}
        >
          Delete Cfg files
        </button>
      ) : null}
    </div>
  );
}

export default ActionButtons;
