import "./index.css";

import App from "./App";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(
  <GoogleReCaptchaProvider
    reCaptchaKey="6Ldsfk8dAAAAAA8KoF9rJ5Hix3hsqxxRi55OnSh9"
    language="vi"
    useRecaptchaNet={true}
    scriptProps={{
      async: false, // optional, default to false,
      defer: false, // optional, default to false
      appendTo: "head", // optional, default to "head", can be "head" or "body",
      nonce: undefined, // optional, default undefined
    }}
  >
    <App />
  </GoogleReCaptchaProvider>,
  document.getElementById("root")
);
