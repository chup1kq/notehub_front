import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {BsMoonFill, BsSunFill} from "react-icons/bs";
import {useTheme} from "../hooks/useTheme";
import {useAuth} from "../context/AuthContext";
import {PasswordInput} from "../components/PasswordInput";
import {authentication, register} from "../core/api";
import { SimpleModal } from "../components/modals/SimpleModal";

export const Authorization = () => {
    const location = useLocation();
    const isLoginPage = location.pathname === "/login";

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});

    const [modal, setModal] = useState({
        show: false,
        message: ""
    });

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
        const response = await authentication(login, password);

        if (!response.ok) {
            setModal({
                show: true,
                message: response.error
            });
            return;
        }

        setUser(login);
        setToken(response.data);
        navigate('/');
    };

    const handleRegister = async () => {
        const response = await register(login, password);

        if (!response.ok) {
            setModal({
                show: true,
                message: response.error
            });
            return;
        }

        setUser(login);
        setToken(response.data);
        navigate('/');
    };

    const handleSubmit = async () => {
        setErrors({});

        if (isLoginPage) {
            await handleLogin();
            return;
        }

        if (password !== confirmPassword) {
            setErrors(prev => ({...prev, confirmPassword: "Пароли не совпадают"}));
            return;
        }

        validateLogin(login);
        validatePassword(password);

        if (Object.keys(errors).length > 0) {
            return;
        }

        await handleRegister();
    };

    return (
        <>
            <div className="auth-page">
                <div className="auth-container">
                    <div className="header">
                        <a href="/src/static" className="auth-logo">NoteHub</a>
                        {theme === "light-theme" ? (
                            <BsMoonFill className={"icon active theme"} onClick={toggleTheme}/>
                        ) : (
                            <BsSunFill className={"icon active theme"} onClick={toggleTheme}/>
                        )}
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
                            <>
                                <PasswordInput
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm Password"
                                />
                                {errors.confirmPassword && (
                                    <p className="auth-error">{errors.confirmPassword}</p>
                                )}
                            </>
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

            <SimpleModal
                show={modal.show}
                message={modal.message}
                onClose={() => setModal({ ...modal, show: false })}
            />
        </>
    );
};
