import React, { useState } from 'react';
import './UserLogin.css'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useStockContext } from '../Context/Context';

export function UserLogin() {

  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setIsLoggedIn, setContext, Context } = useStockContext()
 
  const onLogin = (data) => {
    setContext(prev => ({
      ...prev,
      UserName: data.username,
    }));
    setIsLoggedIn(true)
    navigate('/')
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/auth/', {
        username: user,
        password,
      });

      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      localStorage.setItem('username', res.data.username);
      onLogin(res.data);  

    } catch (err) {
      alert('Login failed!');
    }

    
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <label>User</label>
        <input
          name='username'
          type="username"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          name='password'
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
