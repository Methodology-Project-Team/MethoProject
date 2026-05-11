import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import ErrorBanner from '../../components/ErrorBanner';
import { getApiBaseUrl, getApiErrorMessages } from '../../utils/apiClient';
import { adminService } from '../services/adminService';
import '../admin.css';

const API_BASE_URL = getApiBaseUrl();

const PropertyApprovals = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('All Requests');
  const [actionErrors, setActionErrors] = useState([]);

  const { data: properties = [], isLoading: loading } = useQuery({
    queryKey: ['pendingProperties'],
    queryFn: async () => {
      const data = await adminService.getPendingProperties();
      const rawArray = Array.isArray(data) ? data : (data?.data || data?.items || []);
      
      // Map the backend schema to what the PropertyCard component expects
      return rawArray.map(item => ({
        id: item.id,
        title: item.title,
        location: item.location,
        price: item.price ? `$${item.price.toLocaleString()}/mo` : '$0/mo',
        image: item.imageUrls && item.imageUrls.length > 0 
          ? `${API_BASE_URL}${item.imageUrls[0]}` 
          : 'https://via.placeholder.com/400x300?text=No+Image',
        status: item.approvalStatus === 'Pending' ? 'NEW SUBMISSION' : (item.approvalStatus || 'NEW SUBMISSION'),
        landlord: {
          name: item.landlordName || 'Unknown Landlord',
          verified: true // adjust if backend provides a verified flag later
        }
      }));
    },
    staleTime: 5 * 60 * 1000, // keep cache fresh for 5 minutes
  });

  const handleAccept = async (id) => {
    try {
      await adminService.approveProperty(id);
      // Remove from Cache instantly
      queryClient.setQueryData(['pendingProperties'], (old) => old?.filter(p => (p.id || p.propertyId) !== id));
      setActionErrors([]);
    } catch (err) {
      setActionErrors(getApiErrorMessages(err));
    }
  };

  const handleReject = async (id) => {
    try {
      await adminService.rejectProperty(id);
      // Remove from Cache instantly
      queryClient.setQueryData(['pendingProperties'], (old) => old?.filter(p => (p.id || p.propertyId) !== id));
      setActionErrors([]);
    } catch (err) {
      setActionErrors(getApiErrorMessages(err));
    }
  };

  const filteredProperties = properties.filter(p => {
    if (activeTab === 'All Requests') return true;
    if (activeTab === 'Urgent') return p.status === 'URGENT REVIEW' || p.isUrgent;
    if (activeTab === 'Flagged') return p.status === 'RE-SUBMISSION' || p.isFlagged;
    return true;
  });

  return (
    <div className="page-wrapper">
      <div className="page-title">
      </div>

      <ErrorBanner messages={actionErrors} className="mb-6" />
    </div>
  );
};

export default PropertyApprovals;