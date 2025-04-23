
import { SimpleSearchFilters, SimpleSearchFiltersValues } from './SimpleSearchFilters';
import { Button } from '@/components/ui/button';
import { BookmarkPlus } from 'lucide-react';

interface SearchSidebarProps {
  filters: SimpleSearchFiltersValues;
  onFilterChange: (newFilters: Partial<SimpleSearchFiltersValues>) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  onSaveAlert: () => void;
}

export const SearchSidebar = ({
  filters,
  onFilterChange,
  onApplyFilters,
  onResetFilters,
  onSaveAlert
}: SearchSidebarProps) => {
  return (
    <aside>
      <SimpleSearchFilters
        values={filters}
        onChange={onFilterChange}
        onApplyFilters={onApplyFilters}
        onResetFilters={onResetFilters}
      />
      
      <div className="mt-4">
        <Button 
          onClick={onSaveAlert} 
          className="w-full"
          variant="default"
          size="lg"
        >
          <BookmarkPlus className="h-4 w-4 mr-2" />
          Sauvegarder comme alerte
        </Button>
      </div>
    </aside>
  );
};
