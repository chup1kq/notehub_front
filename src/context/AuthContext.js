import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {initAuthApi} from "../core/api";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [token, setToken_] = useState(localStorage.getItem("token"));
    const [user, setUser_] = useState(localStorage.getItem('user'));

    useEffect(() => {
        initAuthApi(setToken, setUser);
    }, []);

    const setToken = (newToken) => {
        setToken_(newToken);
    };

    const setUser = (newUser) => {
        setUser_(newUser);
    }

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', user);
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    const contextValue = useMemo(
        () => ({
            token,
            user,
            setToken,
            setUser,
        }),
        [token, user]
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthProvider;
