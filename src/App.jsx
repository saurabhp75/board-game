import Board from "./board/Board";
import SocialShare from "./board/SocialShare.jsx";
import { gapi } from "gapi-script";

const apiKey = import.meta.env.VITE_GDRIVE_API_KEY;

const discoveryDocs = [
  "https://people.googleapis.com/$discovery/rest?version=v1",
];

const clientId = import.meta.env.VITE_GDRIVE_CLIENT_ID;

const scopes = "profile";

function initClient() {
  gapi.client
    .init({
      apiKey: apiKey,
      discoveryDocs: discoveryDocs,
      clientId: clientId,
      scope: scopes,
    })
    .then(function () {
      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

      // Handle the initial sign-in state.
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

      authorizeButton.onclick = handleAuthClick;
      signoutButton.onclick = handleSignoutClick;
    });
}

function updateSigninStatus(isSignedIn) {
  // if (isSignedIn) {
  //   authorizeButton.style.display = "none";
  //   signoutButton.style.display = "block";
  //   makeApiCall();
  // } else {
  //   authorizeButton.style.display = "block";
  //   signoutButton.style.display = "none";
  // }
}

function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

function App() {
  // console.log(import.meta.env.VITE_GDRIVE_CLIENT_ID);
  // console.log(import.meta.env.VITE_GDRIVE_API_KEY);

  const handleClientLoad = () => {
    // Initializes the client with the API key and the Translate API.
    // console.log(gapi)
    gapi.load("client:auth2", initClient);
  };

  return (
    <div className="grid grid-cols-12">
      <header className="col-span-12 bg-slate-500 py-2 px-4 text-3xl font-bold text-emerald-500">
        Photo memory
      </header>
      <div className="col-span-12 p-2 sm:col-span-10">
        <Board />
      </div>
      <div className="col-span-12 bg-red-500 p-2 sm:col-span-2">
        Advertising
      </div>
      <button
        className="rounded-md bg-sky-600"
        onClick={() => handleClientLoad()}
      >
        Login via Google
      </button>
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
