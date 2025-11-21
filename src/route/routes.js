import {NotFound} from "../components/404";
import {useNavigate, useRoutes} from "react-router-dom";
import {Note} from "../pages/Note";
import {Authorization} from "../pages/Authorization";
import {User} from "../pages/User";
import {EditNote} from "../pages/EditNote";
import {useEffect} from "react";
import {initNavigate} from "../core/api";

export const AppRoutes = () => {

    const navigate = useNavigate();

    useEffect(() => {
        initNavigate(navigate);
    }, []);

    return useRoutes([
        {
            path: '/',
            element: <Note />
        },
        {
            path: '/login',
            element: <Authorization />
        },
        {
            path: '/register',
            element: <Authorization />
        },
        {
            path: '/account/:page?',
            element: <User />
        },
        {
            path: '/note/:id',
            element: <EditNote />
        },
        {
            path: '*',
            element: <NotFound />,
        }
    ]);
}