import React, { useState } from 'react';
import backgroundImage from '@assets/bg-img.jpg';
import logoImg from '@assets/logo-img.jpg';
import { supabase } from '@backend/services/supabaseClient';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(email, '\n', password);
    handleLogin(email, password);
  };

  const handleLogin = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error: ', error.message);
      alert('Login failed: ' + error.message);
    } else {
      const userId = data.user.id;

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching roles: ', profileError.message);
        navigate('/login');
      } else {
        const path =
          profile?.role === 'admin' ? '/admin-dashboard' : '/employee-dashboard';
        console.log(
          `Directing to ${profile?.role === 'admin' ? 'admin' : 'emp'} page`
        );
        navigate(path || '/login');
      }
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen w-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-[#60A5FA] rounded-3xl shadow-lg w-full max-w-sm p-10 text-center">
        <div
          className="w-8 h-8 bg-cover bg-center bg-white rounded-md flex items-center justify-center mx-auto mb-6"
          style={{ backgroundImage: `url(${logoImg})` }}
        ></div>
        <h1 className="text-white text-2xl font-bold mb-8 tracking-tight">
          Employee Management System
        </h1>
        <form onSubmit={submitHandler}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 bg-white rounded-lg text-gray-600 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-gray-400"
            aria-label="email"
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-6 bg-white rounded-lg text-gray-600 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-gray-400"
            aria-label="Password"
            autoComplete="current-password"
          />
          <button
            type="submit"
            className="px-4 tracking-wide bg-[#FF6B6B] text-white py-3 rounded-lg font-semibold text-sm hover:bg-[#F56565] hover:scale-105 transition-all duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;