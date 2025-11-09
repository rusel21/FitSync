import { useState } from 'react';
import StaffLayout from './StaffLayout';

export default function StaffReports() {
  const [reportType, setReportType] = useState('daily');
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const dailyStats = {
    attendance: 142,
    newMembers: 8,
    payments: 23,
    classes: 12,
    equipmentUsage: '78%'
  };

  const reportTemplates = [
    { id: 1, name: 'Daily Operations', description: 'Summary of daily gym activities' },
    { id: 2, name: 'Weekly Attendance', description: 'Weekly member attendance trends' },
    { id: 3, name: 'Equipment Usage', description: 'Equipment utilization and maintenance' },
    { id: 4, name: 'Member Satisfaction', description: 'Feedback and satisfaction metrics' },
  ];

  const generateReport = () => {
    // Implementation for generating reports
    alert(`Generating ${reportType} report for ${dateRange.start} to ${dateRange.end}`);
  };

  return (
    <StaffLayout>
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Operational Reports</h1>
        <p className="text-gray-400">Generate and analyze daily operational reports and metrics</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-400">{dailyStats.attendance}</div>
          <div className="text-gray-400 text-sm">Today's Attendance</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{dailyStats.newMembers}</div>
          <div className="text-gray-400 text-sm">New Members</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{dailyStats.payments}</div>
          <div className="text-gray-400 text-sm">Payments Processed</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{dailyStats.classes}</div>
          <div className="text-gray-400 text-sm">Classes Today</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">{dailyStats.equipmentUsage}</div>
          <div className="text-gray-400 text-sm">Equipment Usage</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Generator */}
        <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Generate Report</h2>
          
          <div className="space-y-4">
            {/* Report Type */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Report Type</label>
              <select 
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="daily">Daily Operations</option>
                <option value="weekly">Weekly Summary</option>
                <option value="attendance">Attendance Report</option>
                <option value="equipment">Equipment Usage</option>
                <option value="satisfaction">Member Satisfaction</option>
              </select>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Start Date</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">End Date</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                />
              </div>
            </div>

            {/* Additional Options */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Include</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="rounded bg-gray-700 border-gray-600 text-red-500 mr-2" />
                  <span className="text-white text-sm">Attendance Data</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="rounded bg-gray-700 border-gray-600 text-red-500 mr-2" />
                  <span className="text-white text-sm">Payment Information</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="rounded bg-gray-700 border-gray-600 text-red-500 mr-2" />
                  <span className="text-white text-sm">Class Schedules</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded bg-gray-700 border-gray-600 text-red-500 mr-2" />
                  <span className="text-white text-sm">Member Feedback</span>
                </label>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateReport}
              className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Generate Report
            </button>
          </div>
        </div>

        {/* Report Templates */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Reports</h2>
          <div className="space-y-3">
            {reportTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => setReportType(template.name.toLowerCase().replace(' ', ''))}
                className="w-full text-left bg-gray-700 hover:bg-gray-600 rounded-lg p-4 transition-colors"
              >
                <div className="text-white font-medium mb-1">{template.name}</div>
                <div className="text-gray-400 text-sm">{template.description}</div>
              </button>
            ))}
          </div>

          {/* Recent Reports */}
          <div className="mt-6">
            <h3 className="text-white font-semibold mb-3">Recent Reports</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Daily Ops - Today</span>
                <button className="text-red-400 hover:text-red-300">Download</button>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Weekly Summary - Jan 1-7</span>
                <button className="text-red-400 hover:text-red-300">Download</button>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Attendance - Dec 2024</span>
                <button className="text-red-400 hover:text-red-300">Download</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Preview Section */}
      <div className="mt-8 bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Report Preview</h2>
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="text-center text-gray-500 py-12">
            Select report parameters and click "Generate Report" to view preview
          </div>
        </div>
      </div>
    </div>
    </StaffLayout>
  );
}