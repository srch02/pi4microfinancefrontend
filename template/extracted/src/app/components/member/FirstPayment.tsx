import { useState } from 'react';
import { useNavigate } from 'react-router';
import { CheckCircle, CreditCard, Building2, Smartphone, Banknote } from 'lucide-react';

export function FirstPayment() {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const selectedPlan = localStorage.getItem('selected_plan') || 'COMFORT';
  const selectedGroupData = localStorage.getItem('selected_group');
  const selectedGroup = selectedGroupData ? JSON.parse(selectedGroupData) : null;
  
  const premiumAmount = selectedPlan === 'BASIC' ? 15 : selectedPlan === 'COMFORT' ? 23 : 35;

  const paymentMethods = [
    {
      id: 'd17',
      name: 'D17 Mobile Money',
      icon: Smartphone,
      color: 'orange',
      description: 'Instant payment via D17',
    },
    {
      id: 'ooredoo',
      name: 'Ooredoo Money',
      icon: Smartphone,
      color: 'red',
      description: 'Pay with Ooredoo Money',
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: Building2,
      color: 'blue',
      description: '2-3 business days',
    },
    {
      id: 'cash',
      name: 'Cash Deposit',
      icon: Banknote,
      color: 'emerald',
      description: 'At authorized agents',
    },
  ];

  const handlePayment = () => {
    if (selectedMethod) {
      setProcessing(true);
      // Simulate payment processing
      setTimeout(() => {
        setProcessing(false);
        setPaymentSuccess(true);
        
        // Redirect to create account page after success
        setTimeout(() => {
          navigate('/create-account');
        }, 2000);
      }, 3000);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          {/* Success Animation */}
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-[scale-in_0.5s_ease-out]">
            <CheckCircle className="w-16 h-16 text-emerald-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Solidari-Health!
          </h1>

          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 mb-6">
            <p className="text-emerald-900 mb-2">
              Your account is now active
            </p>
            <p className="text-sm text-emerald-700">
              Payment received • Plan: {selectedPlan}
            </p>
          </div>

          <p className="text-gray-600">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl border-2 border-emerald-200 p-6 mb-6">
            <div className="flex items-center gap-2 text-emerald-600 mb-3">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Application Approved!</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Complete Your First Payment
            </h1>
            
            {/* Plan Summary */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Plan</span>
                <span className="font-semibold text-gray-900">{selectedPlan}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Monthly Premium</span>
                <span className="text-2xl font-bold text-indigo-600">{premiumAmount} DT</span>
              </div>
            </div>

            {/* Group Summary */}
            {selectedGroup && (
              <div className="bg-indigo-50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-indigo-700">Solidarity Group</span>
                  <span className="text-xs bg-indigo-200 text-indigo-800 px-2 py-1 rounded-full font-medium">
                    {selectedGroup.matchScore}% Match
                  </span>
                </div>
                <p className="font-semibold text-indigo-900">{selectedGroup.name}</p>
                <p className="text-xs text-indigo-600 mt-1">{selectedGroup.members} members • {selectedGroup.location}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="max-w-md mx-auto w-full flex-1">
        <h2 className="font-semibold text-gray-900 mb-4">Select Payment Method</h2>
        
        <div className="space-y-3 mb-8">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            const isSelected = selectedMethod === method.id;
            
            return (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300 bg-white'
                }`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  method.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                  method.color === 'red' ? 'bg-red-100 text-red-600' :
                  method.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  'bg-emerald-100 text-emerald-600'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{method.name}</p>
                  <p className="text-sm text-gray-500">{method.description}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'
                }`}>
                  {isSelected && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={!selectedMethod || processing}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2 ${
            selectedMethod && !processing
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <CreditCard className="w-5 h-5" />
          {processing ? 'Processing...' : `Pay ${premiumAmount} DT Now`}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          Your payment is secure and encrypted. You can cancel anytime.
        </p>
      </div>
    </div>
  );
}