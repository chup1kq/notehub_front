import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {BsMoonFill, BsSunFill} from "react-icons/bs";
import {useTheme} from "../hooks/useTheme";
import {useAuth} from "../context/AuthContext";
import {PasswordInput} from "../components/PasswordInput";
import {authentication, register} from "../core/api";

const apiUrl = 'http://localhost:8081/api/v1';


export const Authorization = () => {
    const location = useLocation();
    const isLoginPage = location.pathname === "/login";

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const {theme, toggleTheme} = useTheme();
    const {user, token, setUser, setToken} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && token) {
            navigate("/account");
        }
    }, [user, token, navigate]);

    const validateLogin = (login) => {

    }

    const validatePassword = (password) => {

    }

    const handleLogin = async () => {
        try {
            const response = await authentication(login, password);

            setUser(login);
            setToken(response);
            navigate('/');
        } catch (error) {
            alert(error.message);
        }
    }

    const handleRegister = async () => {
        try {
            const response = await register(login, password);

            setUser(login);
            setToken(response);
            navigate('/');
        } catch (error) {
            alert(error.message);
        }
    }

    const handleSubmit = async () => {
        setErrors({});

        if (isLoginPage) {
            await handleLogin();
            return;
        }

        if (password !== confirmPassword) {
            setErrors({...errors, confirmPassword: "Пароли не совпадают"});
            return;
        }

        validateLogin(login);
        validatePassword(password);

        if (Object.keys(errors).length > 0) {
            return;
        }

        await handleRegister();
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="header">
                    <a href="/src/static" className="auth-logo">NoteHub</a>
                    {theme === "light-theme" ?
                        <BsMoonFill
                            className={"icon active theme"}
                            onClick={toggleTheme}/> :
                        <BsSunFill
                            className={"icon active theme"}
                            onClick={toggleTheme}/>}
                </div>
                <div className="input-fields">
                    <input
                        id="login"
                        onChange={(e) => setLogin(e.target.value)}
                        value={login}
                        placeholder="Login"
                        className="auth-input"
                    />
                    <PasswordInput
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                    {!isLoginPage && (
                        <PasswordInput
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password"
                        />
                    )}
                    <button
                        type="button"
                        className="auth-button"
                        onClick={handleSubmit}
                    >
                        {isLoginPage ? "Войти" : "Зарегистрироваться"}
                    </button>
                </div>
                <p className="auth-text">
                    {isLoginPage ? "Еще нет аккаунта? " : "Уже есть аккаунт? "}
                    <a href={isLoginPage ? "/register" : "/login"} className="auth-link">
                        {isLoginPage ? "Зарегистрироваться" : "Войти"}
                    </a>
                </p>
            </div>
        </div>
    );
}