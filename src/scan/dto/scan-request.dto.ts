// Matches the ScanRequest interface from the Angular frontend
export class ScanRequestDto {
  image_base64: string;
  user_id: string;
  currency_hint?: 'USD' | 'EUR' | 'PLN' | 'GBP';
}