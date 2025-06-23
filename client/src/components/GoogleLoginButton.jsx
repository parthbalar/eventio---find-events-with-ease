import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useContext } from 'react';
import { UserContext } from '../UserContext';

export default function GoogleLoginButton() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;

      // ✅ Send token to backend
      const { data } = await axios.post(
        'http://localhost:4000/api/auth/google',
        { token },
        { withCredentials: true }
      );

      // ✅ Backend already returns verified user info
      setUser(data.user);

      // ✅ Store minimal info if you want to persist across reloads
      localStorage.setItem('userEmail', data.user.email);
      localStorage.setItem('userName', data.user.name);
      localStorage.setItem('userPicture', data.user.picture);

      // ✅ Show success alert
      Swal.fire({
        title: 'Success!',
        text: 'Google Login Successful',
        icon: 'success',
        timer: 1000,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
      });

      navigate('/');
    } catch (err) {
      console.error('Google Login Error:', err);
      Swal.fire({
        title: 'Error!',
        text: 'Google Login Failed',
        icon: 'error',
        timer: 1000,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="my-3">
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={() => {
          Swal.fire({
            title: 'Error!',
            text: 'Google Login Failed',
            icon: 'error',
            timer: 1000,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
          });
        }}
      />
    </div>
  );
}
