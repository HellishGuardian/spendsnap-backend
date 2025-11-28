// spendsnap-backend/src/receipt/receipt.controller.ts

import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
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

    @Patch(':id')
    async update(
        @Param('id') id: string, // Get the ID from the URL path
        @Body() updateData: Partial<ReceiptEntity> // Get the update fields from the body
    ): Promise<ReceiptEntity> {
        
        // Note: For production, you should validate that the user owns this receipt ID here.
        
        return this.receiptService.updateReceipt(id, updateData);
    }
}