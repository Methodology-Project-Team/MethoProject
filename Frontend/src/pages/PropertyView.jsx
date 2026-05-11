// src/pages/PropertyView.jsx

import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getPropertyById, addToFavorites, scheduleVisit, hasUserSession, getPropertyReviews, createReview, resolveMediaUrl } from '../services/api';
import { getApiErrorMessages } from '../utils/apiClient';

const PropertyView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  // Fetch property details when component mounts or ID changes
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPropertyById(id);
        setProperty(data);
      } catch (err) {
        setError('Unable to load property details. This property may not exist.');
        console.error('❌ Error fetching property details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPropertyDetails();
  }, [id]);

  // Handle favorite toggle action
  const handleFavoriteToggle = async () => {
    if (!hasUserSession()) {
      setActionMessage({ type: 'warning', text: '⚠️ Please sign in to add to favorites' });
      setTimeout(() => setActionMessage(null), 3000);
      return;
    }

    try {
      await addToFavorites(id);
      setActionMessage({ type: 'success', text: '✅ Added to favorites successfully' });
    } catch (err) {
      const [message] = getApiErrorMessages(err);
      setActionMessage({ type: 'error', text: message || '❌ Failed to add to favorites' });
    }
    setTimeout(() => setActionMessage(null), 3000);
  };

  // Handle visit scheduling
  const handleScheduleVisit = async () => {
    if (!hasUserSession()) {
      setActionMessage({ type: 'warning', text: '⚠️ Please sign in to schedule a visit' });
      setTimeout(() => setActionMessage(null), 3000);
      return;
    }

    try {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 3);

      await scheduleVisit(id, futureDate.toISOString(), 'I would like to schedule a property viewing');
      setActionMessage({ type: 'success', text: '✅ Visit request sent successfully' });
    } catch (err) {
      const [message] = getApiErrorMessages(err);
      setActionMessage({ type: 'error', text: message || '❌ Failed to schedule visit' });
    }
    setTimeout(() => setActionMessage(null), 4000);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="ml-4 text-lg">Loading property details...</p>
      </div>
    );
  }

  // Error or property not found state
  if (error || !property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
        <div className="alert alert-error shadow-lg max-w-md mb-6">
          <div>
            <span>⚠️</span>
            <span className="font-bold">Sorry!</span>
            <span className="block">{error || 'Property not found'}</span>
          </div>
        </div>
        <button className="btn btn-outline" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
      </div>
    );
  }

  // Render property details
  const imageList = property.images?.length > 0 ? property.images : (property.imageUrls || []);

return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="mb-6 text-purple-600 font-semibold hover:underline"
        >
          ← Back to Properties
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Property Details Page</h1>
          <p className="text-gray-500">Currently viewing property ID: <span className="text-purple-600 font-mono">{id}</span></p>
          
          <div className="mt-10 py-20 border-2 border-dashed border-gray-100 rounded-xl">
            <p className="text-gray-400 italic">The details UI, Images, and Booking actions will be built here for Task 2.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyView;