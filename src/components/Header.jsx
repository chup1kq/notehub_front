import React, {useState} from "react";
import {useAuth} from "../context/AuthContext";
import {BsSunFill, BsMoonFill} from "react-icons/bs";
import {MdLogout} from "react-icons/md";
import {RxCross2} from "react-icons/rx";
import {GiHamburgerMenu} from "react-icons/gi";
import 'bootstrap/dist/js/bootstrap.bundle.min';
import {useNavigate} from "react-router-dom";

import {SearchBar} from "./SearchBar";
import {useTheme} from "../hooks/useTheme";

export const Header = () => {
    const {token, user, setUser, setToken} = useAuth();
    const {theme, toggleTheme} = useTheme();
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const search = (url: string) => {
        navigate('/note/' + url);
    };

    const logout = () => {
        if (window.confirm("Вы уверены, что хотите выйти из аккаунта?")) {
            setUser(null);
            setToken(null);
            navigate('/login');
        }
    };

    return (
        <>
            <nav className="navbar px-5">
                <div className="container">
                    <div
                        className="header-grid"
                    >
                        <div className="d-flex align-items-center justify-content-start">
                            <a className="text logo" href="/">NoteHub</a>
                        </div>
                        <div className="header-center d-none d-sm-flex justify-content-center">
                            <SearchBar onSearch={() => {
                            }} doSearch={search}/>
                        </div>
                        <div className="header-right d-flex align-items-center justify-content-end">
                            {theme === "light-theme" ? (
                                <BsMoonFill className="icon active theme" onClick={toggleTheme}/>
                            ) : (
                                <BsSunFill className="icon active theme" onClick={toggleTheme}/>
                            )}
                            {!token ? (
                                <>
                                    <a href="/login" className="auth text me-2 d-none d-sm-inline">Войти</a>
                                    <span className="me-2 text d-none d-sm-inline">/</span>
                                    <a href="/register" className="auth text d-none d-sm-inline">Зарегистрироваться</a>
                                </>
                            ) : (
                                <div className="d-flex d-none d-sm-flex align-items-center">
                                    <a href={'/account'} className="auth text me-2">
                                        {user}
                                    </a>
                                    <button type="button" onClick={logout} className="auth">
                                        <MdLogout className="icon"/>
                                    </button>
                                </div>
                            )}
                            <button
                                className="burger-btn d-sm-none"
                                onClick={() => setDrawerOpen(true)}
                                aria-label="Open menu"
                            >
                                <GiHamburgerMenu/>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <div className={`mobile-drawer ${drawerOpen ? "active" : ""}`}>
                <button className="close-icon text" onClick={() => setDrawerOpen(false)} aria-label="Close">
                    <RxCross2/>
                </button>
                <div className="mobile-menu">
                    <ul>
                        <li><SearchBar onSearch={() => {
                        }}
                                       doSearch={(value) => {
                                           search(value);

                                           setDrawerOpen(false);
                                       }}
                        />
                        </li>
                        {user ? (
                            <>
                                <li><a href="/account">{user}</a></li>
                                <li>
                                    <button onClick={() => {
                                        logout();
                                        setDrawerOpen(false);
                                    }}>Выйти
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li><a href="/login">Войти</a></li>
                                <li><a href="/register">Зарегистрироваться</a></li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </>
    );
};
