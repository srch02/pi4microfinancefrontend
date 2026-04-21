import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Check, Shield, Star, Zap, ArrowLeft } from 'lucide-react';

export function PlanSelection() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const basePrice = 17; // Personalized price

  const plans = [
    {
      id: 'basic',
      name: 'BASIC',
      price: basePrice,
      adjustment: 0,
      icon: Shield,
      color: 'indigo',
      features: [
        'Essential medical consultations',
        'Basic medication coverage',
        'Emergency care included',
        'Access to partner doctors',
        '70% of premium to solidarity pool',
      ],
    },
    {
      id: 'comfort',
      name: 'COMFORT',
      price: Math.round(basePrice * 1.35),
      adjustment: 35,
      icon: Star,
      color: 'blue',
      popular: true,
      features: [
        'All BASIC benefits',
        'Dental emergency coverage',
        'Lab test discounts (30%)',
        'Priority telemedicine',
        'Extended medication list',
      ],
    },
    {
      id: 'premium',
      name: 'PREMIUM',
      price: Math.round(basePrice * 1.6),
      adjustment: 60,
      icon: Zap,
      color: 'purple',
      features: [
        'All COMFORT benefits',
        'Unlimited telemedicine',
        'Specialist consultations',
        'Advanced diagnostics',
        'Premium pharmacy network',
      ],
    },
  ];

  const handleSelectPlan = (planName: string) => {
    setSelectedPlan(planName);
    localStorage.setItem('selected_plan', planName);
    
    // Show confirmation then proceed to group selection
    setTimeout(() => {
      navigate('/group-selection');
    }, 1500);
  };

  const getColorClasses = (color: string) => {
    const colors = {
      indigo: 'border-indigo-600 bg-indigo-50',
      blue: 'border-blue-600 bg-blue-50',
      purple: 'border-purple-600 bg-purple-50',
    };
    return colors[color as keyof typeof colors] || colors.indigo;
  };

  return (
    <div className="min-h-screen flex flex-col p-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/calculating')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Personalized Price</h1>
          <div className="inline-flex items-baseline gap-1 mb-2">
            <span className="text-5xl font-bold text-indigo-600">{basePrice}</span>
            <span className="text-2xl text-gray-600">DT/month</span>
          </div>
          <p className="text-gray-600">Based on your health profile</p>
        </div>
      </div>

      {/* Plans */}
      <div className="max-w-5xl mx-auto w-full flex-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isSelected = selectedPlan === plan.id;
            
            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl border-2 p-6 cursor-pointer transition-all hover:shadow-lg ${
                  isSelected ? getColorClasses(plan.color) : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-xs font-semibold">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                  plan.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                  plan.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  <Icon className="w-7 h-7" />
                </div>

                {/* Plan Name */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                
                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">DT/mo</span>
                  </div>
                  {plan.adjustment > 0 && (
                    <p className="text-sm text-gray-500">Base +{plan.adjustment}%</p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Select Button */}
                <button
                  className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {isSelected ? 'Selected' : 'Select Plan'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Fine Print */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-blue-900">
            <strong>Price Guarantee:</strong> Your monthly premium will stay stable for 12 months, regardless of health changes.
          </p>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleSelectPlan}
          disabled={!selectedPlan}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-colors ${
            selectedPlan
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue with {selectedPlan ? plans.find(p => p.id === selectedPlan)?.name : 'Selected'} Plan
        </button>
      </div>
    </div>
  );
}