import { useContext, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../UserContext';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import GoogleLoginButton from '../components/GoogleLoginButton'; 

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    const storedEmail = localStorage.getItem('rememberedEmail');
    const storedPass = localStorage.getItem('rememberedpass');
    if (storedEmail) {
      setEmail(storedEmail);
      setPassword(storedPass);
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email address is invalid';
    }

    // Password validation
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function loginUser(ev) {
    ev.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Custom admin credentials
    const adminEmail = 'admin@example.com'; //for admin login Email
    const adminPassword = 'Admin@123'; //for admin login Password

    // Check for admin login
    if (email === adminEmail && password === adminPassword) {
      Swal.fire({
        title: 'Admin Login',
        text: 'Welcome, Admin!',
        icon: 'success',
        timer: 1000,
        timerProgressBar: true,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
      });
      const adminUser = {
        email,
        isAdmin: true,
      };
    
      localStorage.setItem('user', JSON.stringify(adminUser)); // Save admin flag
      setRedirect('/admin');
      return;

      // setRedirect('/admin');
      // return;
    }else{
      
    try {
      const { data } = await axios.post('/login', { email, password });
      setUser(data);
      Swal.fire({
        title: 'Success!',
        text: 'Login Successful',
        icon: 'success',
        confirmButtonText: 'OK',
        timer: 1000,
        timerProgressBar: true,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
      });

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedpass', password);
      } else {
        localStorage.removeItem('rememberedEmail',email);
        localStorage.removeItem('rememberedpass', password);
      }

      setRedirect('/');
    } catch (e) {
      Swal.fire({
        title: 'Error!',
        text: 'Login Failed',
        icon: 'error',
        confirmButtonText: 'OK',
        timer: 1000,
        timerProgressBar: true,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
      });
    }
    }

  }
  

  if (redirect) {
    localStorage.setItem("userEmail", email);
    return <Navigate to={redirect} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex w-full h-full lg:ml-24 px-10 py-10 justify-between place-items-center mt-20"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white w-full sm:w-full md:w-1/2 lg:w-1/3 px-7 py-7 rounded-xl justify-center align-middle"
      >
        <form className="flex flex-col w-auto items-center" onSubmit={loginUser}>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="px-3 font-extrabold mb-5 text-primarydark text-2xl"
          >
            Sign In
          </motion.h1>

          {/* Email Input */}
          <motion.div className="input">
            <input
              type="email"
              placeholder="Email"
              className="input-et"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
            />
            {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
          </motion.div>

          {/* Password Input with Toggle Icon */}
          <motion.div className="input relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="input-et pr-10" // Add padding for the icon
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            />
            {/* Toggle Password Visibility Icon */}
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
            </button>
            {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}
          </motion.div>

          {/* Remember Me and Forgot Password */}
          <div className="flex w-full h-full mt-4 justify-between px-1">
            <div className="flex gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe((prev) => !prev)}
              />
              Remember Me
            </div>
            <div>
              <Link to={'/forgotpassword'}>Forgot Password?</Link>
            </div>
          </div>

          {/* Submit Button */}
          <motion.div whileTap={{ scale: 0.95 }} className="w-full py-4">
            <button type="submit" className="primary w-full">
              Sign in
            </button>
          </motion.div>
          
          {/* google login component */}
          <GoogleLoginButton />

          {/* Navigation Links */}
          <div className="container2">
            <motion.div
              className="w-full h-full p-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to={'/login'}>
                <button className="text-white cursor-pointer rounded w-full h-full bg-primary font-bold">
                  LogIn
                </button>
              </Link>
            </motion.div>
            <motion.div
              className="w-full h-full p-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to={'/register'}>
                <button className="text-black cursor-pointer rounded w-full h-full font-bold">
                  SignUp
                </button>
              </Link>

              
            </motion.div>
          </div>

          {/* Back Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to={'/'}>
              <button className="secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Back
              </button>
            </Link>
          </motion.div>
        </form>
      </motion.div>

      {/* Right Side - Image and Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex flex-col right-box"
      >
        <Link to={'/'}>
          <div className="flex flex-col -ml-96 gap-3">
            <div className="text-3xl font-black">Welcome to</div>
            <div>
              <img src="../src/assets/logo.png" alt="" className="w-48" />
            </div>
          </div>
          <div className="-ml-48 w-80 mt-12">
            <img src="../src/assets/signinpic.svg" alt="" className="w-full" />
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}