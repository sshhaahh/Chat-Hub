import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import {
  MessageSquare,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User as UserIcon,
  Loader,
  Loader2,
} from 'lucide-react';
import AuthImagePattern from '../components/AuthImagePattern';
import toast from 'react-hot-toast';

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', password: '', email: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const validateForm=()=>{
    if(!formData.name.trim()) return toast.error("Full Name is Required!")
    if(!formData.email.trim()) return toast.error("Email is Required!")
    if(!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Email format invalid")
    if(!formData.password.trim()) return toast.error("Password Name is Required!")
    if(formData.password.length<6) return toast.error("Password must be at least 6 character!")

      return true;

  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    const success=validateForm();
    if(success){
      signup(formData);
    }
    
    console.log(formData)
  };

  const { signup, isSigningup } = useAuthStore();

  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      {/* Left Side */}
      <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
        <div className='w-full max-w-md space-y-8'>
          <div className='text-center mb-8'>
            <div className='flex flex-col items-center gap-2 group'>
              <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                <MessageSquare className='size-6 text-primary' />
              </div>
              <h1 className='text-2xl font-bold mt-2'>Create Account</h1>
              <p className='text-base-content/60'>Get started with a free account.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Full Name */}
            <div className='form-control relative'>
              <label className='label'>
                <span className='label-text font-medium'>Full Name</span>
              </label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                placeholder='John Doe'
                className='input input-bordered w-full pl-10'
              />
              <UserIcon className='absolute left-3 top-[52%] text-gray-400 w-5 h-5' />
            </div>

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

            {/* Password */}
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

            <button
              type='submit'
              className='btn btn-primary w-full'
              disabled={isSigningup}
            >
              {isSigningup ? <Loader2 className='size-5 animate-spin'/> : 'Sign Up'}
            </button>
          </form>

          <div className='text-center mt-4 text-sm text-base-content/70'>
            Already have an account?{' '}
            <a href='/login' className='text-primary hover:underline font-medium'>
              Log in
            </a>
          </div>

        </div>
      </div>

      {/* right side */}

      <AuthImagePattern title="Join over Community" subtitle="connect with friends, share moments, and stay in touch with you."/>

    </div>
  );
};

export default SignupPage;
