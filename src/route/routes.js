import {NotFound} from "../components/404";
import {useRoutes} from "react-router-dom";

export const AppRoutes = () => {
    return useRoutes([
        {
            path: '*',
            element: <NotFound />,
        },
        {
            path: '/',
            element: <NotFound/>,
        }
    ]);
}