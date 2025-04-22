
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
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
      <Input
        type="text"
        placeholder="Rechercher une propriété..."
        className="w-full h-12 pl-12 pr-4 rounded-full bg-gray-100 border-transparent focus:border-skyblue focus:ring-1 focus:ring-skyblue"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
    </form>
  );
};
