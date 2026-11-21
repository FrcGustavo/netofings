import { Route } from 'react-router-dom';
import Login from '../pages/Login';
import Signup from '../pages/Signup';

export const AuthRoutes = (
  <>
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
  </>
);
