import { useRef, useEffect } from "react";

function useGdrive() {
  const tokenClient = useRef(null);
  const authToken = useRef(null);

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
  function handleCredentialResponse(response) {
    if (response && response.access_token) {
      console.log("Auth response recieved:");
      authToken.current = response.access_token;

      const scopesGranted = google.accounts.oauth2.hasGrantedAnyScopes(
        response,
        `https://www.googleapis.com/auth/drive`
      );

      console.log(`scopes granted: ${scopesGranted}`);

      if (scopesGranted) {
        setIsLogin(true);
        // console.log("All scopes granted");
        console.log(response.scope);
        console.log("Encoded JWT ID token:");
        console.log(authToken.current);
      }
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
    //Check for Auth status and prompt user
    if (!authToken.current) {
      console.log("Token not initialised:");
      return;
      // await authorizeClient();
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

      if (checkStatusAndAuthorize(response)) {
        return;
      }

      const jsonRes = await response.json();
      console.log(`Created config file: ${jsonRes.name}`);
    } catch (err) {
      console.dir(err);
    }
  }

  function checkStatusAndAuthorize(response) {
    let status = false;
    if ((response.status === 401) | (response.status === 403)) {
      authorizeClient();
      status = true;
    }
    return status;
  }

  async function searchConfigFiles() {
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
            pageSize: 10,
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
    const data = await response.json();
    // console.log(data);

    if (!data.files.length) {
      console.log("No config file found");
      return;
    }

    // Fetch each file data
    const promiseArray = data.files.map((file) => {
      // console.log("Found file:", file.name, file.id);
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

  async function deleteConfigFiles() {
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
            pageSize: 10,
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
        return new Promise((result) => result);
      }

      data.files.forEach(async function (file) {
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
        const responseDataPromise = await function (res) {
          console.log(responseDataPromise.status);
        };
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
      scriptElement.remove();
    };
  }, []);

  function authorizeClient() {
    if (tokenClient.current) {
      tokenClient.current.requestAccessToken();
      console.log("After requestAccessToken:");
      // setIsLogin(true);
    } else {
      console.log("Error tokenClient not initiliased");
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

  return [createConfigFile, searchConfigFiles, deleteConfigFiles, handleSignout, authorizeClient]
}

export default useGdrive;
