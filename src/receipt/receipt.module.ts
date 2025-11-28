// spendsnap-backend/src/receipt/receipt.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceiptEntity } from './receipt.entity'; // <-- Must be imported
import { ReceiptService } from './receipt.service';
import { ReceiptController } from './receipt.controller';

@Module({
  // CRITICAL: This is where TypeORM makes the repository available.
  imports: [TypeOrmModule.forFeature([ReceiptEntity])], 
  providers: [ReceiptService],
  exports: [ReceiptService],
  controllers: [ReceiptController],
})
export class ReceiptModule {}