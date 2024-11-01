import { createContext, useReducer, useEffect } from 'react';

const initialState = {
    user: null,
    authIsReady: false,
};

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                user: action.payload,
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null,
            };
        case 'AUTH_IS_READY':
            return {
                ...state,
                authIsReady: true,
            };
        default:
            return state;
    }
};

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));

        if (user) {
            dispatch({ type: 'LOGIN', payload: user });
        }

        dispatch({ type: 'AUTH_IS_READY' });
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {state.authIsReady ? children : <p>Loading...</p>}
        </AuthContext.Provider>
    );
};
