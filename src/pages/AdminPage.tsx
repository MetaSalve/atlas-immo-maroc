import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Plus, Trash, ExternalLink, Check, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { PropertySource, ScrapingLog, PropertySourceInsert } from '@/types/admin';

const AdminPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [sources, setSources] = useState<PropertySource[]>([]);
  const [logs, setLogs] = useState<ScrapingLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // New source form state
  const [newSource, setNewSource] = useState<PropertySourceInsert>({
    name: '',
    url: '',
    type: 'website',
    scrape_frequency_hours: 24
  });

  useEffect(() => {
    // Check if user is authenticated and redirect if not
    if (!user) {
      navigate('/auth');
      return;
    }
    
    fetchSources();
    fetchLogs();
  }, [user, navigate]);
  
  const fetchSources = async () => {
    try {
      const { data, error } = await supabase
        .from('property_sources')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      // Cast data to ensure TypeScript compatibility
      setSources((data || []).map(source => ({
        ...source,
        type: source.type as 'website' | 'social'
      })));
    } catch (error) {
      console.error('Error fetching sources:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger les sources'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('scraping_logs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(20);
        
      if (error) throw error;
      
      // Cast data to ensure TypeScript compatibility
      setLogs((data || []).map(log => ({
        ...log,
        status: log.status as 'processing' | 'completed' | 'error'
      })));
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };
  
  const createSource = async () => {
    try {
      if (!newSource.name || !newSource.url) {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Veuillez remplir tous les champs obligatoires'
        });
        return;
      }
      
      const { data, error } = await supabase
        .from('property_sources')
        .insert({
          name: newSource.name,
          url: newSource.url,
          type: newSource.type,
          scrape_frequency_hours: newSource.scrape_frequency_hours,
          active: true
        })
        .select();
        
      if (error) throw error;
      
      // Reset form and refresh sources
      setNewSource({
        name: '',
        url: '',
        type: 'website',
        scrape_frequency_hours: 24
      });
      
      toast({
        title: 'Source ajoutée',
        description: `${newSource.name} a été ajouté avec succès`
      });
      
      fetchSources();
    } catch (error) {
      console.error('Error creating source:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible d\'ajouter la source'
      });
    }
  };
  
  const toggleSourceActive = async (id: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from('property_sources')
        .update({ active: !currentActive })
        .eq('id', id);
        
      if (error) throw error;
      
      setSources(sources.map(source => 
        source.id === id ? { ...source, active: !currentActive } : source
      ));
      
      toast({
        title: 'Source mise à jour',
        description: `La source est maintenant ${!currentActive ? 'active' : 'inactive'}`
      });
    } catch (error) {
      console.error('Error updating source:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de mettre à jour la source'
      });
    }
  };
  
  const deleteSource = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette source? Cette action est irréversible.')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('property_sources')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setSources(sources.filter(source => source.id !== id));
      
      toast({
        title: 'Source supprimée',
        description: 'La source a été supprimée avec succès'
      });
    } catch (error) {
      console.error('Error deleting source:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de supprimer la source'
      });
    }
  };
  
  const runScraper = async (sourceId: string) => {
    try {
      setIsProcessing(true);
      
      // Add to scraping queue with high priority
      const { error } = await supabase
        .from('scraping_queue')
        .insert({
          source_id: sourceId,
          scheduled_for: new Date().toISOString(),
          priority: 10,
          status: 'pending'
        });
        
      if (error) throw error;
      
      // Call the function to start processing
      await supabase.functions.invoke('process-scraping-queue');
      
      toast({
        title: 'Scraping lancé',
        description: 'Le processus de scraping a démarré'
      });
      
      // Refresh logs after a short delay
      setTimeout(() => {
        fetchLogs();
      }, 2000);
    } catch (error) {
      console.error('Error running scraper:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de lancer le processus de scraping'
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Jamais';
    try {
      return new Date(dateString).toLocaleString('fr-FR');
    } catch (error) {
      return 'Date invalide';
    }
  };
  
  const getSourceById = (id: string | null) => {
    if (!id) return 'Inconnu';
    const source = sources.find(s => s.id === id);
    return source ? source.name : 'Inconnu';
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processing':
        return <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">En cours</span>;
      case 'completed':
        return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Terminé</span>;
      case 'error':
        return <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Erreur</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">En attente</span>;
    }
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-6">Administration</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sources list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Sources de données</h2>
            {isLoading && <Loader2 className="animate-spin h-5 w-5" />}
          </div>
          
          <div className="bg-white shadow rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Dernière analyse</TableHead>
                  <TableHead>Fréquence</TableHead>
                  <TableHead>Actif</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sources.length === 0 && !isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                      Aucune source configurée
                    </TableCell>
                  </TableRow>
                ) : (
                  sources.map(source => (
                    <TableRow key={source.id}>
                      <TableCell className="font-medium">{source.name}</TableCell>
                      <TableCell>
                        {source.type === 'website' ? 'Site web' : 'Réseau social'}
                      </TableCell>
                      <TableCell>{formatDate(source.last_scraped_at)}</TableCell>
                      <TableCell>{source.scrape_frequency_hours}h</TableCell>
                      <TableCell>
                        <Switch 
                          checked={source.active} 
                          onCheckedChange={() => toggleSourceActive(source.id, source.active)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            title="Exécuter maintenant"
                            onClick={() => runScraper(source.id)}
                            disabled={isProcessing}
                          >
                            {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            title="Voir la source"
                            onClick={() => window.open(source.url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            title="Supprimer"
                            onClick={() => deleteSource(source.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        
        {/* Add new source form */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Ajouter une source</h2>
          <div className="bg-white shadow rounded-lg p-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nom</label>
              <Input
                placeholder="Nom de la source"
                value={newSource.name}
                onChange={e => setNewSource({...newSource, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">URL</label>
              <Input
                placeholder="https://example.com"
                value={newSource.url}
                onChange={e => setNewSource({...newSource, url: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select
                value={newSource.type}
                onValueChange={value => setNewSource({...newSource, type: value as 'website' | 'social'})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Site web</SelectItem>
                  <SelectItem value="social">Réseau social</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Fréquence (heures)</label>
              <Input
                type="number"
                min="1"
                max="168"
                value={newSource.scrape_frequency_hours}
                onChange={e => setNewSource({...newSource, scrape_frequency_hours: parseInt(e.target.value) || 24})}
              />
            </div>
            
            <Button 
              className="w-full" 
              onClick={createSource}
              disabled={!newSource.name || !newSource.url}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter la source
            </Button>
          </div>
        </div>
      </div>
      
      {/* Recent logs */}
      <div className="mt-8 space-y-4">
        <h2 className="text-lg font-semibold">Historique des analyses</h2>
        <div className="bg-white shadow rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Biens trouvés</TableHead>
                <TableHead>Biens ajoutés</TableHead>
                <TableHead>Durée</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    Aucun historique disponible
                  </TableCell>
                </TableRow>
              ) : (
                logs.map(log => {
                  // Calculate duration
                  let duration = 'En cours';
                  if (log.completed_at && log.started_at) {
                    const start = new Date(log.started_at);
                    const end = new Date(log.completed_at);
                    const seconds = Math.round((end.getTime() - start.getTime()) / 1000);
                    duration = `${seconds}s`;
                  }
                  
                  return (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{getSourceById(log.source_id)}</TableCell>
                      <TableCell>{formatDate(log.started_at)}</TableCell>
                      <TableCell>
                        {getStatusBadge(log.status)}
                        {log.error_message && (
                          <div className="flex items-center text-xs text-red-600 mt-1">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {log.error_message.substring(0, 40)}
                            {log.error_message.length > 40 ? '...' : ''}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{log.properties_found || 0}</TableCell>
                      <TableCell>{log.properties_added || 0}</TableCell>
                      <TableCell>{duration}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
