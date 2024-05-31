import React, { useState } from 'react';
import '../style/Login.css';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLogin } from '../redux/state'; // Ensure the correct import path

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        setErrorMessage(error.message);
        return;
      }

      const loggedIn = await response.json();
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      navigate('/');
    } catch (error) {
      setErrorMessage('Login failed. Please try again later.');
      console.log('Login failed', error.message);
    }
  };

  return (
    <div className='login'>
      <div className='login_content'>
        <form onSubmit={handleSubmit} className='login_content_form'>
          {errorMessage && <p className="error_message">{errorMessage}</p>}
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className='btn' type='submit'>
            LOG IN
          </button>
        </form>
        <a href='/register'>Don't have an account? Sign Up Here</a>
      </div>
    </div>
  );
}

export default LoginPage;
