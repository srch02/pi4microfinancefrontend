import { QrCode } from 'lucide-react';

export function PharmacyQR() {
  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-2">Member Discount QR</h1>
      <p className="text-gray-600 mb-8">Show this at participating pharmacies for discounts</p>
      
      <div className="bg-white rounded-2xl border-4 border-indigo-600 p-8 mb-6">
        <div className="w-64 h-64 bg-gray-100 rounded-xl flex items-center justify-center mx-auto">
          <QrCode className="w-32 h-32 text-gray-400" />
        </div>
        <p className="text-sm text-gray-600 mt-4">Member ID: M-12847</p>
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-left">
        <p className="text-sm text-indigo-900 font-medium mb-2">Instructions:</p>
        <p className="text-sm text-indigo-700">
          Present this QR code at the pharmacy counter to receive your 15-20% member discount on medications.
        </p>
      </div>
    </div>
  );
}
