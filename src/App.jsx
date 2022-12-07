import Board from "./board/Board";
import SocialShare from "./board/SocialShare.jsx";
import { useRef, useState, useEffect } from "react";
// import { initAuth } from "./utils/utils.js";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const tokenClient = useRef(null);
  const gsiScript = useRef(null);
  const authToken = useRef(null);

  // setIsLogin(true);

  // console.log(`isLogin: ${isLogin}`)

  // Called when auth script is loaded by browser. Initializes
  // the "tokenClient", which can/will request the token.
  function initAuth() {
    console.log("auth client script loaded");
    gsiScript.current = google;

    // tokenClient will be used to get auth token
    // when user clicks "Authorize" button
    tokenClient.current = google.accounts.oauth2.initTokenClient({
      client_id: import.meta.env.VITE_CLIENT_ID,
      scope: import.meta.env.VITE_SCOPES,
      callback: handleCredentialResponse,
      error_callback: handleAuthError,
    });
  }

  // Callback when response is recieved for token request
  // by tokenClient
  function handleCredentialResponse(response) {
    if (response && response.access_token) {
      console.log("Auth client initialized: Auth response recieved");
      authToken.current = response.access_token;

      const scopesGranted = google.accounts.oauth2.hasGrantedAllScopes(
        response,
        `https://www.googleapis.com/auth/drive`
      );

      console.log(`scopes granted: ${scopesGranted}`);

      // if (scopesGranted) {
      setIsLogin(true);
      // console.log("All scopes granted");
      console.log(response.scope);
      console.log("Encoded JWT ID token:");
      console.log(authToken.current);
      // checkFolder(gapi);
      // }
    }
  }

  // Callback when error response is recieved for
  // token request by tokenClient
  function handleAuthError(err) {
    setIsLogin(false);
    console.log(`Error initializing tokenClient`);
    console.log(err);
  }

  async function createConfigFile() {
    console.log("Creating config file.....");

    //Check for Auth status and prompt user

    // const blob = new Blob(["Hello Saurabhp75!!!"], { type: "plain/text" });
    const blob = new Blob([JSON.stringify({ time: 3000, success: 5 })], {
      type: "application/json",
    });

    // set file metadata
    let metadata = {
      name: "config.json",
      // mimeType: "plain/text",
      parents: ["appDataFolder"],
    };

    let formData = new FormData();
    formData.append(
      "metadata",
      new Blob([JSON.stringify(metadata)], { type: "application/json" })
    );

    // set file as blob format
    formData.append("file", blob);

    try {
      const response = await fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
        {
          method: "POST",
          headers: new Headers({
            Authorization: "Bearer " + authToken.current,
          }),
          body: formData,
        }
      );

      const jsonRes = await response.json();
      console.log(jsonRes);
    } catch (err) {
      console.dir(err);
    }
  }

  async function searchConfigFiles() {
    // 1. first check for gapi client
    // If not found then ask user to
    // reload or do it programatically

    // 2. then search for token, if not found
    // ask user to get token or do it by code

    let response;

    try {
      response = await fetch(
        "https://www.googleapis.com/drive/v3/files?" +
          new URLSearchParams({
            spaces: "appDataFolder",
            fields: "nextPageToken, files(id, name)",
            pageSize: 10,
          }),
        {
          headers: new Headers({
            Authorization: "Bearer " + authToken.current,
          }),
        }
      );
    } catch (err) {
      console.log(`Response status: ${err.status}`);
      if (err.status === 403) {
        console.log("get access token first!!!");

        // Prompt user for token request
        if (!tokenClient.current) {
          // setIsLogin(false);
          return;
        }

        tokenClient.current.requestAccessToken();
      } else {
        console.log("Unknown error in fetching files from drive");
        console.log(err);
      }
      return;
    }

    if (!response) {
      console.log("No response recieved from gdrive");
      return;
    }

    console.log(response);
    const data = await response.json();
    console.log(data);

    if (!data.files.length) {
      console.log("No config file found");
      return new Promise((result) => result);
    }

    // console.log(res.result.files.length);
    data.files.forEach(async function (file) {
      console.log("Found file:", file.name, file.id);

      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
        {
          headers: new Headers({
            Authorization: "Bearer " + authToken.current,
          }),
        }
      );

      const responseDataPromise = await function (response) {
        // console.log(...res.headers);
        for (let pair of res.headers.entries()) {
          // console.log(pair[0] + ": " + pair[1]);
          if (pair[0] === "content-type") {
            if (pair[1] === "plain/text") {
              return res.text();
            } else if (pair[1] == "application/json") {
              return res.json();
            }
          }
        }
      };

      const responseData = await function (responseDataPromise) {
        console.log(responseData);
      };
    });

    return data.files;
  }

  async function deleteConfigFiles() {
    try {
      const res = await fetch(
        "https://www.googleapis.com/drive/v3/files?" +
          new URLSearchParams({
            spaces: "appDataFolder",
            fields: "nextPageToken, files(id, name)",
            pageSize: 10,
          }),
        {
          headers: new Headers({
            Authorization: "Bearer " + authToken.current,
          }),
        }
      );

      console.log(res);
      const data = await res.json();
      console.log(data);

      if (!res) {
        console.log("No response recieved from gdrive");
        return;
      }

      if (!data.files.length) {
        console.log("No config file found");
        return new Promise((result) => result);
      }

      data.files.forEach(function (file) {
        console.log("Found file:", file.name, file.id);

        fetch(`https://www.googleapis.com/drive/v3/files/${file.id}`, {
          method: "DELETE",
          headers: new Headers({
            Authorization: "Bearer " + authToken.current,
          }),
        }).then((res) => {
          console.log(res.status);
        });
      });
      return data.files;
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    // Load Google client auth library
    const scriptTag = document.createElement("script");
    scriptTag.id = "authScript";
    scriptTag.src = "https://accounts.google.com/gsi/client";
    scriptTag.onload = initAuth;
    scriptTag.async = true;
    document.head.appendChild(scriptTag);

    return () => {
      let scriptElement = document.getElementById("authScript");
      scriptElement.remove();
    };
  }, []);

  function authorizeClient() {
    if (tokenClient.current) {
      tokenClient.current.requestAccessToken();
      console.log("After requestAccessToken:");
      // setIsLogin(true);
    } else {
      console.log("Failed to initialize Google Auth client");
    }
  }

  function handleSignout() {
    // google.accounts.id.revoke()?
    if (authToken.current === null) {
      console.log("No token to revoke");
      return;
    }

    google.accounts.oauth2.revoke(authToken.current);
    authToken.current = null;
    console.log("Token revoked");
    setIsLogin(false);
  }

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
