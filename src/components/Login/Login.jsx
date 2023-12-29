// Login.js
import React, { useState } from 'react';
import {Translate } from "translate-easy";
import styles from "./Login.module.css"
import axios from 'axios';
import { Link } from 'react-router-dom';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3030/api/auth/login', {
        email,
        password,
      });
      const token = response.data.token;

      // Store the token in local storage
      localStorage.setItem('token', token);

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
        <Link to='/home'>
      <Translate>Login   </Translate>
      </Link>
      </div>
    </form>
  </div>
  );
};

export default Login;

