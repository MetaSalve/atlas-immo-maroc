
import { Navigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

const Index = () => {
  return (
    <ErrorBoundary>
      <Navigate to="/home" replace />
    </ErrorBoundary>
  );
};

export default Index;
