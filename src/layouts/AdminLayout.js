import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Topbar from '../components/common/Topbar';
import CRMErrorBoundary from '../components/common/CRMErrorBoundary';

/**
 * AdminLayout - Layout principal pour le dashboard CRM
 * Design inspiré de HubSpot / Salesforce Lightning
 * 
 * Structure:
 * - Sidebar fixe à gauche (256px desktop, collapsible)
 * - Topbar en haut (64px fixed)
 * - Main content area avec bg-gray-50
 * - CRMErrorBoundary wraps Outlet to catch page-level errors
 */
const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar onToggleSidebar={toggleSidebar} />
        
        {/* Page content wrapped in ErrorBoundary */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            <CRMErrorBoundary>
              <Outlet />
            </CRMErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
