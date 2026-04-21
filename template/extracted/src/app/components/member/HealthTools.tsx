import { useState } from 'react';
import { useNavigate } from 'react-router';
import { MessageSquare, Camera, Stethoscope, ArrowLeft, Send, Loader2, Sparkles, Pill } from 'lucide-react';

export function HealthTools() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'chatbot' | 'scanner' | 'doctors'>('chatbot');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'ai'; content: string }>>([
    { role: 'ai', content: 'Hello! I\'m your Solidari-Health AI assistant. How can I help you today?' },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessages = [
      ...chatMessages,
      { role: 'user' as const, content: inputMessage },
    ];
    setChatMessages(newMessages);
    setInputMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        'Based on your symptoms, I recommend consulting with a general practitioner. Would you like me to help you book an appointment?',
        'For mild headaches, try staying hydrated and resting. If symptoms persist for more than 3 days, please see a doctor.',
        'Your COMFORT plan covers this type of consultation. The member price would be 45 DT instead of the regular 60 DT.',
        'I can help you find nearby pharmacies that offer the 15% member discount. Would you like me to show you the list?',
      ];
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      setChatMessages([
        ...newMessages,
        { role: 'ai', content: randomResponse },
      ]);
    }, 1000);
  };

  const handleScanMedication = () => {
    setScanning(true);
    
    // Simulate medication image scanning with OCR + AI
    setTimeout(() => {
      setScanResult({
        name: 'Paracetamol 500mg',
        generic: 'Acetaminophen',
        price: 12,
        memberPrice: 10,
        alternatives: [
          { name: 'Panadol', price: 12, discount: '17%' },
          { name: 'Doliprane', price: 11, discount: '9%' },
        ],
        nearbyPharmacies: [
          { name: 'Pharmacie Centrale', distance: '0.8 km', stock: 'In stock' },
          { name: 'Pharmacie du Plateau', distance: '1.2 km', stock: 'In stock' },
        ],
      });
      setScanning(false);
    }, 2500);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <button
          onClick={() => navigate('/app')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Health Tools Hub</h1>
        
        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setActiveTab('chatbot')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'chatbot'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            AI Chatbot
          </button>
          <button
            onClick={() => {
              setActiveTab('scanner');
              setScanResult(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'scanner'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Camera className="w-4 h-4" />
            Med Scanner
          </button>
          <button
            onClick={() => setActiveTab('doctors')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'doctors'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            Doctors
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {/* AI Chatbot */}
        {activeTab === 'chatbot' && (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white border-2 border-indigo-200 text-gray-900'
                  }`}>
                    {msg.role === 'ai' && (
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs font-semibold text-indigo-600">AI Assistant</span>
                      </div>
                    )}
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about symptoms, medications, or coverage..."
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-0"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Medication Scanner */}
        {activeTab === 'scanner' && (
          <div className="p-6">
            {!scanResult && !scanning && (
              <div className="max-w-md mx-auto text-center">
                <div className="bg-white rounded-2xl border-2 border-dashed border-indigo-300 p-12 mb-6">
                  <Camera className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Scan Medication
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Take a photo of your medication box or prescription to get instant information and find cheaper alternatives
                  </p>
                  <button
                    onClick={handleScanMedication}
                    className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
                  >
                    <Camera className="w-5 h-5" />
                    Take Photo
                  </button>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-900">
                    <strong>AI-Powered:</strong> Our system uses OCR and AI to identify medications and suggest affordable generic alternatives.
                  </p>
                </div>
              </div>
            )}

            {scanning && (
              <div className="max-w-md mx-auto text-center">
                <div className="bg-white rounded-2xl border-2 border-indigo-200 p-12">
                  <Loader2 className="w-16 h-16 text-indigo-600 mx-auto mb-4 animate-spin" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Analyzing Medication...
                  </h3>
                  <div className="space-y-2 text-sm text-left max-w-xs mx-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                      <span className="text-gray-600">Image captured</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-2 h-2 text-indigo-600 animate-spin" />
                      <span className="text-gray-600">Running OCR...</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-300 rounded-full" />
                      <span className="text-gray-400">Finding alternatives</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {scanResult && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl border-2 border-emerald-200 p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <Pill className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{scanResult.name}</h3>
                      <p className="text-sm text-gray-600">Generic: {scanResult.generic}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Regular Price</p>
                      <p className="text-lg font-bold text-gray-900 line-through">{scanResult.price} DT</p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-3">
                      <p className="text-xs text-emerald-700 mb-1">Member Price</p>
                      <p className="text-lg font-bold text-emerald-900">{scanResult.memberPrice} DT</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Cheaper Alternatives</h4>
                  <div className="space-y-3">
                    {scanResult.alternatives.map((alt: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{alt.name}</p>
                          <p className="text-sm text-gray-600">Save {alt.discount}</p>
                        </div>
                        <p className="font-bold text-blue-600">{alt.price} DT</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Nearby Pharmacies</h4>
                  <div className="space-y-3">
                    {scanResult.nearbyPharmacies.map((pharmacy: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{pharmacy.name}</p>
                          <p className="text-sm text-gray-600">{pharmacy.distance}</p>
                        </div>
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                          {pharmacy.stock}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setScanResult(null);
                    setScanning(false);
                  }}
                  className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Scan Another Medication
                </button>
              </div>
            )}
          </div>
        )}

        {/* Doctors */}
        {activeTab === 'doctors' && (
          <div className="p-6">
            <p className="text-gray-600 text-center">
              Doctor consultations feature - see DoctorDirectory component
            </p>
            <button
              onClick={() => navigate('/app/doctors')}
              className="mx-auto mt-4 block bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              View Doctor Directory
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
