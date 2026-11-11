/** Marketing supplies the artwork and its exact textual equivalent together. */
export interface GoogleRatingsArtwork {
  desktop: string;
  tablet?: string;
  mobile: string;
  /** Full transcription: approved copy, unit names, scores, counts and check date. */
  description: string;
}

// Set only after receiving the final artwork and confirming its real scores.
// See docs/design/banner-carousel.md for dimensions and an example.
export const googleRatingsArtwork: GoogleRatingsArtwork | null = null;
