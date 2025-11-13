import { useState, useEffect } from 'react';
import StaffLayout from './StaffLayout';

export default function StaffCommunications() {
  const [activeTab, setActiveTab] = useState('messages');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    members: [],
    templates: [],
    reminders: [],
    sentMessages: [],
    statistics: {}
  });
  const [messageForm, setMessageForm] = useState({
    subject: '',
    content: '',
    template_id: '',
    channel: 'email'
  });

  // Fetch data when tab changes
  useEffect(() => {
    fetchCommunicationsData();
  }, [activeTab]);

  const fetchCommunicationsData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/staff/communications?tab=${activeTab}`, {
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Failed to fetch data');
      
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching communications data:', error);
      alert('Failed to load communications data');
    } finally {
      setLoading(false);
    }
  };

  const sendBulkMessage = async () => {
    if (selectedMembers.length === 0) {
      alert('Please select at least one member');
      return;
    }

    if (!messageForm.subject || !messageForm.content) {
      alert('Please fill in subject and content');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/staff/communications/send-bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
        },
        credentials: 'include',
        body: JSON.stringify({
          recipient_ids: selectedMembers,
          subject: messageForm.subject,
          content: messageForm.content,
          template_id: messageForm.template_id || null,
          channel: messageForm.channel
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send message');
      }

      alert(result.message || `Message sent successfully to ${selectedMembers.length} members`);
      
      // Reset form
      setSelectedMembers([]);
      setMessageForm({
        subject: '',
        content: '',
        template_id: '',
        channel: 'email'
      });
      
    } catch (error) {
      console.error('Error sending message:', error);
      alert(error.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (templateId) => {
    if (!templateId) {
      setMessageForm(prev => ({ ...prev, template_id: '' }));
      return;
    }

    const template = data.templates.find(t => t.id == templateId);
    if (template) {
      setMessageForm({
        subject: template.subject,
        content: template.content,
        template_id: template.id,
        channel: messageForm.channel
      });
    }
  };

  const createNewTemplate = async () => {
    const name = prompt('Enter template name:');
    if (!name) return;

    const subject = prompt('Enter template subject:');
    if (!subject) return;

    const content = prompt('Enter template content:');
    if (!content) return;

    try {
      const response = await fetch('/api/staff/communications/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
        },
        credentials: 'include',
        body: JSON.stringify({
          name,
          subject,
          content,
          type: 'email',
          category: 'general',
          variables: []
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create template');
      }

      alert('Template created successfully');
      fetchCommunicationsData(); // Refresh templates list
      setActiveTab('templates');
    } catch (error) {
      console.error('Error creating template:', error);
      alert(error.message || 'Failed to create template');
    }
  };

  const updateReminderSettings = async (reminderId, isActive) => {
    try {
      const response = await fetch('/api/staff/communications/reminder-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
        },
        credentials: 'include',
        body: JSON.stringify({
          reminders: [{
            id: reminderId,
            is_active: isActive
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update reminder settings');
      }

      // Refresh reminders data
      fetchCommunicationsData();
    } catch (error) {
      console.error('Error updating reminder settings:', error);
      alert('Failed to update reminder settings');
    }
  };

  if (loading && activeTab === 'messages' && data.members.length === 0) {
    return (
      <StaffLayout>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-white">Loading...</div>
          </div>
        </div>
      </StaffLayout>
    );
  }

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
                      {data.members.map((member) => (
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
                          <div className="flex-1">
                            <div className="text-white">{member.name}</div>
                            <div className="text-gray-400 text-sm">{member.email} • {member.membership}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-gray-400 text-sm">
                        {selectedMembers.length} members selected
                      </span>
                      <button
                        onClick={() => setSelectedMembers(data.members.map(m => m.id))}
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
                      <select 
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                        value={messageForm.template_id}
                        onChange={(e) => handleTemplateSelect(e.target.value)}
                      >
                        <option value="">Select Template</option>
                        {data.templates.map(template => (
                          <option key={template.id} value={template.id}>{template.name}</option>
                        ))}
                      </select>
                      
                      <select
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                        value={messageForm.channel}
                        onChange={(e) => setMessageForm(prev => ({ ...prev, channel: e.target.value }))}
                      >
                        <option value="email">Email</option>
                        <option value="sms">SMS</option>
                        <option value="both">Both Email & SMS</option>
                      </select>
                      
                      <input
                        type="text"
                        placeholder="Subject"
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                        value={messageForm.subject}
                        onChange={(e) => setMessageForm(prev => ({ ...prev, subject: e.target.value }))}
                      />
                      <textarea
                        placeholder="Message content..."
                        rows="6"
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white resize-none"
                        value={messageForm.content}
                        onChange={(e) => setMessageForm(prev => ({ ...prev, content: e.target.value }))}
                      ></textarea>
                      <button
                        onClick={sendBulkMessage}
                        disabled={selectedMembers.length === 0 || loading}
                        className="w-full bg-red-600 hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 rounded-lg transition-colors"
                      >
                        {loading ? 'Sending...' : `Send to ${selectedMembers.length} Members`}
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
                    <div className="text-2xl font-bold text-red-400">{data.statistics.payment_reminders_due || 0}</div>
                    <div className="text-gray-400 text-sm">Payment Reminders Due</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">{data.statistics.birthdays_today || 0}</div>
                    <div className="text-gray-400 text-sm">Birthdays Today</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400">{data.statistics.renewals_this_week || 0}</div>
                    <div className="text-gray-400 text-sm">Renewals This Week</div>
                  </div>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-3">Automated Reminders</h4>
                  <div className="space-y-2">
                    {data.reminders.map(reminder => (
                      <label key={reminder.id} className="flex items-center justify-between">
                        <div>
                          <span className="text-white">{reminder.name}</span>
                          <span className="text-gray-400 text-sm ml-2">({reminder.trigger_event})</span>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={reminder.is_active}
                          onChange={(e) => updateReminderSettings(reminder.id, e.target.checked)}
                          className="rounded bg-gray-800" 
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Templates Tab */}
            {activeTab === 'templates' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-white font-semibold">Message Templates</h4>
                  <button 
                    onClick={createNewTemplate}
                    className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg"
                  >
                    Create New Template
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.templates.map(template => (
                    <div key={template.id} className="bg-gray-700 rounded-lg p-4">
                      <h5 className="text-white font-semibold mb-2">{template.name}</h5>
                      <p className="text-gray-400 text-sm mb-3">{template.subject}</p>
                      <p className="text-gray-500 text-xs mb-2">{template.content}</p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-gray-400 text-xs capitalize">{template.type} • {template.category}</span>
                        <div className="flex space-x-2">
                          <button className="text-red-400 hover:text-red-300 text-sm">Edit</button>
                          <button 
                            className="text-gray-400 hover:text-white text-sm"
                            onClick={() => {
                              setActiveTab('messages');
                              handleTemplateSelect(template.id);
                            }}
                          >
                            Use
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                <h4 className="text-white font-semibold">Sent Messages History</h4>
                <div className="bg-gray-700 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-600">
                        <th className="px-4 py-2 text-left text-white">Subject</th>
                        <th className="px-4 py-2 text-left text-white">Recipients</th>
                        <th className="px-4 py-2 text-left text-white">Type</th>
                        <th className="px-4 py-2 text-left text-white">Channel</th>
                        <th className="px-4 py-2 text-left text-white">Sent At</th>
                        <th className="px-4 py-2 text-left text-white">Sender</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.sentMessages.map(message => (
                        <tr key={message.id} className="border-b border-gray-600">
                          <td className="px-4 py-2 text-white">{message.subject}</td>
                          <td className="px-4 py-2 text-gray-400">{message.recipient_count}</td>
                          <td className="px-4 py-2 text-gray-400 capitalize">{message.message_type}</td>
                          <td className="px-4 py-2 text-gray-400 capitalize">{message.channel}</td>
                          <td className="px-4 py-2 text-gray-400">{message.sent_at}</td>
                          <td className="px-4 py-2 text-gray-400">{message.sender_name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}