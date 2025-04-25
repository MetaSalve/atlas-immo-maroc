
import { Button } from '@/components/ui/button';
import { SimpleSearchFilters } from './SimpleSearchFilters';
import { Bell } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface SearchSidebarProps {
  filters: any;
  onFilterChange: (filters: any) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  onSaveAlert: () => void;
}

export const SearchSidebar = ({
  filters,
  onFilterChange,
  onApplyFilters,
  onResetFilters,
  onSaveAlert,
}: SearchSidebarProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSaveAlert = () => {
    if (!user) {
      toast.info("Connexion requise", {
        description: "Veuillez vous connecter pour créer une alerte",
      });
      navigate('/auth');
      return;
    }
    onSaveAlert();
  };

  return (
    <div className="space-y-6">
      <SimpleSearchFilters
        values={filters}
        onChange={onFilterChange}
        onApplyFilters={onApplyFilters}
        onResetFilters={onResetFilters}
      />
      
      <Button 
        onClick={handleSaveAlert}
        className="w-full bg-terracotta hover:bg-terracotta/90"
      >
        <Bell className="h-4 w-4 mr-2" />
        Sauvegarder comme alerte
      </Button>
    </div>
  );
};
