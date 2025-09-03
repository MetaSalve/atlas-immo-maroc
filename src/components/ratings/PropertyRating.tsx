import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, ThumbsUp, MessageSquare, User } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Rating {
  id: string;
  user_id: string;
  property_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_email: string;
  helpful_count: number;
}

interface PropertyRatingProps {
  propertyId: string;
  className?: string;
}

export const PropertyRating = ({ propertyId, className }: PropertyRatingProps) => {
  const { user } = useAuth();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [userRating, setUserRating] = useState<number>(0);
  const [userComment, setUserComment] = useState<string>('');
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUserRated, setHasUserRated] = useState(false);

  const averageRating = ratings.length > 0 
    ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length 
    : 0;

  useEffect(() => {
    fetchRatings();
  }, [propertyId]);

  const fetchRatings = async () => {
    try {
      // For demo purposes, use local state with mock data
      console.log('Fetching ratings for property:', propertyId);
      
      // Initialize with empty ratings for demo
      setRatings([]);
      
      // Check if current user has already rated (mock)
      if (user) {
        setHasUserRated(false);
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
      setRatings([]);
    }
  };

  const submitRating = async () => {
    if (!user) {
      toast.error('Vous devez être connecté pour noter cette propriété');
      return;
    }

    if (userRating === 0) {
      toast.error('Veuillez sélectionner une note');
      return;
    }

    setIsSubmitting(true);

    try {
      // For now, simulate rating submission until DB is ready
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Votre évaluation a été enregistrée (mode démo)');
      setUserRating(0);
      setUserComment('');
      setHasUserRated(true);
      
      // Add mock rating to state for demo
      const mockRating: Rating = {
        id: Date.now().toString(),
        user_id: user.id,
        property_id: propertyId,
        rating: userRating,
        comment: userComment.trim() || '',
        created_at: new Date().toISOString(),
        user_email: 'Vous***@***',
        helpful_count: 0
      };
      setRatings(prev => [mockRating, ...prev]);
    } catch (error: any) {
      toast.error('Erreur lors de l\'enregistrement: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const markHelpful = async (ratingId: string) => {
    if (!user) {
      toast.error('Vous devez être connecté');
      return;
    }

    try {
      // Update helpful count locally for demo
      setRatings(prev => prev.map(rating => 
        rating.id === ratingId 
          ? { ...rating, helpful_count: rating.helpful_count + 1 }
          : rating
      ));
      
      toast.success('Merci pour votre retour !');
    } catch (error) {
      console.error('Error updating helpful count:', error);
    }
  };

  const renderStars = (rating: number, interactive: boolean = false, size: 'sm' | 'lg' = 'sm') => {
    const starSize = size === 'lg' ? 'h-6 w-6' : 'h-4 w-4';
    
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} cursor-pointer transition-colors ${
              star <= (interactive ? (hoveredStar || userRating) : rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
            onClick={interactive ? () => setUserRating(star) : undefined}
            onMouseEnter={interactive ? () => setHoveredStar(star) : undefined}
            onMouseLeave={interactive ? () => setHoveredStar(0) : undefined}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400" />
            Évaluations et Avis
          </CardTitle>
          <CardDescription>
            {ratings.length > 0 ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {renderStars(averageRating)}
                  <span className="font-medium">{averageRating.toFixed(1)}</span>
                </div>
                <span className="text-muted-foreground">
                  {ratings.length} avis
                </span>
              </div>
            ) : (
              'Aucun avis pour cette propriété'
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Add rating form */}
          {user && !hasUserRated && (
            <div className="p-4 border rounded-lg bg-muted/50">
              <h4 className="font-medium mb-3">Évaluez cette propriété</h4>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Note</label>
                  <div className="mt-1">
                    {renderStars(userRating, true, 'lg')}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Commentaire (optionnel)</label>
                  <Textarea
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    placeholder="Partagez votre expérience avec cette propriété..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
                <Button 
                  onClick={submitRating}
                  disabled={userRating === 0 || isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? 'Enregistrement...' : 'Publier mon avis'}
                </Button>
              </div>
            </div>
          )}

          {/* Ratings list */}
          <div className="space-y-4">
            {ratings.map((rating) => (
              <div key={rating.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {rating.user_email.replace(/(.{3}).*(@.*)/, '$1***$2')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(rating.created_at)}
                      </p>
                    </div>
                  </div>
                  {renderStars(rating.rating)}
                </div>

                {rating.comment && (
                  <p className="text-sm text-muted-foreground mb-3 ml-11">
                    {rating.comment}
                  </p>
                )}

                <div className="flex items-center gap-2 ml-11">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markHelpful(rating.id)}
                    className="h-8 px-2 text-xs"
                  >
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    Utile {rating.helpful_count > 0 && `(${rating.helpful_count})`}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {ratings.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Aucun avis pour cette propriété.</p>
              <p className="text-sm">Soyez le premier à la noter !</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};