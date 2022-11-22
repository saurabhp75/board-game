import Board from "./board/Board";
import SocialShare from "./board/SocialShare.jsx";
import { useRef } from "react";
import { useGoogleLogin } from "@react-oauth/google";

const scopes =
  "https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive";
const url = import.meta.env.VITE_DRIVE_URL + "/files?";

function App() {
  const token = useRef(null);

  const gLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      token.current = tokenResponse.access_token;
      // console.log(token.current);
    },
    onError: (errorResponse) => {
      console.log("$$$$Error in Glogin$$$$");
      console.log(errorResponse);
      token.current = null;
    },
    scope: scopes,
  });

  const getFiles = async () => {
    try {
      const response = await fetch(url + new URLSearchParams({ key: token }), {
        headers: {
          Authorization: `Bearer ${token.current}`,
          Accept: "application/json",
        },
      });
      return response;
    } catch (error) {
      console.log("Request Failed:", error);
    }
  };

  const getDriveData = async () => {
    let response = await getFiles();
    let data;

    if (response.ok) {
      data = await response.json();
      console.log(data.files);
    } else if (response.status === 401) {
      // Request access token
      gLogin();
      // Fetch Data
      response = await getFiles();
      data = await response.json();
      console.log(data.files);
    } else {
      console.log(`Error Response, getData: ${response.status}`);
    }
  };

  return (
    <div className="grid grid-cols-12 h-screen">
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
        {/* <button >Get drive files</button> */}
        <button
          onClick={getDriveData}
          className="w-full rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
        >
          Get drive files
        </button>
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
