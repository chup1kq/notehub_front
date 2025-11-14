import {SearchBar} from "./SearchBar";
import {RxCross2} from "react-icons/rx";
import {GiHamburgerMenu} from "react-icons/gi";
import {MdLogout} from "react-icons/md";
import {BsMoonFill, BsSunFill} from "react-icons/bs";
import {useAuth} from "../context/AuthContext";
import {useTheme} from "../hooks/useTheme";
import {useNavigate} from "react-router-dom";
import {useState} from "react";

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
            <nav className="navbar">
                <div className="header-grid">
                    <div className="header-left">
                        <a className="logo text" href="/">NoteHub</a>
                    </div>
                    <div className="header-center hide-sm">
                        <SearchBar onSearch={() => {}} doSearch={search}/>
                    </div>
                    <div className="header-right">
                        {theme === "light-theme" ? (
                            <BsMoonFill className="icon theme active" onClick={toggleTheme}/>
                        ) : (
                            <BsSunFill className="icon theme active" onClick={toggleTheme}/>
                        )}
                        {!token ? (
                            <>
                                <a href="/login" className="auth text hide-sm">Войти</a>
                                <span className="auth-separator hide-sm">/</span>
                                <a href="/register" className="auth text hide-sm">Зарегистрироваться</a>
                            </>
                        ) : (
                            <div className="user-block hide-sm">
                                <a href="/account" className="auth text user-name">{user}</a>
                                <button type="button" onClick={logout} className="auth logout-btn">
                                    <MdLogout className="icon"/>
                                </button>
                            </div>
                        )}
                        <button
                            className="burger-btn show-sm"
                            onClick={() => setDrawerOpen(true)}
                            aria-label="Open menu"
                        >
                            <GiHamburgerMenu/>
                        </button>
                    </div>
                </div>
            </nav>
            <div className={`mobile-drawer ${drawerOpen ? "active" : ""}`}>
                <button className="close-icon text" onClick={() => setDrawerOpen(false)}>
                    <RxCross2/>
                </button>
                <div className="mobile-menu">
                    <ul>
                        <li>
                            <SearchBar
                                onSearch={() => {}}
                                doSearch={(value) => {
                                    search(value);
                                    setDrawerOpen(false);
                                }}
                            />
                        </li>
                        {user ? (
                            <>
                                <li><a href="/account">{user}</a></li>
                                <li><button onClick={() => { logout(); setDrawerOpen(false); }}>Выйти</button></li>
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
}
