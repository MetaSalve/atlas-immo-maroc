
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface SimpleSearchBarProps {
  initialValue?: string;
  onSearch: (query: string) => void;
  className?: string;
}

export const SimpleSearchBar = ({
  initialValue = '',
  onSearch,
  className = ''
}: SimpleSearchBarProps) => {
  const [query, setQuery] = useState(initialValue);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };
  
  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <Input
          type="text"
          placeholder="Rechercher par ville, quartier, adresse..."
          className="pr-20"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button 
          type="submit"
          size="sm" 
          className="absolute right-1 top-1/2 transform -translate-y-1/2"
        >
          <Search className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Rechercher</span>
        </Button>
      </div>
    </form>
  );
};
