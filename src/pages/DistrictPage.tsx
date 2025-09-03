import React from 'react';
import { DistrictGuide } from '@/components/districts/DistrictGuide';
import { DocumentHead } from '@/components/common/DocumentHead';

const DistrictPage = () => {
  return (
    <>
      <DocumentHead 
        title="Guide des Quartiers au Maroc | AlertImmo"
        description="Découvrez les meilleurs quartiers pour investir au Maroc : Casablanca, Rabat, Marrakech. Prix, commodités et conseils d'experts."
      />
      <DistrictGuide />
    </>
  );
};

export default DistrictPage;