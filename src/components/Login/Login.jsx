import React, { useState } from 'react';
import { Translate } from 'translate-easy';
import styles from './Login.module.css';
import axios from 'axios';
import Loading from '../Loading/Loading';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const Login = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3030/api/auth/login', {
        name,
        password,
      });
      const token = response.data.token;
      const tokenTime = 2
      Cookies.set('token', token, { expires: tokenTime, secure: true, sameSite: 'strict' })
      window.location.href = '/home';
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className={styles.LoginContainer}>
        {loading && <div className='m-5 fs-3'><Loading /></div>}
        {!loading && (
          <>
            <form className={styles.LoginForm} onSubmit={handleSubmit}>
              <div className={styles.FormGroup}>
                <label htmlFor="name">
                  <Translate>Username :</Translate>
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  name="name"
                  onChange={(e) => setName(e.target.value)}
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
              <Link to='forgotPassword1' className={styles.forgetPass}>
                <Translate>Forgot your password?</Translate>
              </Link>
              <div className={styles.login}>
                <button type="submit" onClick={handleSubmit} disabled={loading}>
                  {loading ? <Translate><Loading /></Translate> : <Translate>Login</Translate>}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;

