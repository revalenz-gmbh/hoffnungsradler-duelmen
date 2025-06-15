import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';

// Die URL zum lokalen Proxy. Der Google-Link wird nicht mehr direkt verwendet.
const PROXY_API_URL = '/api/voting';

interface VotingTour {
  name: string;
  distance: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
}

const AbstimmungPage = () => {
  const [searchParams] = useSearchParams();
  const subscriberId = searchParams.get('id');

  const [tours, setTours] = useState<VotingTour[]>([]);
  const [selectedTours, setSelectedTours] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [voteResponse, setVoteResponse] = useState<ApiResponse | null>(null);

  useEffect(() => {
    if (!subscriberId) {
      setError('Keine Abonnenten-ID gefunden. Bitte benutze den Link aus dem Newsletter.');
      setLoading(false);
      return;
    }

    const fetchVotingTours = async () => {
      try {
        setLoading(true);
        const response = await fetch(PROXY_API_URL);
        const data = await response.json();
        if (!response.ok || data.error) {
          throw new Error(data.error || 'Fehler beim Laden der Touren.');
        }
        setTours(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ein unbekannter Fehler ist aufgetreten.');
      } finally {
        setLoading(false);
      }
    };

    fetchVotingTours();
  }, [subscriberId]);

  const handleCheckboxChange = (tourName: string) => {
    setSelectedTours(prev => {
      if (prev.includes(tourName)) {
        return prev.filter(t => t !== tourName);
      } else {
        if (prev.length < 2) {
          return [...prev, tourName];
        }
      }
      return prev;
    });
  };

  const handleSubmit = async () => {
    if (selectedTours.length === 0) {
      return;
    }
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch(PROXY_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriberId: subscriberId,
          votedTourNames: selectedTours,
        }),
      });
      
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Ein unbekannter Fehler ist aufgetreten.');
      }
      
      setVoteResponse({ success: true, message: result.message });

    } catch (err) {
      setVoteResponse({ success: false, message: err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten.' });
    } finally {
      setSubmitting(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <p className="ml-4 text-lg">Lade Abstimmungsdaten...</p>
        </div>
      );
    }

    if (error) {
       return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Fehler</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    if (voteResponse) {
       return (
        <Alert variant={voteResponse.success ? 'default' : 'destructive'}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{voteResponse.success ? 'Erfolg' : 'Fehler'}</AlertTitle>
          <AlertDescription>{voteResponse.message}</AlertDescription>
        </Alert>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Tour-Abstimmung</CardTitle>
          <CardDescription>
            Wähle bis zu zwei Touren aus, die du gerne fahren möchtest. Deine Stimme hilft uns bei der Planung!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {tours.map(tour => (
            <div key={tour.name} className="flex items-center space-x-3 p-3 rounded-md border bg-gray-50/50">
              <Checkbox
                id={tour.name}
                checked={selectedTours.includes(tour.name)}
                onCheckedChange={() => handleCheckboxChange(tour.name)}
                disabled={selectedTours.length >= 2 && !selectedTours.includes(tour.name)}
              />
              <label htmlFor={tour.name} className="flex-grow text-sm font-medium leading-none cursor-pointer">
                {tour.name} <span className="text-xs text-gray-500">({tour.distance})</span>
              </label>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={submitting || selectedTours.length === 0}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Stimme abgeben
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {renderContent()}
      </div>
    </MainLayout>
  );
};

export default AbstimmungPage; 