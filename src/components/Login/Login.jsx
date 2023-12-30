// Login.js
import React, { useState } from 'react';
import {Translate } from "translate-easy";
import styles from "./Login.module.css"
import axios from 'axios';
 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://storesystemapi.onrender.com/api/auth/login', {
        email,
        password,
      });
      const token = response.data.token;

      // Store the token in local storage
      localStorage.setItem('token', token);
      window.location.href='/home'

      console.log('Note saved:', response.data);
    } catch (error) {
      console.error('Error saving note:', error.message);
    }
  };


  return (
    <div className={styles.LoginContainer}>
    <form className={styles.LoginForm} onSubmit={handleSubmit}>
      <div className={styles.FormGroup}>
        <label htmlFor="username">
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
        <Translate>password :</Translate>  
      </label>
        <input
          type="password"
          id="password"
          value={password}
          name="password"
          onChange={(e) => setPassword(e.target.value)} 
        />
      </div>
      <p className={styles.forgetPass}>
      <Translate>Are You Forget Password ? </Translate>
        </p>
      
      <div  className={styles.login}>
        <button type='submit' onClick={handleSubmit}>
      <Translate>Login   </Translate>
      </button>
      </div>
    </form>
  </div>
  );
};

export default Login;

