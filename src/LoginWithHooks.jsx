import React, { useReducer } from 'react';
import { verifyLogin } from './utils';

const initialState = {
  username: '',
  password: '',
  isLoading: false,
  isLoggedIn: false,
  error: ''
};

function loginReducer(state, action) {
  switch (action.type) {
    case 'field': {
      return {
        ...state,
        [action.fieldName]: action.payload
      };
    }
    case 'login': {
      return {
        ...state,
        error: '',
        isLoading: true
      };
    }
    case 'success': {
      return {
        ...state,
        isLoggedIn: true,
        isLoading: false
      };
    }
    case 'error': {
      return {
        ...state,
        error: 'Incorrect username or password entered',
        isLoggedIn: false,
        isLoading: false,
        username: '',
        password: ''
      };
    }
    case 'logout': {
      return {
        ...state,
        isLoggedIn: false,
        username: '',
        password: '',
        error: ''
      };
    }
    default:
      return state;
  }
}

export default function LoginWithReducer() {
  const [state, dispatch] = useReducer(loginReducer, initialState);
  const { username, password, isLoading, isLoggedIn, error } = state;

  const handleSubmit = async e => {
    e.preventDefault();
    dispatch({ type: verifyLogin });
    try {
      await verifyLogin({ username, password });
      dispatch({ type: 'success' });
    } catch (error) {
      dispatch({ type: 'error' });
    }
  };

  return (
    <div className="App">
      <div className="login-container">
        {isLoggedIn ? (
          <>
            <h1>Welcome {username}!</h1>
            <button onClick={() => dispatch({ type: 'logout' })}>
              Log Out
            </button>
          </>
        ) : (
          <form className="form" onSubmit={handleSubmit}>
            {error && <p className="error">{error} </p>}
            <p>Please Login!</p>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={e =>
                dispatch({
                  type: 'field',
                  fieldName: 'username',
                  payload: e.currentTarget.value
                })
              }
            />
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={e =>
                dispatch({
                  type: 'field',
                  fieldName: 'password',
                  payload: e.currentTarget.value
                })
              }
            />
            <button className="submit" type="submit" disabled={isLoading}>
              {isLoading ? 'Logging In.....' : 'Log In'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
