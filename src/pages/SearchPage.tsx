
import React from 'react';
import SearchPageComponent from '@/components/search/SearchPage';
import { useTranslation } from '@/i18n';
import { MetaTags } from '@/components/common/MetaTags';

const SearchPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <MetaTags title={`${t('search.title')} | AlertImmo`} description={t('search.description')} />
      
      <SearchPageComponent />
    </>
  );
};

export default SearchPage;
