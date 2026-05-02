import { useLocation } from 'react-router-dom';
import LoginForm from '../../pages/Login/LoginForm';
import RegisterForm from '../../pages/Register/RegisterForm';

export default function AuthLayout() {
    const location = useLocation();
    const isRegisterPage = location.pathname === '/register';

    return isRegisterPage ? <RegisterForm /> : <LoginForm />;
}
