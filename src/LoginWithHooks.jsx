// @ts-nocheck
import React, { useEffect, useReducer, useRef } from "react";

import { GoogleReCaptcha } from "react-google-recaptcha-v3";
import axios from "axios";
import { useCallback } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { verifyLogin } from "./utils";

const initialState = {
  username: "",
  password: "",
  isLoading: false,
  isLoggedIn: false,
  error: "",
};

function loginReducer(state, action) {
  switch (action.type) {
    case "field": {
      return {
        ...state,
        [action.fieldName]: action.payload,
      };
    }
    case "login": {
      return {
        ...state,
        error: "",
        isLoading: true,
        isFocused: true,
      };
    }
    case "success": {
      return {
        ...state,
        isLoggedIn: true,
        isLoading: false,
      };
    }
    case "error": {
      return {
        ...state,
        error: "Incorrect username or password entered",
        isLoggedIn: false,
        isLoading: false,
        username: "",
        password: "",
        isFocused: true,
      };
    }
    case "logout": {
      return {
        ...state,
        isLoggedIn: false,
        username: "",
        password: "",
        error: "",
      };
    }
    default:
      return state;
  }
}

export default function LoginWithReducer() {
  const API_URL =
    "https://nestjs-assignment-2021.herokuapp.com/api/auth/loginRecaptcha";

  const [state, dispatch] = useReducer(loginReducer, initialState);
  const { username, password, isLoading, isLoggedIn, error, isFocused } = state;
  const usernameRef = useRef(null);

  const { executeRecaptcha } = useGoogleReCaptcha();
  // Create an event handler so you can call the verification on button click event or form submit
  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      return;
    }

    const token = await executeRecaptcha("Login");
    // Do whatever you want with the token
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: verifyLogin });
    try {
      await verifyLogin({ username, password, token });
      dispatch({ type: "success" });
    } catch (error) {
      dispatch({ type: "error" });
    }
  };

  const verifyLogin = ({ username, password, token }) => {
    return axios
      .post(API_URL, {
        username,
        password,
        recaptchaToken: token,
      })
      .then((response) => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  };

  useEffect(() => {
    if (isFocused) {
      usernameRef.current.focus();
    }
  }, [isFocused]);

  // You can use useEffect to trigger the verification as soon as the component being loaded
  useEffect(() => {
    handleReCaptchaVerify();
  }, [handleReCaptchaVerify]);

  return (
    <div className="App">
      <div className="login-container">
        {isLoggedIn ? (
          <>
            <h1>Welcome {username}!</h1>
            <button onClick={() => dispatch({ type: "logout" })}>
              Log Out
            </button>
          </>
        ) : (
          <form className="form" onSubmit={handleSubmit}>
            {error && <p className="error">{error} </p>}
            <p>Please Login!</p>
            <input
              type="text"
              ref={usernameRef}
              placeholder="Enter username"
              value={username}
              autoFocus
              onChange={(e) =>
                dispatch({
                  type: "field",
                  fieldName: "username",
                  payload: e.currentTarget.value,
                })
              }
            />
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) =>
                dispatch({
                  type: "field",
                  fieldName: "password",
                  payload: e.currentTarget.value,
                })
              }
            />
            <button className="submit" type="submit" disabled={isLoading}>
              {isLoading ? "Logging In....." : "Log In"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
