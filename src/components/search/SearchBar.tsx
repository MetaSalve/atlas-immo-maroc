
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [query, setQuery] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onSearch) {
      onSearch(query);
    } else {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleTriggerScraping = async () => {
    try {
      setIsLoading(true);
      toast({
        title: "Démarrage du scraping",
        description: "Tentative de déclenchement du processus de scraping...",
      });

      // Ajouter une tâche à la file d'attente avec priorité élevée
      const { error: queueError } = await supabase
        .from('scraping_queue')
        .insert({
          source_id: null, // null pour scraper toutes les sources actives
          scheduled_for: new Date().toISOString(),
          priority: 10,
          status: 'pending'
        });

      if (queueError) throw queueError;

      // Appeler la fonction Edge pour démarrer le traitement
      const { error } = await supabase.functions.invoke('process-scraping-queue');
      
      if (error) throw error;

      toast({
        title: "Scraping déclenché",
        description: "Le processus de scraping a été déclenché avec succès. Vérifiez les logs dans Supabase.",
      });
    } catch (error) {
      console.error('Erreur lors du déclenchement du scraping:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de déclencher le processus de scraping. Vérifiez la console pour plus de détails.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <div className="relative flex items-center gap-2">
        <div className="relative grow">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            type="text"
            placeholder="Ville, quartier, adresse..."
            className="pl-10 pr-20 text-gray-900 dark:text-gray-100"
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
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleTriggerScraping}
          disabled={isLoading}
          className="flex items-center gap-1"
          title="Tester le scraping"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Tester scraping</span>
        </Button>
      </div>
    </form>
  );
};
