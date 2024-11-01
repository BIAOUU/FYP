import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState('');
  const [name, setName] = useState('');
  const [categoryPreferences, setCategoryPreferences] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [sendCodeMessage, setSendCodeMessage] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [serverVerificationCode, setServerVerificationCode] = useState(null);
  const [isVerified, setIsVerified] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  const handleSendCode = async () => {
    setIsSendingCode(true);
    setSendCodeMessage('');
    try {
      const response = await fetch('/api/user/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        setSendCodeMessage({ text: 'Verification code sent successfully!', type: 'success' });
        setServerVerificationCode(data.verificationCode);
      } else {
        const errorData = await response.json();
        setSendCodeMessage({ text: errorData.error || 'Failed to send code', type: 'error' });
      }
    } catch (error) {
      setSendCodeMessage({ text: 'Error sending code', type: 'error' });
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = () => {
    if (String(verificationCode).trim() === String(serverVerificationCode).trim()) {
      setIsVerified(true);
      alert('Verification successful!');
    } else {
      alert('Invalid verification code');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError({ text: 'Passwords do not match', type: 'error' });
      return;
    }

    if (!isVerified) {
      setError({ text: 'Please verify your email before signing up', type: 'error' });
      return;
    }

    const user = { email, password, name, age, categoryPreferences };

    const response = await fetch('/api/user/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('User created:', data);
      setError({ text: 'Sign up successful!', type: 'success' });
      navigate('/login');
    } else {
      const errorData = await response.json();
      setError({ text: errorData.error, type: 'error' });
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign up for an account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {error && (
          <div className={`text-sm mt-2 ${error.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {error.text}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email address
            </label>
            <div className="mt-2 flex">
              <input
                id="email"
                name="email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
                autoComplete="email"
                className="flex-grow rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <button
                type="button"
                onClick={handleSendCode}
                disabled={isSendingCode || !email}
                className="ml-2 bg-green-500 text-white px-3 py-1.5 rounded-md hover:bg-green-600"
              >
                {isSendingCode ? 'Sending...' : 'Send Code'}
              </button>
            </div>
            {sendCodeMessage && (
              <p className={`text-sm mt-1 ${sendCodeMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {sendCodeMessage.text}
              </p>
            )}
          </div>

          {/* Verification code input and verification button */}
          {serverVerificationCode && (
            <div className="mt-4">
              <label htmlFor="verificationCode" className="block text-sm font-medium leading-6 text-gray-900">
                Enter Verification Code
              </label>
              <div className="mt-2 flex">
                <input
                  id="verificationCode"
                  name="verificationCode"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                  className="flex-grow rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Enter the code sent to your email"
                />
                <button
                  type="button"
                  onClick={handleVerifyCode}
                  className="ml-2 bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600"
                >
                  Verify
                </button>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
              Name
            </label>
            <div className="mt-2">
              <input
                id="name"
                name="name"
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="age" className="block text-sm font-medium leading-6 text-gray-900">
              Age
            </label>
            <div className="mt-2">
              <input
                id="age"
                name="age"
                type="number"
                onChange={(e) => setAge(e.target.value)}
                value={age}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium leading-6 text-gray-900">
              Confirm Password
            </label>
            <div className="mt-2">
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="categoryPreferences" className="block text-sm font-medium leading-6 text-gray-900">
              Category Preferences
            </label>
            <div className="mt-2">
              <select
                id="categoryPreferences"
                name="categoryPreferences"
                onChange={(e) => setCategoryPreferences([e.target.value])}
                value={categoryPreferences[0] || ''}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="" disabled>Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign up
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
