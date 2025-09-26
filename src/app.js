import {BrowserRouter as Router} from "react-router-dom";

import {AppRoutes} from "./route/routes";

export const  App = () => {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
}