import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';
import LandlordSidebar from './LandlordSidebar';
import { socketService } from '../../services/socketService';
import '../landlord.css';

const LandlordLayout = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Connect to SignalR socket on mount
    socketService.connect();

    const handleNewNotification = (message) => {
      setNotifications(prev => [{ id: Date.now(), message, read: false }, ...prev].slice(0, 5)); // Keep last 5
    };

    // Listen to standard events we expect the backend to emit
    socketService.on('ReceiveNotification', handleNewNotification);
    socketService.on('VisitRequested', (msg) => handleNewNotification(`Visit request: ${msg}`));
    socketService.on('ApplicationReceived', (msg) => handleNewNotification(`New application: ${msg}`));

    return () => {
      socketService.off('ReceiveNotification', handleNewNotification);
      socketService.off('VisitRequested', handleNewNotification);
      socketService.off('ApplicationReceived', handleNewNotification);
      socketService.disconnect();
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && unreadCount > 0) {
      // Mark all as read when opening dropdown
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };
  return (
    <div className="landlord-layout">
      <LandlordSidebar />
      <main className="landlord-main">
        {/* Simple Header */}
        <header className="landlord-header">
          <div className="header-actions">
            <div className="header-icon">
              <Search size={20} />
            </div>


            
            {/* hna el Notification */}



            <div className="user-profile ml-4 border-l pl-6 border-slate-200">
              <div className="user-avatar text-indigo-700 bg-indigo-100">L</div>
              <div className="user-info">
                <span className="user-name">Landlord</span>
                <span className="user-role">Host Portal</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="landlord-content bg-slate-50 min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default LandlordLayout;
