
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';
import ErrorBanner from '../components/ErrorBanner';
import { getApiErrorMessages } from '../utils/apiClient';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'Tenant'
  });
  const [errorMessages, setErrorMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessages([]);
    setLoading(true);

    try {
      await register(formData);
      alert('Account created successfully. You can sign in now.');
      navigate('/login');
    } catch (err) {
      setErrorMessages(getApiErrorMessages(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 text-center">
    </div>
  );
};


export default Register;