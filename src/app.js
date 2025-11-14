import {BrowserRouter as Router, useLocation} from "react-router-dom";

import {AppRoutes} from "./route/routes";
import {Header} from "./components/Header";

import './static/styles/main.scss'

export const App = () => {

    return (
        <Router>
            <AppContent />
        </Router>
    );
}

const AppContent = () => {
    const location = useLocation();
    const hideHeaderPaths = ['/register', '/login'];
    const shouldShowHeader = !hideHeaderPaths.includes(location.pathname);

    return (
        <>
            {shouldShowHeader && <Header/>}
            <AppRoutes />
        </>
    );
}
