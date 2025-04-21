import React, { useState } from 'react';
import backgroundImage from '../../../assets/loginPageImg.avif';
import logoImg from '@assets/logo-img.jpg';
import { supabase } from '@backend/services/supabaseClient';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  const handleLogin = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert('Login failed: ' + error.message);
    } else {
      const userId = data.user.id;
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (profileError) {
        navigate('/login');
      } else {
        const path = profile?.role === 'admin' ? '/admin-dashboard' : '/employee-dashboard';
        navigate(path || '/login');
      }
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen w-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-white/10 backdrop-blur-xs rounded-3xl shadow-2xl p-10 w-full max-w-md text-center border border-white/20">
        <div
          className="w-12 h-12 bg-cover bg-center rounded-full mx-auto mb-4 border-2 border-white"
          style={{ backgroundImage: `url(${logoImg})` }}
        ></div>
        <h1 className="text-blue-500 text-3xl font-semibold mb-4 tracking-wide">
          Employee Management
        </h1>
        <p className="text-white/70 text-sm mb-6">Login to your account</p>
        <form onSubmit={submitHandler} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
            autoComplete="current-password"
          />
          <button
            type="submit"
            className=" bg-gradient-to-r from-blue-500 to-blue-600 hover:to-blue-700 text-white font-bold py-3  rounded-lg shadow-md transition-transform hover:scale-105 duration-200"
          >
            Login
          </button>
          <div className="text-right text-white/60 text-sm hover:underline cursor-pointer">
            Forgot Password?
          </div>
        </form>
      </div>

     
    </div>
  );
};

export default LoginForm;
