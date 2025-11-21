import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {BsMoonFill, BsSunFill} from "react-icons/bs";
import {useTheme} from "../hooks/useTheme";
import {useAuth} from "../context/AuthContext";
import {PasswordInput} from "../components/PasswordInput";
import {authentication, register} from "../core/api";
import { SimpleModal } from "../components/modals/SimpleModal";
import { useTranslation } from "../hooks/useTranslation";
import {LanguageSelector} from "../components/LanguageSelector";

export const Authorization = () => {
    const location = useLocation();
    const isLoginPage = location.pathname === "/login";
    const { t } = useTranslation();

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
            setErrors(prev => ({...prev, confirmPassword: t('auth.passwordsNotMatch')}));
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
                        <a href="/" className="auth-logo">NoteHub</a>
                        <LanguageSelector />
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
                            placeholder={t('auth.loginPlaceholder')}
                            className="auth-input"
                        />
                        <PasswordInput
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={t('auth.passwordPlaceholder')}
                        />
                        {!isLoginPage && (
                            <>
                                <PasswordInput
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder={t('auth.confirmPasswordPlaceholder')}
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
                            {isLoginPage ? t('auth.login') : t('auth.register')}
                        </button>
                    </div>

                    <p className="auth-text">
                        {isLoginPage ? t('auth.noAccountYet') + " " : t('auth.alreadyHaveAnAccount') + " "}
                        <a href={isLoginPage ? "/register" : "/login"} className="auth-link">
                            {isLoginPage ? t('auth.register') : t('auth.login')}
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
