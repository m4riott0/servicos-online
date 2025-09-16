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

  return <Navigate to={isAuthenticated ? "/Home" : "/login"} replace />;
};

export default Index;
