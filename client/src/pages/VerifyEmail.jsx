import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { CheckCircle, XCircle, Mail } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await authAPI.verifyEmail(token);
      setStatus('success');
      setMessage(response.message);
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Email verification failed');
    }
  };

  if (status === 'loading') {
    return <LoadingSpinner text="Verifying your email..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            {status === 'success' ? (
              <>
                <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                <h2 className="mt-4 text-2xl font-bold text-gray-900">
                  Email Verified Successfully!
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  {message}
                </p>
                <div className="mt-6">
                  <Link
                    to="/login"
                    className="btn-primary w-full"
                  >
                    Continue to Login
                  </Link>
                </div>
              </>
            ) : (
              <>
                <XCircle className="mx-auto h-16 w-16 text-red-500" />
                <h2 className="mt-4 text-2xl font-bold text-gray-900">
                  Verification Failed
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  {message}
                </p>
                <div className="mt-6 space-y-3">
                  <Link
                    to="/resend-verification"
                    className="btn-primary w-full"
                  >
                    Resend Verification Email
                  </Link>
                  <Link
                    to="/login"
                    className="btn-secondary w-full"
                  >
                    Back to Login
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;