
import { SimpleSearchBar } from '@/components/search/SimpleSearchBar';
import { Button } from '@/components/ui/button';
import { List, MapPin } from 'lucide-react';

interface SearchHeaderProps {
  searchQuery: string;
  showMap: boolean;
  onSearch: (query: string) => void;
  onToggleView: () => void;
}

export const SearchHeader = ({
  searchQuery,
  showMap,
  onSearch,
  onToggleView
}: SearchHeaderProps) => {
  return (
    <div className="mb-6">
      <SimpleSearchBar 
        initialValue={searchQuery} 
        onSearch={onSearch} 
        className="mb-4"
      />
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={onToggleView}
          className="flex items-center gap-2"
        >
          {showMap ? (
            <>
              <List className="h-4 w-4" />
              <span>Afficher la liste</span>
            </>
          ) : (
            <>
              <MapPin className="h-4 w-4" />
              <span>Afficher la carte</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
