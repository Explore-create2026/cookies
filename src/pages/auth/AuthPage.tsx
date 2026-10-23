import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../../lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { LogIn } from 'lucide-react';

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const isAdminLogin = searchParams.get('admin') === 'true';

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;

      // Check if user exists in Firestore
      const userRef = doc(db, 'users', fbUser.uid);
      const userSnap = await getDoc(userRef);

      let userData: any;
      
      if (userSnap.exists()) {
        userData = userSnap.data();
      } else {
        // Create new user record
        userData = {
          id: fbUser.uid,
          name: fbUser.displayName || 'New User',
          email: fbUser.email,
          role: isAdminLogin ? 'Admin' : 'Customer', // Simple assignment for preview
          createdAt: Date.now()
        };
        await setDoc(userRef, userData);
      }

      setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        createdAt: userData.createdAt
      });

      if (userData.role !== 'Customer') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-serif font-extrabold text-stone-900">
            {isAdminLogin ? 'Staff Portal Login' : 'Sign in to your account'}
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            Continue with Google to access your account
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="group relative w-full flex justify-center items-center gap-3 py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors disabled:opacity-50"
          >
            <LogIn size={20} />
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </button>
        </div>
      </div>
    </div>
  );
}
