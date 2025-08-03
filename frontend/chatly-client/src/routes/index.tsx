import { createBrowserRouter } from 'react-router-dom';
import callBackRoutes from './callBackRoutes';
import Home from '../Home';
import Login from '../Login/Login';


const routes = createBrowserRouter([
    callBackRoutes,
  {
    path: '/',
    element: <Home/>,
  },
    {
    path: '/login',
    element: <Login/>,
  }
]);

export default routes;
 