import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [codeMessage, setCodeMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverVerificationCode, setServerVerificationCode] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [buttonLabel, setButtonLabel] = useState('Send Code');

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0 && isCodeSent) {
      setButtonLabel('Send Code'); 
      setIsCodeSent(false); 
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setEmailMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/user/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        setServerVerificationCode(data.verificationCode);
        setEmailMessage({ text: 'Verification code sent successfully!', type: 'success' });
        setIsCodeSent(true);
        setCountdown(60); 
      } else {
        const errorData = await response.json();
        setEmailMessage({ text: errorData.error || 'Failed to send verification code', type: 'error' });
      }
    } catch (error) {
      setEmailMessage({ text: 'Error sending verification code', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    if (String(verificationCode).trim() === String(serverVerificationCode).trim()) {
      setIsVerified(true);
      setCodeMessage({ text: 'Verification successful!', type: 'success' });
    } else {
      setCodeMessage({ text: 'Invalid verification code', type: 'error' });
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setPasswordMessage('');

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ text: 'Passwords do not match', type: 'error' });
      return;
    }

    if (!isVerified) {
      setCodeMessage({ text: 'Please verify your email before resetting your password', type: 'error' });
      return;
    }

    const response = await fetch('/api/user/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword }),
    });

    if (response.ok) {
      setPasswordMessage({ text: 'Password updated successfully!', type: 'success' });
    } else {
      const errorData = await response.json();
      setPasswordMessage({ text: errorData.error || 'Failed to update password', type: 'error' });
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Reset Your Password
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {emailMessage && (
                <span className={`text-sm mt-1 ${emailMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {emailMessage.text}
                </span>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="verificationCode" className="block text-sm font-medium leading-6 text-gray-900">
              Verification Code
            </label>
            <div className="mt-2 flex">
              <input
                id="verificationCode"
                name="verificationCode"
                type="text"
                onChange={(e) => setVerificationCode(e.target.value)}
                value={verificationCode}
                required
                className="flex-grow rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <button
                type="button"
                onClick={handleSendCode}
                disabled={isLoading || !email || isCodeSent}
                className="ml-2 bg-green-500 text-white px-3 py-1.5 rounded-md hover:bg-green-600"
              >
                {isCodeSent ? `Resend in ${countdown}` : buttonLabel}
              </button>
              <button
                type="button"
                onClick={handleVerifyCode}
                className="ml-2 bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600"
              >
                Verify
              </button>
            </div>
            {codeMessage && (
              <span className={`text-sm mt-1 ${codeMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {codeMessage.text}
              </span>
            )}
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium leading-6 text-gray-900">
              New Password
            </label>
            <div className="mt-2">
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">
              Confirm Password
            </label>
            <div className="mt-2">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            {passwordMessage && (
              <span className={`text-sm mt-1 ${passwordMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {passwordMessage.text}
              </span>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Confirm
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Remembered your password?{' '}
          <Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
