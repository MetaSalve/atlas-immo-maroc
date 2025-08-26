
import React from 'react';
import SearchPageComponent from '@/components/search/SearchPage';
import { useTranslation } from '@/i18n';
import { DocumentHead } from '@/components/common/DocumentHead';

const SearchPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <DocumentHead title={`${t('search.title')} | AlertImmo`} description={t('search.description')} />
      
      <SearchPageComponent />
    </>
  );
};

export default SearchPage;
