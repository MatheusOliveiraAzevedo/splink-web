import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { links } from '../../shared/model/links';
import { GooglePlacesService, GoogleReview, PlaceDetails } from './google-places.service';

interface ReviewLocation {
  id: 'tramandai' | 'imbe';
  name: string;
  url: string;
  state: 'loading' | 'ready' | 'unconfigured' | 'error';
  details?: PlaceDetails;
  selectedReviews?: GoogleReview[];
}

@Component({
  selector: 'app-google-reviews',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './google-reviews.component.html',
  styleUrl: './google-reviews.component.scss',
})
export class GoogleReviewsComponent implements OnInit {
  private readonly places = inject(GooglePlacesService);
  private readonly destroyRef = inject(DestroyRef);
  private destroyed = false;
  readonly locations = signal<ReviewLocation[]>([
    { id: 'tramandai', name: 'Tramandaí', url: links.endereco_01, state: 'loading' },
    { id: 'imbe', name: 'Imbé', url: links.endereco_02, state: 'loading' },
  ]);

  constructor() { this.destroyRef.onDestroy(() => { this.destroyed = true; }); }

  async ngOnInit(): Promise<void> {
    try {
      const config = await this.places.configuration();
      if (this.destroyed) return;
      await Promise.all(this.locations().map(async location => {
        const id = config.placeIds?.[location.id]?.trim();
        if (!config.apiKey?.trim() || !id) { this.update(location.id, { state: 'unconfigured' }); return; }
        try {
          const details = await this.places.details(config.apiKey.trim(), id);
          const selectedReviews = (details.reviews ?? []).filter(review =>
            review.rating === 5 && (review.originalText || review.text)?.trim());
          this.update(location.id, { state: 'ready', details, selectedReviews });
        } catch { this.update(location.id, { state: 'error' }); }
      }));
    } catch {
      for (const location of this.locations()) this.update(location.id, { state: 'error' });
    }
  }

  private update(id: string, change: Partial<ReviewLocation>): void {
    if (!this.destroyed) this.locations.update(items => items.map(item => item.id === id ? { ...item, ...change } : item));
  }

  // Never trust a remote URL as HTML or allow executable URL schemes.
  safeUrl(value?: string): string | null {
    try { const url = new URL(value ?? ''); return url.protocol === 'https:' ? url.href : null; }
    catch { return null; }
  }

  formatRating(value: number): string { return value.toLocaleString('pt-BR', { maximumFractionDigits: 1 }); }
}
