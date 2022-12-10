import Board from "./board/Board";
import SocialShare from "./board/SocialShare";
import { useState } from "react";
// import ActionButtons from "./board/ActionButtons";
import useGdrive from "./hooks/useGdrive";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [
    createConfigFile,
    searchConfigFiles,
    deleteConfigFiles,
    handleSignout,
    authorizeClient,
  ] = useGdrive();
  

  return (
    <div className="grid h-screen grid-cols-12">
      <header className="col-span-12 bg-slate-500 py-2 px-4 text-3xl font-bold text-emerald-500">
        Photo memory
      </header>

      <div className="col-span-12 p-2 sm:col-span-10">
        <Board />
      </div>
      <div className="col-span-12 bg-red-500 p-2 sm:col-span-2">
        Advertising
      </div>
      <div className="col-span-12">
        <button
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
        </button>

        {/* <ActionButtons></ActionButtons> */}

        {/* {isLogin ? null : (
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
        ) : null} */}
      </div>

      <footer className="col-span-12 bg-yellow-500 p-2">
        <div className="flex justify-around">
          <div>Created by Saurabh</div>
          <div>
            <SocialShare />
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
