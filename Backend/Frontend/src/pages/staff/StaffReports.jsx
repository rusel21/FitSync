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
    facilityUsage: '78%',
    memberSatisfaction: '4.8/5'
  };

  const reportTemplates = [
    { id: 1, name: 'Daily Operations', description: 'Summary of daily gym activities' },
    { id: 2, name: 'Weekly Attendance', description: 'Weekly member attendance trends' },
    { id: 3, name: 'Facility Usage', description: 'Facility and equipment utilization' },
    { id: 4, name: 'Member Satisfaction', description: 'Feedback and satisfaction metrics' },
    { id: 5, name: 'Payment Summary', description: 'Revenue and payment tracking' },
    { id: 6, name: 'Membership Growth', description: 'New member acquisition and retention' },
  ];

  const recentReports = [
    { id: 1, name: 'Daily Ops - Today', type: 'daily', generated: '2 hours ago', size: '1.2 MB' },
    { id: 2, name: 'Weekly Summary - Dec 15-21', type: 'weekly', generated: '1 day ago', size: '2.8 MB' },
    { id: 3, name: 'Monthly Attendance - Nov 2024', type: 'monthly', generated: '1 week ago', size: '4.5 MB' },
  ];

  const generateReport = () => {
    alert(`Generating ${reportType} report for ${dateRange.start} to ${dateRange.end}`);
  };

  const exportReport = (reportId) => {
    alert(`Exporting report ${reportId}`);
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
          <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
            <div className="text-2xl font-bold text-red-400">{dailyStats.attendance}</div>
            <div className="text-gray-400 text-sm">Today's Attendance</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
            <div className="text-2xl font-bold text-green-400">{dailyStats.newMembers}</div>
            <div className="text-gray-400 text-sm">New Members</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
            <div className="text-2xl font-bold text-blue-400">{dailyStats.payments}</div>
            <div className="text-gray-400 text-sm">Payments Processed</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
            <div className="text-2xl font-bold text-purple-400">{dailyStats.facilityUsage}</div>
            <div className="text-gray-400 text-sm">Facility Usage</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
            <div className="text-2xl font-bold text-yellow-400">{dailyStats.memberSatisfaction}</div>
            <div className="text-gray-400 text-sm">Satisfaction Rate</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Report Generator */}
          <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Generate Report</h2>
            
            <div className="space-y-4">
              {/* Report Type */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Report Type</label>
                <select 
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
                >
                  <option value="daily">Daily Operations</option>
                  <option value="weekly">Weekly Summary</option>
                  <option value="monthly">Monthly Overview</option>
                  <option value="attendance">Attendance Report</option>
                  <option value="facility">Facility Usage</option>
                  <option value="satisfaction">Member Satisfaction</option>
                  <option value="payments">Payment Summary</option>
                  <option value="membership">Membership Growth</option>
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
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">End Date</label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Additional Options */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Include Data</label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="rounded bg-gray-700 border-gray-600 text-red-500 mr-2 focus:ring-red-500" />
                    <span className="text-white text-sm">Attendance Data</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="rounded bg-gray-700 border-gray-600 text-red-500 mr-2 focus:ring-red-500" />
                    <span className="text-white text-sm">Payment Information</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="rounded bg-gray-700 border-gray-600 text-red-500 mr-2 focus:ring-red-500" />
                    <span className="text-white text-sm">Facility Usage</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded bg-gray-700 border-gray-600 text-red-500 mr-2 focus:ring-red-500" />
                    <span className="text-white text-sm">Member Feedback</span>
                  </label>
                </div>
              </div>

              {/* Format Selection */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Export Format</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input type="radio" name="format" defaultChecked className="text-red-500 bg-gray-700 border-gray-600 focus:ring-red-500" />
                    <span className="text-white text-sm ml-2">PDF</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="format" className="text-red-500 bg-gray-700 border-gray-600 focus:ring-red-500" />
                    <span className="text-white text-sm ml-2">Excel</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="format" className="text-red-500 bg-gray-700 border-gray-600 focus:ring-red-500" />
                    <span className="text-white text-sm ml-2">CSV</span>
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

          {/* Quick Reports & Recent */}
          <div className="space-y-6">
            {/* Quick Reports */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Reports</h2>
              <div className="space-y-3">
                {reportTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setReportType(template.name.toLowerCase().replace(' ', ''))}
                    className="w-full text-left bg-gray-700 hover:bg-gray-600 rounded-lg p-4 transition-colors border border-gray-600 hover:border-red-500"
                  >
                    <div className="text-white font-medium mb-1">{template.name}</div>
                    <div className="text-gray-400 text-sm">{template.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Reports */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-white font-semibold mb-3">Recent Reports</h3>
              <div className="space-y-3">
                {recentReports.map((report) => (
                  <div key={report.id} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                    <div>
                      <div className="text-white text-sm font-medium">{report.name}</div>
                      <div className="text-gray-400 text-xs">{report.generated} • {report.size}</div>
                    </div>
                    <button 
                      onClick={() => exportReport(report.id)}
                      className="text-red-400 hover:text-red-300 text-sm transition-colors"
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Report Preview Section */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Report Preview</h2>
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
            <div className="text-center text-gray-500 py-12">
              Select report parameters and click "Generate Report" to view preview
            </div>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}