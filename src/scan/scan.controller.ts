// spendsnap-backend/src/scan/scan.controller.ts

// The 'Header' import is removed here
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ScanRequestDto } from './dto/scan-request.dto';
import { ScanResponseDto } from './dto/scan-response.dto';
import { ReceiptStatus } from '../receipt/receipt.entity';
import { ReceiptService } from 'src/receipt/receipt.service';

@Controller('scan') 
export class ScanController {

  constructor(private receiptService: ReceiptService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  // The @Header decorator is removed here
  async scanReceipt(@Body() scanRequest: ScanRequestDto): Promise<ScanResponseDto> {
    
    // --- STEP 1: AI Processing (Still Mocked) ---
    console.log(`[SCANNER]: Received image request from User ${scanRequest.user_id}`);
    
    // Define the mock response (id is correctly omitted for DB generation)
    const mockResponse: ScanResponseDto = {
      merchant: 'Carrefour S.A.',
      total: 125.75,
      currency: 'PLN',
      date: new Date().toISOString(),
      categoryId: 1, 
      items: [
        { name: 'Milk 3.2%', price: 4.99 },
        { name: 'Bread', price: 3.50 },
      ],
      confidenceScore: 0.95,
      status: ReceiptStatus.Confirmed,
    };

    // --- STEP 2: Database Persistence ---
    const savedReceipt = await this.receiptService.createReceipt(mockResponse, scanRequest.user_id);

    // --- STEP 3: Return Final DB Response ---
    return {
      ...mockResponse,
      id: savedReceipt.id, // Returns the real UUID
    };
  }
}