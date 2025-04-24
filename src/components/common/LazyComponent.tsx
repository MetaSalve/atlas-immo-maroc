
import React, { Suspense } from 'react';
import { LoadingFallback } from './LoadingFallback';

interface LazyComponentProps {
  children: React.ReactNode;
}

export const LazyComponent = ({ children }: LazyComponentProps) => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      {children}
    </Suspense>
  );
};
