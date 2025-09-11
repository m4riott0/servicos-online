import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-section-hero">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Redirect to appropriate page based on authentication
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
};

export default Index;
