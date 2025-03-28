import React, { useContext, useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import uploadImage from '../../utils/uploadImage';
import { UserContext } from '../../context/UserContext';

export const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  const handleSignup = async (e) => {
    e.preventDefault();
    let profileImageUrl = '';

    if (!fullName) {
      setError('Please enter your full name');
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }
    if (!password) {
      setError("Please enter the password");
      return;
    }
    setError("");

    try {
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || '';
      }
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, { fullName, email, password, profileImageUrl });

      const { token, user } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Try again");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="max-w-sm mx-auto h-auto md:h-full mt-5 md:mt-10 flex flex-col justify-center">
        <h3 className='text-lg md:text-xl font-semibold text-black'>Create an Account</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>Join us today by entering your details below</p>
        <form onSubmit={handleSignup} className="w-full">
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          <div className="grid md:grid-cols-2 gap-4">
            <Input className="w-full" value={fullName} onChange={({ target }) => setFullName(target.value)} label='Full Name' placeholder='John Doe' type='text' />
            <Input className="w-full" value={email} onChange={({ target }) => setEmail(target.value)} label="Email Address" placeholder="john@example.com" type="text" />
            <div className="col-span-2">
              <Input className="w-full" value={password} onChange={({ target }) => setPassword(target.value)} label="Password" placeholder="Min 8 characters" type="password" />
            </div>
          </div>
          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
          <button type='submit' className='w-full btn-primary'>Register</button>
          <p className='text-[13px] text-slate-800 mt-3'>
            Already have an account? {' '} <Link to='/login' className='font-medium text-primary underline'> Login here</Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}
