import { useRef } from "react";

function useToken() {

  const token = useRef(null);

  if (gapi.auth.getToken()) {
    // prompt user for login

  } else {
    // Do the normal operation
  }
}

export default useToken;
