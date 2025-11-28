// spendsnap-backend/src/scan/scan.module.ts

import { Module } from '@nestjs/common';
import { ScanController } from './scan.controller';
import { ReceiptModule } from '../receipt/receipt.module'; // <-- NEW IMPORT (The correct dependency)

@Module({
  // CRITICAL FIX: Import the module that provides the service we need
  imports: [ReceiptModule], 
  controllers: [ScanController],
  providers: [], // No providers are needed here
})
export class ScanModule {}