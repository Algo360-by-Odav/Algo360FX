import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function Callback() {
  const navigate = useNavigate();
  const { checkAuthState } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await checkAuthState();
        navigate('/dashboard');
      } catch (error) {
        console.error('Error handling callback:', error);
        navigate('/login');
      }
    };

    handleCallback();
  }, [navigate, checkAuthState]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Logging you in...</h2>
        <p className="text-gray-600">Please wait while we complete the authentication process.</p>
      </div>
    </div>
  );
}
