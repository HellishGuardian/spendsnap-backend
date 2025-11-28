// spendsnap-backend/src/receipt/receipt.controller.ts

import { Controller, Get, Query } from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { ReceiptEntity } from './receipt.entity';

// Base route is /receipt
@Controller('receipt')
export class ReceiptController {
    constructor(private receiptService: ReceiptService) {}

    // Maps to GET /receipt?userId=user_abc123
    @Get()
    async findAll(@Query('userId') userId: string): Promise<ReceiptEntity[]> {
        // Validation check (optional but good practice)
        if (!userId) {
            // We use the mock ID if the query param is missing for development
            userId = 'user_abc123'; 
        }

        return this.receiptService.findAllByUser(userId);
    }
}