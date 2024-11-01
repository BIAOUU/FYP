import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../../components/NavBar'; 

const AdminUserReportsPage = () => {
  const { userId } = useParams();  // Get the user ID
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserReports = async () => {
      try {
        const response = await fetch(`/api/reports/user/${userId}`);  // Fetch reports based on user ID
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch reports');
        }

        setReports(data);  // Set user's reports
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserReports();  // Load user reports
  }, [userId]);

  return (
    <div>
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-6">User Reports</h2>
        {error && <p className="text-red-500">{error}</p>}
        {reports.length > 0 ? (
          <div>
            {reports.map(report => (
              <div key={report._id} className="mb-4 p-4 border rounded shadow">
                <p><strong>Reason:</strong> {report.reason}</p>
                <p><strong>Reported Product:</strong> {report.product?.name || 'N/A'}</p>
                <p><strong>Reporter:</strong> {report.reporter?.name || report.reporter?.email}</p>
                <p><strong>Status:</strong> {report.status || 'Pending'}</p>
                <p><strong>Date:</strong> {new Date(report.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reports available.</p>
        )}
      </div>
    </div>
  );
};

export default AdminUserReportsPage;
