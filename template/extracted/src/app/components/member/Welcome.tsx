import { useNavigate } from 'react-router';
import { Heart, Shield, Users, TrendingUp } from 'lucide-react';

export function Welcome() {
  const navigate = useNavigate();

  const features = [
    { icon: Shield, title: 'Affordable Protection', desc: 'Starting at 10 DT/month' },
    { icon: Users, title: 'Solidarity Groups', desc: 'Pool resources with your community' },
    { icon: TrendingUp, title: 'Fair Pricing', desc: 'Personalized to your health profile' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Logo & Branding */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-full mb-4">
            <Heart className="w-10 h-10 text-white" fill="currentColor" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Solidari-Health</h1>
          <p className="text-xl text-gray-600">Protection for you and your group</p>
        </div>

        {/* Hero Illustration */}
        <div className="mb-8 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl p-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <Shield className="w-24 h-24 text-indigo-600" />
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" fill="currentColor" />
            </div>
          </div>
          <p className="text-sm text-indigo-700 font-medium">Family & community under protection</p>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-8">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={() => navigate('/verify-cin')}
          className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
        >
          Start Your Registration
        </button>

        <p className="text-sm text-gray-500 mt-4">
          Already a member?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-indigo-600 font-medium hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}