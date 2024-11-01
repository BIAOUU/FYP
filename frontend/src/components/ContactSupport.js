import React, { useEffect, useState } from 'react';

const ContactSupport = () => {
    const [contactInfo, setContactInfo] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContactInfo = async () => {
            try {
                const response = await fetch('/api/contact'); // Ensure this endpoint is correct
                if (!response.ok) {
                    throw new Error('Failed to fetch contact information');
                }
                const data = await response.json();
                setContactInfo(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchContactInfo();
    }, []);

    if (loading) {
        return <div className="text-center">Loading contact information...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-4 text-center">Support Contact Information</h2>
            <div className="border border-gray-300 rounded-lg shadow-lg p-4">
                <p className="mb-2"><strong>Email:</strong> {contactInfo.email}</p>
                <p className="mb-2"><strong>Phone:</strong> {contactInfo.phone}</p>
                <p className="mb-2"><strong>Address:</strong> {contactInfo.address}</p>
                <p>If you have any questions or need assistance, feel free to reach out to us through the contact information above.</p>
            </div>
        </div>
    );
};

export default ContactSupport;
