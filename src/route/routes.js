import {NotFound} from "../components/404";
import {useRoutes} from "react-router-dom";
import {Note} from "../pages/Note";
import {Authorization} from "../pages/Authorization";
import {User} from "../pages/User";
import {EditNote} from "../pages/EditNote";

export const AppRoutes = () => {
    return useRoutes([
        {
            path: '*',
            element: <NotFound />,
        },
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
            path: '/account',
            element: <User />
        },
        {
            path: '/note/:id',
            element: <EditNote />
        }
    ]);
}