import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CalendarCheck, Users, CheckCircle2, Clock, ChevronLeft, ChevronRight, Hourglass } from 'lucide-react';
import { adminService } from '../services/adminService';
import ErrorBanner from '../../components/ErrorBanner';
import { getApiErrorMessages } from '../../utils/apiClient';
import '../admin.css';

const LandlordRequests = () => {
  const queryClient = useQueryClient();
  const [actionErrors, setActionErrors] = React.useState([]);

  const { data: requests = [], isLoading: loading } = useQuery({
    queryKey: ['pendingLandlords'],
    queryFn: async () => {
      const data = await adminService.getPendingLandlords();
      return Array.isArray(data) ? data : (data?.data || data?.items || []);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleApprove = async (id) => {
    try {
      await adminService.approveLandlord(id);
      queryClient.setQueryData(['pendingLandlords'], (old) => old?.filter(r => (r.id || r.landlordId) !== id));
      setActionErrors([]);
    } catch (err) {
      setActionErrors(getApiErrorMessages(err));
    }
  };

  const handleReject = async (id) => {
    try {
      await adminService.rejectLandlord(id);
      queryClient.setQueryData(['pendingLandlords'], (old) => old?.filter(r => (r.id || r.landlordId) !== id));
      setActionErrors([]);
    } catch (err) {
      setActionErrors(getApiErrorMessages(err));
    }
  };

  return (
    <div className="page-wrapper">
      
      <div className="requests-header-top">
        <div className="page-title" style={{ marginBottom: 0 }}>
          <h1>Landlord Requests</h1>
          <p>Review and verify new landlord onboarding applications.</p>
          </div>
      </div> 
    </div>
  );
};

export default LandlordRequests;
