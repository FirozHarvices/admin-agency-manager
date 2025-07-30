import { AlertCircle, Home } from 'lucide-react';
import { DashboardStats } from '../features/dashboard/components/DashboardStats';
import { ProjectEmptyState } from '../features/dashboard/components/ProjectEmptyState';
import { ProjectList } from '../features/dashboard/components/ProjectList';
import { useDashboardData } from '../features/dashboard/hooks/useDashboardData';
import { useNavigate } from 'react-router-dom';
import { ElementorLoginModal } from '../features/dashboard/components/ElementorLoginModal';
import { useState } from 'react';
import { Site } from '../features/dashboard/types';


export function DashboardPage() {
  const { data: apiResponse, isLoading, isError, error } = useDashboardData();
  const navigate = useNavigate();

    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProcessingLogin, setIsProcessingLogin] = useState(false);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);


if (isError) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-600 mb-6">
            {error?.message || 'Unable to load dashboard data.'}
          </p>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Home
          </button>
        </div>
      </div>
    );
  }
 const handleEditClick = (site: Site) => {
    setSelectedSite(site);
    setLoginError(null); // Clear previous errors
    setIsLoginModalOpen(true);
  };

    const handleLoginAndNavigate = async (username: string, password: string) => {
    if (!selectedSite || !username || !password) {
      setLoginError("Username and password are required.");
      return;
    }

    setIsProcessingLogin(true);
    setLoginError(null);
    setIsLoginModalOpen(false); 
    try {
      const homePageId = selectedSite.home_page_id || 14; 
      const siteUrl = selectedSite.host.startsWith('http') ? selectedSite.host : `http://${selectedSite.host}`;

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = `${siteUrl}/wp-login.php`;
      form.target = '_blank';
      
      const usernameInput = document.createElement('input');
      usernameInput.type = 'hidden';
      usernameInput.name = 'log';
      usernameInput.value = username;
    
      const passwordInput = document.createElement('input');
      passwordInput.type = 'hidden';
      passwordInput.name = 'pwd';
      passwordInput.value = password;
    
      const redirectInput = document.createElement('input');
      redirectInput.type = 'hidden';
      redirectInput.name = 'redirect_to';
      redirectInput.value = `${siteUrl}/wp-admin/post.php?post=${homePageId}&action=elementor`;
    
      form.appendChild(usernameInput);
      form.appendChild(passwordInput);
      form.appendChild(redirectInput);
    
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);

    } catch (err: any) {
      console.error('Error during login/redirect:', err);
      setLoginError(err.message || 'Failed to process login. Please try again.');
      setIsLoginModalOpen(true); // Re-open modal on error
    } finally {
      setIsProcessingLogin(false);
    }
  };


  // Safe data extraction with null checks
  const agencyData = apiResponse?.data?.agency_data || null;
  const customers = apiResponse?.data?.customers || [];
  const hasProjects = customers.length > 0 && customers.some(c => c.sites?.length > 0);

  return (
    <div className="space-y-8">
      {/* The top stats cards */}
      <DashboardStats data={agencyData} isLoading={isLoading} />

      {/* The main content area */}
      {isLoading ? (
        // Show a loading skeleton for the project list
        <div className="mt-8 space-y-4 animate-pulse">
          <div className="h-8 w-1/4 bg-gray-200 rounded"></div>
          <div className="h-40 bg-gray-200 rounded-lg"></div>
        </div>
      ) : hasProjects ? (
        // If there are projects, show the list
        <ProjectList customers={customers} onEditClick={handleEditClick} />
      ) : (
        // Otherwise, show the empty state
        <ProjectEmptyState />

        
      )}
        {/* --- Render the Modal --- */}
      <ElementorLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSubmit={handleLoginAndNavigate}
        siteUrl={selectedSite?.host || null}
        isLoading={isProcessingLogin}
      />
    </div>
  );
}

// Alternative: If you want a more compact error display within the dashboard layout
export function DashboardPageWithInlineError() {
  const { data: apiResponse, isLoading, isError, error } = useDashboardData();
  const navigate = useNavigate();

  // Safe data extraction with null checks
  const agencyData = apiResponse?.data?.agency_data || null;
  const customers = apiResponse?.data?.customers || [];
  const hasProjects = customers.length > 0 && customers.some(c => c.sites?.length > 0);

  return (
    <div className="space-y-8">
      {/* The top stats cards - show even during error */}
      <DashboardStats data={agencyData} isLoading={isLoading} />

      {/* Error banner for main content */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">
                Error Loading Dashboard
              </h3>
              <p className="text-sm text-red-700 mt-1">
                {error?.message || 'Unable to load dashboard data.'}
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="ml-3 text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      )}

      {/* The main content area */}
      {isLoading ? (
        <div className="mt-8 space-y-4 animate-pulse">
          <div className="h-8 w-1/4 bg-gray-200 rounded"></div>
          <div className="h-40 bg-gray-200 rounded-lg"></div>
        </div>
      ) : !isError && hasProjects ? (
        <ProjectList customers={customers} />
      ) : !isError ? (
        <ProjectEmptyState />
      ) : null}
    </div>
  );
}
