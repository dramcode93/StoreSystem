import React, { useState } from 'react';
import { Translate } from 'translate-easy';
import styles from './Login.module.css';
import axios from 'axios';
import Loading from '../Loading/Loading';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('https://wild-red-jackrabbit-hem.cyclic.app/api/auth/login', {
        email,
        password,
      });
      const token = response.data.token;

      // Store the token in local storage
      localStorage.setItem('token', token);

      // Redirect only after successful login
      window.location.href = '/home';
    } catch (error) {
      console.error('Error logging in:', error.message);
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.LoginContainer}>
        {loading && <div className='m-5 fs-3'><Loading /></div>}
        {!loading && (
          <>
             <form className={styles.LoginForm} onSubmit={handleSubmit}>
        <div className={styles.FormGroup}>
          <label htmlFor="email">
            <Translate>Email :</Translate>
          </label>
          <input
            type="email"
            id="email"
            value={email}
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.FormGroup}>
          <label htmlFor="password">
            <Translate>Password :</Translate>
          </label>
          <input
            type="password"
            id="password"
            value={password}
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <p className={styles.forgetPass}>
          <Translate>Forgot your password?</Translate>
        </p>
        <div className={styles.login}>
          <button type="submit" onClick={handleSubmit} disabled={loading}>
            {loading ? <Translate><Loading/></Translate> : <Translate>Login</Translate>}
          </button>
        </div>
      </form>
          </>
        )}
      </div>
  );
};

export default Login;
