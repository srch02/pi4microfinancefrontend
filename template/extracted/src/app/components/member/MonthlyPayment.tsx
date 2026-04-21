import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, DollarSign, Users, Building2, Smartphone, CheckCircle, Shield, TrendingUp, Wallet } from 'lucide-react';

export function MonthlyPayment() {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [complete, setComplete] = useState(false);

  const monthlyPremium = 23; // Total premium
  const poolSplit = {
    solidarityPool: Math.round(monthlyPremium * 0.7), // 70%
    nationalFund: Math.round(monthlyPremium * 0.2), // 20%
    platform: Math.round(monthlyPremium * 0.1), // 10%
  };

  const paymentMethods = [
    { id: 'd17', name: 'D17 Mobile Money', icon: Smartphone, color: 'orange' },
    { id: 'ooredoo', name: 'Ooredoo Money', icon: Smartphone, color: 'red' },
    { id: 'bank', name: 'Bank Transfer', icon: Building2, color: 'blue' },
    { id: 'wallet', name: 'Platform Wallet', icon: Wallet, color: 'purple' },
  ];

  const handlePayment = () => {
    if (!selectedMethod) return;
    
    setProcessing(true);
    
    // Simulate payment processing + Hedera blockchain logging
    setTimeout(() => {
      setProcessing(false);
      setComplete(true);
      
      // Simulate Hedera transaction
      const hederaTxId = 'HCS-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      console.log('Hedera Transaction ID:', hederaTxId);
      
      // Update KPI dashboard (simulated)
      setTimeout(() => {
        navigate('/app');
      }, 2500);
    }, 2500);
  };

  if (complete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-[scale-in_0.5s_ease-out]">
            <CheckCircle className="w-16 h-16 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          <div className="bg-white rounded-2xl border-2 border-emerald-200 p-6 mb-6">
            <p className="text-emerald-900 mb-3">
              <strong>{monthlyPremium} DT</strong> processed successfully
            </p>
            <div className="text-left space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Solidarity Pool (70%)</span>
                <span className="font-semibold text-gray-900">{poolSplit.solidarityPool} DT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">National Fund (20%)</span>
                <span className="font-semibold text-gray-900">{poolSplit.nationalFund} DT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Platform (10%)</span>
                <span className="font-semibold text-gray-900">{poolSplit.platform} DT</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-emerald-200">
              <p className="text-xs text-emerald-700">
                ✓ Logged to Hedera blockchain
              </p>
            </div>
          </div>
          <p className="text-gray-600">Your next payment is due March 1, 2024</p>
        </div>
      </div>
    );
  }

  if (processing) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-indigo-200 rounded-full" />
            <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className="w-10 h-10 text-indigo-600" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Payment</h2>
          <p className="text-gray-600 mb-4">Securing transaction on Hedera blockchain...</p>
          <div className="max-w-xs mx-auto space-y-2 text-sm text-left">
            <div className="flex items-center gap-2 text-emerald-600">
              <CheckCircle className="w-4 h-4" />
              <span>Payment verified</span>
            </div>
            <div className="flex items-center gap-2 text-blue-600">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span>Logging to Hedera...</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
              <span>Updating KPI dashboard</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/app')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Monthly Premium Payment</h1>
        <p className="text-gray-600">Pay your February 2024 contribution</p>
      </div>

      {/* Premium Breakdown */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 text-white mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-indigo-100 mb-1">Total Premium</p>
            <p className="text-4xl font-bold">{monthlyPremium} DT</p>
          </div>
          <DollarSign className="w-12 h-12 opacity-50" />
        </div>

        {/* 70/20/10 Split Visualization */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Solidarity Pool (70%)
              </span>
              <span className="font-semibold">{poolSplit.solidarityPool} DT</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div className="bg-emerald-400 h-2 rounded-full" style={{ width: '70%' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                National Fund (20%)
              </span>
              <span className="font-semibold">{poolSplit.nationalFund} DT</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div className="bg-blue-400 h-2 rounded-full" style={{ width: '20%' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Platform Operations (10%)
              </span>
              <span className="font-semibold">{poolSplit.platform} DT</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div className="bg-purple-400 h-2 rounded-full" style={{ width: '10%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Split Details Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 text-center">
          <Users className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-emerald-900">{poolSplit.solidarityPool}</p>
          <p className="text-xs text-emerald-700">Your Group Pool</p>
        </div>
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-center">
          <Shield className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-blue-900">{poolSplit.nationalFund}</p>
          <p className="text-xs text-blue-700">National Fund</p>
        </div>
        <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 text-center">
          <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-purple-900">{poolSplit.platform}</p>
          <p className="text-xs text-purple-700">Platform</p>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Select Payment Method</h3>
        <div className="space-y-3">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            const isSelected = selectedMethod === method.id;
            
            return (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  method.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                  method.color === 'red' ? 'bg-red-100 text-red-600' :
                  method.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="flex-1 text-left font-medium text-gray-900">{method.name}</span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'
                }`}>
                  {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Blockchain Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-900 mb-1">
              Secured by Hedera Blockchain
            </p>
            <p className="text-sm text-blue-700">
              Your payment will be logged to the Hedera Consensus Service for transparent audit trail and fraud prevention.
            </p>
          </div>
        </div>
      </div>

      {/* Pay Button */}
      <button
        onClick={handlePayment}
        disabled={!selectedMethod}
        className={`w-full py-4 rounded-xl font-semibold text-lg transition-colors ${
          selectedMethod
            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Pay {monthlyPremium} DT Now
      </button>
    </div>
  );
}
