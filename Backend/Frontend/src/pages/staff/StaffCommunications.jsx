import { useState } from 'react';
import StaffLayout from './StaffLayout';
export default function StaffCommunications() {
  const [activeTab, setActiveTab] = useState('messages');
  const [selectedMembers, setSelectedMembers] = useState([]);

  const members = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1234567890', membership: 'Premium' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+1234567891', membership: 'Basic' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '+1234567892', membership: 'Premium' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', phone: '+1234567893', membership: 'Standard' },
  ];

  const templates = [
    { id: 1, name: 'Payment Reminder', subject: 'Payment Due Reminder', content: 'Dear {name}, your payment for {membership} plan is due on {date}.' },
    { id: 2, name: 'Birthday Greeting', subject: 'Happy Birthday!', content: 'Happy Birthday {name}! Enjoy a free protein shake on us!' },
    { id: 3, name: 'Renewal Reminder', subject: 'Membership Renewal', content: 'Dear {name}, your membership will expire on {date}. Renew now to continue your fitness journey.' },
  ];

  const sendBulkMessage = () => {
    // Implementation for sending bulk messages
    alert(`Message sent to ${selectedMembers.length} members`);
    setSelectedMembers([]);
  };

  return (
    <StaffLayout>
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Communications Center</h1>
        <p className="text-gray-400">Manage all member communications, reminders, and notifications</p>
      </div>

      {/* Tabs */}
      <div className="bg-gray-800 rounded-lg mb-6">
        <div className="flex border-b border-gray-700">
          {['messages', 'reminders', 'templates', 'history'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-red-400 border-b-2 border-red-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Member Selection */}
                <div className="bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Select Members</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {members.map((member) => (
                      <label key={member.id} className="flex items-center space-x-3 p-2 hover:bg-gray-600 rounded">
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(member.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedMembers([...selectedMembers, member.id]);
                            } else {
                              setSelectedMembers(selectedMembers.filter(id => id !== member.id));
                            }
                          }}
                          className="rounded border-gray-600 bg-gray-800 text-red-500"
                        />
                        <span className="text-white">{member.name}</span>
                        <span className="text-gray-400 text-sm">{member.membership}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-gray-400 text-sm">
                      {selectedMembers.length} members selected
                    </span>
                    <button
                      onClick={() => setSelectedMembers(members.map(m => m.id))}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Select All
                    </button>
                  </div>
                </div>

                {/* Message Composition */}
                <div className="bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Compose Message</h3>
                  <div className="space-y-4">
                    <select className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white">
                      <option>Select Template</option>
                      {templates.map(template => (
                        <option key={template.id} value={template.id}>{template.name}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Subject"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                    <textarea
                      placeholder="Message content..."
                      rows="6"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white resize-none"
                    ></textarea>
                    <button
                      onClick={sendBulkMessage}
                      disabled={selectedMembers.length === 0}
                      className="w-full bg-red-600 hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 rounded-lg transition-colors"
                    >
                      Send to {selectedMembers.length} Members
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reminders Tab */}
          {activeTab === 'reminders' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-400">5</div>
                  <div className="text-gray-400 text-sm">Payment Reminders Due</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">2</div>
                  <div className="text-gray-400 text-sm">Birthdays Today</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400">8</div>
                  <div className="text-gray-400 text-sm">Renewals This Week</div>
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3">Automated Reminders</h4>
                <div className="space-y-2">
                  <label className="flex items-center justify-between">
                    <span className="text-white">Payment Due Reminders</span>
                    <input type="checkbox" defaultChecked className="rounded bg-gray-800" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-white">Birthday Greetings</span>
                    <input type="checkbox" defaultChecked className="rounded bg-gray-800" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-white">Membership Renewal Alerts</span>
                    <input type="checkbox" defaultChecked className="rounded bg-gray-800" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-white font-semibold">Message Templates</h4>
                <button className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg">
                  Create New Template
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map(template => (
                  <div key={template.id} className="bg-gray-700 rounded-lg p-4">
                    <h5 className="text-white font-semibold mb-2">{template.name}</h5>
                    <p className="text-gray-400 text-sm mb-3">{template.subject}</p>
                    <p className="text-gray-500 text-xs">{template.content}</p>
                    <div className="flex space-x-2 mt-3">
                      <button className="text-red-400 hover:text-red-300 text-sm">Edit</button>
                      <button className="text-gray-400 hover:text-white text-sm">Use</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </StaffLayout>
  );
}