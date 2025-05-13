
import { Navigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { LoadingFallback } from '@/components/common/LoadingFallback';
import { Suspense } from 'react';

const Index = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <Navigate to="/home" replace />
      </Suspense>
    </ErrorBoundary>
  );
};

export default Index;
