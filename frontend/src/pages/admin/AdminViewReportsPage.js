// File: pages/admin/AdminViewReportsPage.js
import React, { useState, useEffect } from 'react';

const AdminViewReportsPage = () => {
    const [reports, setReports] = useState([]);
    const [error, setError] = useState(null);
    const [selectedReport, setSelectedReport] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await fetch('/api/reports');
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch reports');
                }

                setReports(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchReports();
    }, []);

    const handleViewReport = (report) => {
        setSelectedReport(report);
    };

    return (
        <div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-2xl font-bold mb-6">View Report</h2>
                {error && <p className="text-red-500">{error}</p>}
                {selectedReport ? (
                    <div className="border p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold mb-4">Report Details</h3>
                        <p><strong>Reporter:</strong> {selectedReport.reporter.name || selectedReport.reporter.email}</p>
                        <p><strong>Reason:</strong> {selectedReport.reason}</p>
                        <p><strong>Reported Product:</strong> {selectedReport.product?.name || 'N/A'}</p>
                        <p><strong>Created At:</strong> {new Date(selectedReport.createdAt).toLocaleString()}</p>
                        <p><strong>Status:</strong> {selectedReport.status || 'Pending'}</p>

                        <button
                            className="mt-4 bg-gray-600 text-white px-4 py-2 rounded-md"
                            onClick={() => setSelectedReport(null)}  // 返回到列表
                        >
                            Back to Reports
                        </button>
                    </div>
                ) : (
                    <div className="p-4 rounded-lg space-y-4">
                        {reports.length > 0 ? (
                            <ul className="space-y-4">
                                {reports.map((report) => (
                                    <li key={report._id} className="flex justify-between items-center border-b pb-4">
                                        <div className="flex items-center space-x-4">
                                            <img
                                                src={`https://avatars.dicebear.com/api/initials/${report.reporter.name || report.reporter.email}.svg`}
                                                alt={report.reporter.name}
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <span className="font-medium">{report.reporter?.name || report.reporter.email}</span>
                                            <input
                                                type="text"
                                                value={report.reason}
                                                readOnly
                                                className="border p-3 flex-grow w-64"
                                            />
                                        </div>
                                        <button className="bg-gray-600 text-white px-4 py-2 rounded-md"
                                            onClick={() => handleViewReport(report)}>
                                            View Report
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No reports available</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminViewReportsPage;
