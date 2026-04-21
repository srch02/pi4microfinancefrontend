import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Heart, Mail, Lock, Eye, EyeOff, Loader2, Scan } from 'lucide-react';
import { CheckCircle } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recaptchaVerified) {
      alert('Please verify that you are not a robot');
      return;
    }
    
    setLoading(true);

    // Simulate JWT authentication
    setTimeout(() => {
      // In real app: call API, get JWT token, store in localStorage
      localStorage.setItem('auth_token', 'demo_jwt_token_' + Date.now());
      localStorage.setItem('user_data', JSON.stringify({
        id: 'M-12847',
        name: 'John Doe',
        email: formData.email,
        plan: 'COMFORT',
        group: 'Alpha-12',
      }));
      setLoading(false);
      navigate('/app');
    }, 1500);
  };

  const handleRecaptchaClick = () => {
    // Simulate reCAPTCHA verification after 1 second
    setTimeout(() => {
      setRecaptchaVerified(true);
    }, 1000);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
            <Heart className="w-8 h-8 text-white" fill="currentColor" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your Solidari-Health account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="bg-white rounded-2xl border-2 border-gray-200 p-6 mb-6">
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-0"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-0"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                <span className="text-gray-700">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-indigo-600 font-medium hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* reCAPTCHA */}
            <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-4">
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <button
                  type="button"
                  onClick={handleRecaptchaClick}
                  disabled={recaptchaVerified}
                  className={`w-7 h-7 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                    recaptchaVerified
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'bg-white border-gray-400 hover:border-indigo-600 cursor-pointer'
                  }`}
                >
                  {recaptchaVerified && <CheckCircle className="w-5 h-5 text-white" />}
                </button>

                {/* reCAPTCHA Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 font-medium mb-1">I'm not a robot</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <img 
                      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234285f4'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/%3E%3C/svg%3E"
                      alt="reCAPTCHA"
                      className="w-3 h-3"
                    />
                    <span>reCAPTCHA</span>
                  </div>
                </div>

                {/* reCAPTCHA Logo */}
                <div className="text-right flex-shrink-0">
                  <div className="bg-white rounded px-2 py-1 border border-gray-300">
                    <div className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                      <div className="w-3 h-3 bg-blue-600 rounded-sm flex items-center justify-center">
                        <span className="text-white text-[6px] font-bold">re</span>
                      </div>
                      <span className="text-[10px]">CAPTCHA</span>
                    </div>
                  </div>
                </div>
              </div>

              {recaptchaVerified && (
                <div className="mt-2 flex items-center gap-2 text-xs text-emerald-600">
                  <CheckCircle className="w-3 h-3" />
                  <span>Verified</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !recaptchaVerified}
              className={`w-full py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
                recaptchaVerified && !loading
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
            {!recaptchaVerified && (
              <p className="text-center text-xs text-gray-500 mt-2">
                Please complete the security verification above
              </p>
            )}
          </div>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-gradient-to-br from-indigo-50 via-white to-blue-50 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        {/* Facial Recognition Button */}
        <button
          onClick={() => navigate('/facial-recognition')}
          className="w-full bg-white border-2 border-indigo-200 text-indigo-700 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 mb-6"
        >
          <Scan className="w-5 h-5" />
          Sign in with Face Recognition
        </button>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/')}
              className="text-indigo-600 font-medium hover:underline"
            >
              Register now
            </button>
          </p>
        </div>

        {/* Demo Note */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-900">
            <strong>Demo Mode:</strong> Use any email and password to sign in. JWT authentication will be simulated.
          </p>
        </div>
      </div>
    </div>
  );
}