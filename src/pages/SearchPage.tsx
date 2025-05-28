
import React from 'react';
import { Helmet } from 'react-helmet-async';
import SearchPageComponent from '@/components/search/SearchPage';
import { useTranslation } from '@/i18n';

const SearchPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('search.title')} | AlertImmo</title>
        <meta name="description" content={t('search.description')} />
      </Helmet>
      
      <SearchPageComponent />
    </>
  );
};

export default SearchPage;
