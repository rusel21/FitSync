import { useState } from 'react';
import StaffLayout from './StaffLayout';

export default function StaffScheduling() {
  const [activeView, setActiveView] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const classes = [
    { id: 1, name: 'Yoga Basics', trainer: 'Emma Wilson', time: '07:00 - 08:00', capacity: 15, booked: 12, day: 'monday' },
    { id: 2, name: 'HIIT Training', trainer: 'Mike Chen', time: '08:30 - 09:30', capacity: 20, booked: 18, day: 'monday' },
    { id: 3, name: 'Spin Class', trainer: 'Sarah Johnson', time: '17:00 - 18:00', capacity: 25, booked: 22, day: 'monday' },
    { id: 4, name: 'Pilates', trainer: 'Lisa Brown', time: '18:30 - 19:30', capacity: 12, booked: 10, day: 'tuesday' },
  ];

  const trainers = [
    { id: 1, name: 'Emma Wilson', specialization: 'Yoga & Pilates', availability: 'Mon, Wed, Fri' },
    { id: 2, name: 'Mike Chen', specialization: 'HIIT & Strength', availability: 'Mon, Tue, Thu' },
    { id: 3, name: 'Sarah Johnson', specialization: 'Cardio & Spin', availability: 'Tue, Thu, Sat' },
    { id: 4, name: 'Lisa Brown', specialization: 'Pilates & Stretch', availability: 'Mon, Wed, Fri' },
  ];

  const pendingBookings = [
    { id: 1, member: 'John Doe', class: 'Yoga Basics', date: '2024-01-15', time: '07:00', status: 'pending' },
    { id: 2, member: 'Jane Smith', class: 'HIIT Training', date: '2024-01-15', time: '08:30', status: 'pending' },
  ];

  return (
    <StaffLayout>
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Scheduling System</h1>
        <p className="text-gray-400">Manage class schedules, trainer availability, and member bookings</p>
      </div>

      {/* View Toggle */}
      <div className="flex space-x-4 mb-6">
        {['calendar', 'classes', 'trainers', 'bookings'].map((view) => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
              activeView === view
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {view}
          </button>
        ))}
      </div>

      {/* Calendar View */}
      {activeView === 'calendar' && (
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Class Schedule</h2>
            <button className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg">
              Add New Class
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-4 mb-6">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="text-center text-white font-semibold py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {classes.map((classItem) => (
              <div key={classItem.id} className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-semibold">{classItem.name}</h3>
                    <p className="text-gray-400 text-sm">{classItem.trainer} • {classItem.time}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-white">{classItem.booked}/{classItem.capacity}</div>
                      <div className="text-gray-400 text-sm">Booked</div>
                    </div>
                    <button className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm">
                      Manage
                    </button>
                  </div>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${(classItem.booked / classItem.capacity) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trainers View */}
      {activeView === 'trainers' && (
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Trainer Management</h2>
            <button className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg">
              Add New Trainer
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trainers.map((trainer) => (
              <div key={trainer.id} className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">{trainer.name}</h3>
                <p className="text-gray-400 text-sm mb-2">{trainer.specialization}</p>
                <p className="text-gray-500 text-xs mb-3">Available: {trainer.availability}</p>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-red-600 hover:bg-red-500 text-white py-1 rounded text-sm">
                    Schedule
                  </button>
                  <button className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-1 rounded text-sm">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bookings View */}
      {activeView === 'bookings' && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Pending Bookings</h2>
          
          <div className="space-y-4">
            {pendingBookings.map((booking) => (
              <div key={booking.id} className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-semibold">{booking.member}</h3>
                    <p className="text-gray-400 text-sm">
                      {booking.class} • {booking.date} at {booking.time}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-sm">
                      Approve
                    </button>
                    <button className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm">
                      Deny
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pendingBookings.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No pending bookings at the moment
            </div>
          )}
        </div>
      )}
    </div>
    </StaffLayout>
  );
}