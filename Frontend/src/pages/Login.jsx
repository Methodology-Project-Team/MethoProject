import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, isAdminRole, isLandlordRole } from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);

      // Redirect based on user role
      if (isAdminRole()) {
        navigate('/admin', { replace: true });
      } else if (isLandlordRole()) {
        navigate('/landlord', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 text-center"></div>
  );
};

export default Login;