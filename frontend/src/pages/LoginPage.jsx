import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, Mail, Lock, Loader2, MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AuthImagePattern from '../components/AuthImagePattern';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const { login, isLoggingIn } = useAuthStore();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error('Valid email is required!');
    if (!formData.password) return toast.error('Password is required!');

    login(formData);
  };

  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      {/* Left side*/}
      <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
        <div className='w-full max-w-md space-y-8'>
          <div className='text-center mb-8'>
            <div className='flex flex-col items-center gap-2 group'>
              <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                <MessageSquare className='size-6 text-primary' />
              </div>
              <h1 className='text-2xl font-bold mt-2'>Login to Your Account</h1>
              <p className='text-base-content/60'>Welcome back! Please enter your details.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Email */}
            <div className='form-control relative'>
              <label className='label'>
                <span className='label-text font-medium'>Email</span>
              </label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder='example@mail.com'
                className='input input-bordered w-full pl-10'
              />
              <Mail className='absolute left-3 top-[52%] text-gray-400 w-5 h-5' />
            </div>

            {/* Pass */}
            <div className='form-control relative'>
              <label className='label'>
                <span className='label-text font-medium'>Password</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name='password'
                value={formData.password}
                onChange={handleChange}
                placeholder='••••••••'
                className='input input-bordered w-full pl-10 pr-10'
              />
              <Lock className='absolute left-3 top-[52%] text-gray-400 w-5 h-5' />
              <span
                className='absolute right-3 top-[52%] cursor-pointer'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
              </span>
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              className='btn btn-primary w-full'
              disabled={isLoggingIn}
            >
              {isLoggingIn ? <Loader2 className='size-5 animate-spin' /> : 'Log In'}
            </button>
          </form>
        </div>
      </div>

      {/* Right side */}
      <AuthImagePattern title="Welcome Back" subtitle="connect with friends, share moments, and stay in touch with you."/>
    </div>
  );
};

export default LoginPage;
