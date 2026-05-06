import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, CheckCircle, ShieldCheck, Check, X } from 'lucide-react';

export function CreateAccount() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecial: false,
  });

  const validatePassword = (password: string) => {
    setPasswordValidation({
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const handlePasswordChange = (password: string) => {
    setFormData({ ...formData, password });
    validatePassword(password);
  };

  const handleRecaptchaClick = () => {
    setTimeout(() => {
      setRecaptchaVerified(true);
    }, 1000);
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!recaptchaVerified) {
      alert('Please verify that you are not a robot');
      return;
    }

    if (!isPasswordValid) {
      alert('Please ensure your password meets all requirements');
      return;
    }

    if (!passwordsMatch) {
      alert('Passwords do not match');
      return;
    }

    // Store account credentials
    const accountData = {
      username: formData.username,
      email: formData.email,
      password: formData.password, // In real app, this would be hashed
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem('account_credentials', JSON.stringify(accountData));

    // Navigate to waiting for approval
    navigate('/waiting-approval');
  };
console.log({
  recaptchaVerified,
  isPasswordValid,
  passwordsMatch,
  username: formData.username,
  email: formData.email,
  passwordValidation,
});
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Create Your Account</h1>
            <p className="text-sm text-gray-600">Step 6 of 6 - Account Setup</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Success Message */}
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-emerald-900 mb-1">
                Payment Completed Successfully!
              </h2>
              <p className="text-sm text-emerald-700">
                Now let's set up your account credentials to access your member dashboard
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Account Information */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              Account Information
            </h2>

            <div className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Choose a username"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-0"
                    required
                    minLength={3}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 3 characters, will be visible to other members
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
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
                <p className="text-xs text-gray-500 mt-1">
                  We'll send important updates and notifications to this email
                </p>
              </div>
            </div>
          </div>

          {/* Password Setup */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-indigo-600" />
              Password Setup
            </h2>

            <div className="space-y-4">
              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    placeholder="Create a strong password"
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

              {/* Password Requirements */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Password must contain:</p>
                <div className="space-y-1">
                  <PasswordRequirement
                    met={passwordValidation.minLength}
                    text="At least 8 characters"
                  />
                  <PasswordRequirement
                    met={passwordValidation.hasUpperCase}
                    text="One uppercase letter (A-Z)"
                  />
                  <PasswordRequirement
                    met={passwordValidation.hasLowerCase}
                    text="One lowercase letter (a-z)"
                  />
                  <PasswordRequirement
                    met={passwordValidation.hasNumber}
                    text="One number (0-9)"
                  />
                  <PasswordRequirement
                    met={passwordValidation.hasSpecial}
                    text="One special character (!@#$%^&*)"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Re-enter your password"
                    className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:ring-0 ${
                      formData.confirmPassword && !passwordsMatch
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 focus:border-indigo-600'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formData.confirmPassword && (
                  <p className={`text-sm mt-2 flex items-center gap-2 ${
                    passwordsMatch ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {passwordsMatch ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Passwords match
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4" />
                        Passwords do not match
                      </>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* reCAPTCHA */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              Security Verification
            </h3>
            
            <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-6">
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <button
                  type="button"
                  onClick={handleRecaptchaClick}
                  disabled={recaptchaVerified}
                  className={`w-8 h-8 rounded border-2 flex items-center justify-center transition-all ${
                    recaptchaVerified
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'bg-white border-gray-400 hover:border-indigo-600 cursor-pointer'
                  }`}
                >
                  {recaptchaVerified && <CheckCircle className="w-6 h-6 text-white" />}
                </button>

                {/* reCAPTCHA Text */}
                <div className="flex-1">
                  <p className="text-gray-900 font-medium mb-1">I'm not a robot</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <img 
                      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234285f4'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/%3E%3C/svg%3E"
                      alt="reCAPTCHA"
                      className="w-4 h-4"
                    />
                    <span>reCAPTCHA</span>
                    <a href="#" className="text-blue-600 hover:underline">Privacy</a>
                    <span>-</span>
                    <a href="#" className="text-blue-600 hover:underline">Terms</a>
                  </div>
                </div>

                {/* reCAPTCHA Logo */}
                <div className="text-right">
                  <div className="bg-white rounded px-2 py-1 border border-gray-300">
                    <div className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                      <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
                        <span className="text-white text-[8px] font-bold">re</span>
                      </div>
                      <span>CAPTCHA</span>
                    </div>
                  </div>
                </div>
              </div>

              {recaptchaVerified && (
                <div className="mt-3 flex items-center gap-2 text-sm text-emerald-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Verified successfully</span>
                </div>
              )}
            </div>

            <p className="text-xs text-gray-500 mt-3">
              This site is protected by reCAPTCHA to prevent automated submissions
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!recaptchaVerified || !isPasswordValid || !passwordsMatch || !formData.username || !formData.email}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
              recaptchaVerified && isPasswordValid && passwordsMatch && formData.username && formData.email
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Create Account & Complete Registration
          </button>
          {(!recaptchaVerified || !isPasswordValid || !passwordsMatch) && (
            <p className="text-center text-sm text-gray-500 mt-2">
              Please complete all requirements above
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className={`flex items-center gap-2 text-sm ${met ? 'text-emerald-600' : 'text-gray-500'}`}>
      {met ? (
        <Check className="w-4 h-4" />
      ) : (
        <X className="w-4 h-4" />
      )}
      <span>{text}</span>
    </div>
  );
}
