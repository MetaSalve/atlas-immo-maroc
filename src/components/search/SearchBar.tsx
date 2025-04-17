
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  initialValue?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export const SearchBar = ({
  initialValue = '',
  onSearch,
  className = ''
}: SearchBarProps) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialValue);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onSearch) {
      onSearch(query);
    } else {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };
  
  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input
          type="text"
          placeholder="Ville, quartier, adresse..."
          className="pl-10 pr-20"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button 
          type="submit"
          size="sm" 
          className="absolute end-1 top-1/2 -translate-y-1/2 flex items-center gap-1"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Rechercher</span>
        </Button>
      </div>
    </form>
  );
};
