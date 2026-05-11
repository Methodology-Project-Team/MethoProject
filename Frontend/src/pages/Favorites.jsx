import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFavorites, removeFromFavorites, hasUserSession, resolveMediaUrl } from '../services/api';
import ErrorBanner from '../components/ErrorBanner';
import { getApiErrorMessages } from '../utils/apiClient';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageErrors, setPageErrors] = useState([]);
  const [actionErrors, setActionErrors] = useState([]);
  const navigate = useNavigate();

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const data = await getFavorites();
      setFavorites(data || []);
      setPageErrors([]);
    } catch (err) {
      console.error('API Error:', err);
      setFavorites([]);
      setPageErrors(getApiErrorMessages(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasUserSession()) {
      navigate('/login');
      return;
    }
    fetchFavorites();
  }, [navigate]);

  const handleRemove = async (e, propertyId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await removeFromFavorites(propertyId);
      // Remove from local state to avoid refetching everything
      setFavorites(prev => prev.filter(f => f.propertyId !== propertyId && f.id !== propertyId));
      setActionErrors([]);
    } catch (err) {
      console.error('Failed to remove from favorites', err);
      setActionErrors(getApiErrorMessages(err));
    }
  };

  if (loading) {

return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-slate-800">My Favorites ❤️</h1>
          <Link to="/" className="text-purple-600 hover:underline font-medium">
            Browse More Properties
          </Link>
        </div>

        {/* Empty State / Task Placeholder */}
        <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 py-32 text-center shadow-sm">
          <div className="max-w-md mx-auto">
            <p className="text-xl font-semibold text-slate-400 mb-2">No Saved Properties Yet</p>
            <p className="text-slate-400 mb-8">
              This page will be fully implemented in Task 3: Create "My Favorites" UI page.
            </p>
            <div className="inline-block px-6 py-3 bg-slate-100 text-slate-500 rounded-xl font-mono text-sm">
              Waiting for Task 3 implementation...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
}

export default Favorites;