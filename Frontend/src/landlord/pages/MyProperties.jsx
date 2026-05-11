import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { landlordService } from '../services/landlordService';
import { resolveMediaUrl } from '../../services/api';
import ErrorBanner from '../../components/ErrorBanner';
import { getApiErrorMessages } from '../../utils/apiClient';

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessages, setErrorMessages] = useState([]);
  const [actionErrors, setActionErrors] = useState([]);
  const [formErrors, setFormErrors] = useState([]);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPropertyId, setCurrentPropertyId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    propertyType: 'Apartment',
    areaSqFt: '',
    bedrooms: '',
    bathrooms: '',
    rentalStatus: 'Available',
    hasParking: false,
    hasElevator: false,
    isFurnished: false
  });

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const data = await landlordService.getMyProperties();
      setProperties(data || []);
      setErrorMessages([]);
    } catch (err) {
      console.error(err);
      setErrorMessages(getApiErrorMessages(err));
      // Fallback for UI visualization if API fails (since backend might not have this endpoint yet)
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentPropertyId(null);
    setFormErrors([]);
    setFormData({
      title: '', description: '', price: '', location: '', propertyType: 'Apartment',
      areaSqFt: '', bedrooms: '', bathrooms: '', rentalStatus: 'Available',
      hasParking: false, hasElevator: false, isFurnished: false
    });
    setShowModal(true);
  };

  const openEditModal = (property) => {
    setIsEditing(true);
    setCurrentPropertyId(property.id);
    setFormErrors([]);
    setFormData({
      title: property.title || '',
      description: property.description || '',
      price: property.price || '',
      location: property.location || '',
      propertyType: property.propertyType || 'Apartment',
      areaSqFt: property.areaSqFt || property.area || '',
      bedrooms: property.bedrooms || '',
      bathrooms: property.bathrooms || '',
      rentalStatus: property.rentalStatus || property.status || 'Available',
      hasParking: property.hasParking || false,
      hasElevator: property.hasElevator || false,
      isFurnished: property.isFurnished || false
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await landlordService.updateProperty(currentPropertyId, formData);
      } else {
        await landlordService.createProperty(formData);
      }
      setShowModal(false);
      setFormErrors([]);
      setActionErrors([]);
      fetchProperties();
    } catch (err) {
      console.error(err);
      setFormErrors(getApiErrorMessages(err));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await landlordService.deleteProperty(id);
        setActionErrors([]);
        fetchProperties();
      } catch (err) {
        setActionErrors(getApiErrorMessages(err));
      }
    }
  };

  if (loading) return <div className="p-8">Loading properties...</div>;

  return (
    <div className="p-6 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">My Properties</h1>
          <p className="text-slate-500 mt-1">Manage your property listings</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={20} className="mr-2" /> Add Property
        </button>
      </div>

      <ErrorBanner messages={errorMessages} className="mb-4" />
      <ErrorBanner messages={actionErrors} className="mb-6" />

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th>Property</th>
                <th>Price</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-500">
                    You haven't listed any properties yet.
                  </td>
                </tr>
              ) : (
                properties.map(property => (
                  <tr key={property.id} className="hover:bg-slate-50">
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img src={resolveMediaUrl(property.images?.[0] || property.imageUrls?.[0]) || 'https://via.placeholder.com/150'} alt="Property" />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">{property.title}</div>
                          <div className="text-sm opacity-50">{property.propertyType || 'Apartment'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="font-medium">{property.price?.toLocaleString()} EGP</td>
                    <td>{property.location}</td>
                    <td>
                      <div className={`badge ${property.rentalStatus === 'Available' ? 'badge-success' : 'badge-ghost'}`}>
                        {property.rentalStatus || property.status || 'N/A'}
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-sm btn-ghost text-blue-600" onClick={() => openEditModal(property)}>
                          <Edit size={16} />
                        </button>
                        <button className="btn btn-sm btn-ghost text-red-600" onClick={() => handleDelete(property.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
       {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-2xl mb-6">{isEditing ? 'Edit Property' : 'Add New Property'}</h3>
            <ErrorBanner messages={formErrors} className="mb-4" />
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-control">
                </div>
              </div>
            </form>
          </div>
        </div>



)}

</div>

 );
};

export default MyProperties;
