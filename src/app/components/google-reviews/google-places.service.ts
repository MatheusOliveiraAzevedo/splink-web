import { Injectable } from '@angular/core';

export interface PlacesConfig {
  apiKey: string;
  placeIds: { tramandai: string; imbe: string };
}

export interface GoogleReview {
  rating?: number;
  text?: string;
  originalText?: string;
  publishTime?: Date;
  googleMapsURI?: string;
  authorAttribution?: { displayName: string; uri?: string; photoURI?: string };
}

export interface PlaceDetails {
  rating?: number;
  userRatingCount?: number;
  reviews?: GoogleReview[];
  googleMapsURI?: string;
  attributions?: { provider?: string; providerURI?: string }[];
  fetchFields(options: { fields: string[] }): Promise<unknown>;
}

interface PlacesLibrary { Place: new (options: { id: string; requestedLanguage: string }) => PlaceDetails; }
type MapsWindow = Window & {
  google?: { maps?: { importLibrary: (name: string) => Promise<PlacesLibrary> } };
  splinkPlacesReady?: () => void;
};

/** Loads only the official SDK; no persistent storage of Google review content. */
@Injectable({ providedIn: 'root' })
export class GooglePlacesService {
  private library?: Promise<PlacesLibrary>;

  async configuration(): Promise<PlacesConfig> {
    const response = await fetch('/google-places.json', { cache: 'no-store', signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error('Places configuration unavailable');
    return response.json();
  }

  private load(apiKey: string): Promise<PlacesLibrary> {
    if (this.library) return this.library;
    const target = window as MapsWindow;
    this.library = this.withTimeout(new Promise<void>((resolve, reject) => {
      if (target.google?.maps?.importLibrary) { resolve(); return; }
      const script = document.createElement('script');
      const params = new URLSearchParams({ key: apiKey, v: 'quarterly', loading: 'async',
        language: 'pt-BR', region: 'BR', callback: 'splinkPlacesReady' });
      target.splinkPlacesReady = () => { resolve(); };
      script.id = 'splink-google-places-sdk';
      script.src = `https://maps.googleapis.com/maps/api/js?${params}`;
      script.async = true;
      script.onerror = () => reject(new Error('Places SDK unavailable'));
      document.head.appendChild(script);
    }).then(() => target.google!.maps!.importLibrary('places')));
    return this.library;
  }

  async details(apiKey: string, placeId: string): Promise<PlaceDetails> {
    const { Place } = await this.load(apiKey);
    const place = new Place({ id: placeId, requestedLanguage: 'pt-BR' });
    await this.withTimeout(place.fetchFields({ fields: [
      'rating', 'userRatingCount', 'reviews', 'googleMapsURI', 'attributions',
    ] }));
    return place;
  }

  async summary(apiKey: string, placeId: string): Promise<PlaceDetails> {
    const { Place } = await this.load(apiKey);
    const place = new Place({ id: placeId, requestedLanguage: 'pt-BR' });
    await this.withTimeout(place.fetchFields({ fields: ['rating', 'userRatingCount', 'googleMapsURI', 'attributions'] }));
    return place;
  }

  private withTimeout<T>(work: Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Places request timed out')), 15000);
      work.then(value => { clearTimeout(timer); resolve(value); },
        error => { clearTimeout(timer); reject(error); });
    });
  }
}
