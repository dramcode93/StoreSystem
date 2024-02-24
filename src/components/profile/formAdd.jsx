import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from '../Products/Products.module.css';
import { Translate } from 'translate-easy';
import MainComponent from './../Aside/MainComponent';
import LogOut from '../LogOut/LogOut';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

function FormAdd() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState(undefined);
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [role, setRole] = useState('user');
    const [token] = useState(Cookies.get('token'));
    const API_users = 'http://localhost:3030/api/users';
    const decodedToken = jwtDecode(token);

    const addUser = () => {
        axios.post(`${API_users}`, { name, email, password, passwordConfirmation, role }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                window.location.href = '/profile/Users';
            })
            .catch((error) => {
                console.error('Error updating product:', error);
            });
    };


    return (
        <div>
            <LogOut />
            <MainComponent />
            <div className={styles.updateCategoryContainer}>
                <h2><Translate>Add User</Translate></h2>
                <form>

                    <label htmlFor='name'><Translate> username :</Translate></label>
                    <input
                        type="text"
                        id='name'
                        value={name} required
                        onChange={(e) => setName(e.target.value)}
                    />
                    <label htmlFor='email'>
                        <Translate> Email :</Translate>
                    </label>
                    <input
                        id='email'
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {decodedToken.role === 'manager' &&
                        <select
                            name="role"
                            onChange={(e) => setRole(e.target.value)}
                            value={role}
                        >
                            <option selected disabled value='user'>
                                <Translate>user role</Translate>
                            </option>
                            <option value='manager'>
                                <Translate>manager</Translate>
                            </option>
                            <option value='admin'>
                                <Translate>admin</Translate>
                            </option>
                        </select>
                    }
                    <label htmlFor='password'>
                        <Translate> Password :</Translate>
                    </label>
                    <input
                        id='password'
                        type="password"
                        value={password}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label htmlFor='confirmPassword'>
                        <Translate> confirm Password :</Translate>
                    </label>
                    <input
                        id='confirmPassword'
                        type="password"
                        value={passwordConfirmation}
                        required
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                    />
                    <button type="button" onClick={addUser} className='mb-2'><Translate>Add</Translate></button>
                    <Link to='/profile/Users' className='btn bg-danger w-100' ><Translate>a Cancel</Translate></Link>
                </form>
            </div>
        </div>
    );
}

export default FormAdd;
