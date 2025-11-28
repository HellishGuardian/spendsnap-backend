// spendsnap-backend/src/scan/dto/scan-response.dto.ts

import { ReceiptStatus } from 'src/receipt/receipt.entity';

// This must strictly match the ScanResponse model in the Angular frontend
export class ScanResponseDto {
  id?: string; 
  merchant: string;
  total: number;
  currency: 'USD' | 'EUR' | 'PLN' | 'GBP';
  date: string; 
  categoryId: number;
  items: Array<{ name: string; price: number }>;
  confidenceScore: number;
  // This uses the enum we defined in the ReceiptEntity
  status: ReceiptStatus.Review | ReceiptStatus.Confirmed; 
}