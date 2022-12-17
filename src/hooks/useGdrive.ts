import { useRef, useEffect } from "react";
import {
  gameData,
  tokenResponse,
  tokenError,
  FILE,
  TokenClient,
} from "../types/boardTypes";

function useGdrive() {
  const tokenClient = useRef<null | TokenClient>(null);
  const authToken = useRef<null | string>(null);
  const fileIDRef = useRef<null | number>(null);

  // Called when auth script is loaded by browser. Initializes
  // the "tokenClient", which can/will request the token.
  function handleAuthscriptLoad() {
    console.log("auth client script loaded:");

    // tokenClient will be used to get auth token
    // when user clicks "Authorize" button
    tokenClient.current = google.accounts.oauth2.initTokenClient({
      client_id: import.meta.env.VITE_CLIENT_ID,
      scope: import.meta.env.VITE_SCOPES,
      callback: handleCredentialResponse,
      error_callback: handleAuthError,
    });

    console.log("Auth client initialized:");
  }

  // Callback when response is recieved for token request
  // by tokenClient
  async function handleCredentialResponse(
    response: tokenResponse
  ): Promise<void> {
    console.log(response);
    if (response && response.access_token) {
      console.log("Auth response recieved:");
      authToken.current = response.access_token;

      const scopesGranted = google.accounts.oauth2.hasGrantedAnyScope(
        response,
        `https://www.googleapis.com/auth/drive.appdata`
      );

      if (scopesGranted) {
        // console.log(`Scopes granted: ${scopesGranted}`);
        // console.log(response.scope);
        console.log("Encoded JWT ID token:");
        console.log(authToken.current);

        fileIDRef.current = await searchFile("gameData.brd");

        if (!fileIDRef.current) {
          // Store in ref
          fileIDRef.current = await createFile("gameData.brd");
          // fileIDRef.current = await getFileData(fileID);
        }
      } else {
        console.log("Scopes not granted");
      }
    }
  }

  // Callback when error response is recieved for
  // token request by tokenClient
  function handleAuthError(err: tokenError): void {
    // setIsLogin(false);
    console.log(`Error initializing tokenClient`);
    console.log(err.type);
  }

  // Create file and return fileID
  async function createFile(fileName: string): Promise<null | number> {
    //Check for Auth status and prompt user
    if (!authToken.current) {
      console.log("Token not initialised:");
      return null;
      // await authorizeClient();
    }

    console.log(`Creating file ${fileName}.....`);

    // const blob = new Blob(["Hello Saurabhp75!!!"], { type: "plain/text" });
    const blob = new Blob([JSON.stringify({})], {
      type: "application/json",
    });

    // set file metadata
    let metadata = {
      name: fileName,
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

    let response;

    try {
      response = await fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
        {
          method: "POST",
          headers: new Headers({
            Authorization: "Bearer " + authToken.current,
          }),
          body: formData,
        }
      );

      if (checkStatusAndAuthorize(response)) {
        return null;
      }

      const jsonRes = await response.json();
      console.log(jsonRes.id);
      console.log(`Created config file: ${jsonRes.name}`);
      return jsonRes.id;
    } catch (err) {
      console.dir(err);
      return null;
    }
  }

  // Update file
  async function UpdateFile(gameData: gameData): Promise<null | number> {
    if (!authToken.current) {
      console.log("Token not initialised:");
      return null;
    }

    console.log(`Updating file ${fileIDRef.current}.....`);

    // const blob = new Blob(["Hello Saurabhp75!!!"], { type: "plain/text" });
    const blob = new Blob([JSON.stringify(gameData)], {
      type: "application/json",
    });

    // set file metadata
    let metadata = {
      name: "gameData.brd",
      // mimeType: "plain/text",
      // parents: ["appDataFolder"],
    };

    let formData = new FormData();
    formData.append(
      "metadata",
      new Blob([JSON.stringify(metadata)], { type: "application/json" })
    );

    // set file as blob format
    formData.append("file", blob);

    let response;

    try {
      response = await fetch(
        `https://www.googleapis.com/upload/drive/v3/files/${fileIDRef.current}?uploadType=multipart`,
        {
          method: "PATCH",
          headers: new Headers({
            Authorization: "Bearer " + authToken.current,
          }),
          body: formData,
        }
      );

      // const res = await response.json();
      // console.log(res);

      if (checkStatusAndAuthorize(response)) {
        return;
      }

      const jsonRes = await response.json();
      console.log(jsonRes.id);
      console.log(`Updated config file: ${jsonRes.name} ${jsonRes.id}`);
      return jsonRes.id;
    } catch (err) {
      console.dir(err);
      return null;
    }
  }

  async function createConfigFile() {
    if (!authToken.current) {
      console.log("Token not initialised:");
      return;
    }

    console.log("Creating config file.....");

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

    let response;

    try {
      response = await fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
        {
          method: "POST",
          headers: new Headers({
            Authorization: "Bearer " + authToken.current,
          }),
          body: formData,
        }
      );

      if (checkStatusAndAuthorize(response)) {
        return;
      }

      const jsonRes = await response.json();
      console.log(jsonRes.id);
      console.log(`Created config file: ${jsonRes.name}`);
    } catch (err) {
      console.dir(err);
    }
  }

  function checkStatusAndAuthorize(response: Response | null) {
    let status = false;
    if (response?.status === 401 || response?.status === 403) {
      // const res = await response.json();
      // console.log(res.message);
      authorizeClient();
      status = true;
    }
    return status;
  }

  // Search for a file: "fileName" and return id.
  // Otherwise return null.
  async function searchFile(fileName: string): Promise<null | number> {
    //Check for Auth token
    if (!authToken.current) {
      console.log("Token not initialised:");
      return null;
    }

    console.log(`Searching for file: ${fileName}....`);

    let response;

    // Fetch all app-config files
    try {
      response = await fetch(
        "https://www.googleapis.com/drive/v3/files?" +
          new URLSearchParams({
            spaces: "appDataFolder",
            fields: "nextPageToken, files(id, name)",
            pageSize: "10",
          }),
        {
          headers: new Headers({
            Authorization: "Bearer " + authToken.current,
          }),
        }
      );
    } catch (err) {
      console.log(`Error fetching files: ${err}`);
    }

    if (checkStatusAndAuthorize(response)) {
      return null;
    }

    // console.log(response);
    const data = await response?.json();
    // console.log(data);

    if (!data.files.length) {
      console.log(`file: ${fileName} not found`);
      return null;
    }

    // fileFound is an array and should be of size 1
    const fileFound = data.files.filter((file: FILE) => {
      console.log(file.name, fileName);
      return file.name === fileName;
    });

    console.log(fileFound);

    if (fileFound.length > 1) {
      console.log(`Found duplicate files: ${fileName}`);
    }
    return fileFound[0].id;
  }

  async function getGameData(): Promise<null | gameData> {
    console.log(`Getting game data....`);
    const gameData = await getFileData(fileIDRef.current);
    return gameData;
  }

  // Get file data with a given ID
  async function getFileData(fileID: number | null): Promise<null | gameData> {
    //Check for Auth token
    if (!authToken.current) {
      console.log("Token not initialised:");
      return null;
    }

    console.log(`Searching for fileID: ${fileID}....`);

    let response;
    // Fetch all app-config files
    try {
      response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileID}?alt=media`,
        {
          headers: new Headers({
            Authorization: "Bearer " + authToken.current,
          }),
        }
      );
    } catch (err) {
      console.log(`Error fetching files: ${err}`);
    }

    // Check for authorization status of response
    if (checkStatusAndAuthorize(response)) {
      return null;
    }

    // console.log(response);
    const data = await response?.json();
    console.log(data);
    return data;
  }

  async function searchConfigFiles(): Promise<void> {
    //Check for Auth status and prompt user
    if (!authToken.current) {
      console.log("Token not initialised:");
      return;
    }

    console.log("Searching config file(s).....");

    let response;
    try {
      response = await fetch(
        "https://www.googleapis.com/drive/v3/files?" +
          new URLSearchParams({
            spaces: "appDataFolder",
            fields: "nextPageToken, files(id, name)",
            pageSize: "10",
          }),
        {
          headers: new Headers({
            Authorization: "Bearer " + authToken.current,
          }),
        }
      );
    } catch (err) {
      console.log(`Error fetching files: ${err.status}`);
    }

    if (checkStatusAndAuthorize(response)) {
      return;
    }

    // console.log(response);
    const data = await response?.json();
    // console.log(data);

    if (!data.files.length) {
      console.log("No config file found");
      return;
    }

    // Fetch each file data
    const promiseArray = data.files.map((file) => {
      console.log("Found file:", file.name, file.id);
      return fetch(
        `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
        {
          headers: new Headers({
            Authorization: "Bearer " + authToken.current,
          }),
        }
      );
    });

    const responses = await Promise.all(promiseArray);
    const jsonResponse = responses.map((res) => res.json());
    const responseData = await Promise.all(jsonResponse);
    responseData.forEach((datum) => console.log(datum));
  }

  async function deleteConfigFiles(): Promise<void> {
    //Check for Auth status and prompt user
    if (!authToken.current) {
      console.log("Token not initialised:");
      return;
      // await authorizeClient();
    }
    console.log("Deleting config file(s).....");

    try {
      const res = await fetch(
        "https://www.googleapis.com/drive/v3/files?" +
          new URLSearchParams({
            spaces: "appDataFolder",
            fields: "nextPageToken, files(id, name)",
            pageSize: "10",
          }),
        {
          headers: new Headers({
            Authorization: "Bearer " + authToken.current,
          }),
        }
      );

      if (checkStatusAndAuthorize(res)) {
        return;
      }

      // console.log(res);
      const data = await res.json();
      // console.log(data);

      if (!data.files.length) {
        console.log("No config file found");
        return;
      }

      data.files.forEach(async function (file: FILE) {
        console.log("Found file:", file.name, file.id);

        const response = await fetch(
          `https://www.googleapis.com/drive/v3/files/${file.id}`,
          {
            method: "DELETE",
            headers: new Headers({
              Authorization: "Bearer " + authToken.current,
            }),
          }
        );
        // const responseDataPromise = await function (res) {
        //   console.log(responseDataPromise.status);
        // };
      });
      return data.files;
    } catch (err) {
      console.log(err);
    }
  }

  function handleAuthscriptLoadError(error) {
    console.log("Error on auth script load:");
    console.log(error);
  }

  useEffect(() => {
    // Load Google client auth library
    const scriptTag = document.createElement("script");
    scriptTag.id = "authScript";
    scriptTag.src = "https://accounts.google.com/gsi/client";
    scriptTag.onload = handleAuthscriptLoad;
    scriptTag.onerror = handleAuthscriptLoadError;
    scriptTag.async = true;
    document.head.appendChild(scriptTag);

    return () => {
      let scriptElement = document.getElementById("authScript");
      scriptElement?.remove();
    };
  }, []);

  function authorizeClient() {
    if (tokenClient.current) {
      tokenClient.current.requestAccessToken();
      console.log("After requestAccessToken:");
    } else {
      console.log("Error tokenClient not initiliased");
    }
  }

  function handleSignout() {
    if (authToken.current === null) {
      console.log("No token to revoke");
      return;
    }

    google.accounts.oauth2.revoke(authToken.current, () =>
      console.log("token revoked")
    );

    authToken.current = null;
  }

  return [
    createConfigFile,
    searchConfigFiles,
    deleteConfigFiles,
    handleSignout,
    authorizeClient,
    UpdateFile,
    getGameData,
  ];
}

export default useGdrive;
