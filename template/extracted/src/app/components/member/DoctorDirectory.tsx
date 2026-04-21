import { Star, MapPin, Phone } from 'lucide-react';

export function DoctorDirectory() {
  const doctors = [
    { id: 1, name: 'Dr. Mamadou Diop', specialty: 'General Medicine', rating: 4.8, location: 'Dakar', fee: 45, available: true },
    { id: 2, name: 'Dr. Aissatou Ndiaye', specialty: 'Pediatrics', rating: 4.9, location: 'Thiès', fee: 50, available: false },
    { id: 3, name: 'Dr. Omar Seck', specialty: 'Cardiology', rating: 4.7, location: 'Dakar', fee: 75, available: true },
  ];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Find a Doctor</h1>
      <p className="text-gray-600 mb-6">Book consultations with verified healthcare providers</p>

      {/* Search */}
      <div className="mb-6">
        <input
          type="search"
          placeholder="Search by specialty, name, or location..."
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-0"
        />
      </div>

      {/* Doctor Cards */}
      <div className="space-y-4">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-indigo-600">{doctor.name.split(' ')[1].charAt(0)}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{doctor.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{doctor.specialty}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>{doctor.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{doctor.location}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">{doctor.fee} DT</span>
                  {doctor.available && (
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Available Today</span>
                  )}
                </div>
              </div>
            </div>
            <button className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
              Book Consultation
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
