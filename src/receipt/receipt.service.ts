// spendsnap-backend/src/receipt/receipt.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReceiptEntity } from './receipt.entity';
import { ScanResponseDto } from '../scan/dto/scan-response.dto';

@Injectable()
export class ReceiptService {
  constructor(
    // Inject the TypeORM Repository for the ReceiptEntity
    @InjectRepository(ReceiptEntity)
    private receiptRepository: Repository<ReceiptEntity>,
  ) {}

  // CRITICAL FIX: The missing method implementation
  async createReceipt(data: ScanResponseDto, userId: string): Promise<ReceiptEntity> {
    // 1. Map the DTO data to the Entity structure
    const newReceipt = this.receiptRepository.create({
      ...data,
      userId: userId,
      // Convert string date to Date object for PostgreSQL
      date: new Date(data.date), 
      createdAt: new Date(),
    });

    // 2. Save the entity to the database
    const savedReceipt = await this.receiptRepository.save(newReceipt);

    console.log(`[DB]: Successfully saved Receipt ID: ${savedReceipt.id}`);
    return savedReceipt;
  }

  async findAllByUser(userId: string): Promise<ReceiptEntity[]> {
    // For now, we fetch all receipts, but later we will filter by userId
    const receipts = await this.receiptRepository.find({
        // In a real app, this would be: where: { userId: userId },
        where: {userId: userId},
        order: { createdAt: 'DESC' },
    });

    console.log(`[DB]: Retrieved ${receipts.length} receipts for user ${userId}`);
    return receipts;
  }

  async updateReceipt(
    id: string, 
    data: Partial<ReceiptEntity>
  ): Promise<ReceiptEntity> {
    
    // 1. Find the receipt to ensure it exists
    const receipt = await this.receiptRepository.findOne({ where: { id } });
    
    if (!receipt) {
        // You might use a custom NotFoundException here, but we'll throw a standard error for now
        throw new Error(`Receipt with ID ${id} not found.`);
    }

    // 2. Merge the new data onto the existing entity
    const updatedReceipt = this.receiptRepository.merge(receipt, data);

    // 3. Save the merged entity (TypeORM performs an UPDATE automatically)
    const result = await this.receiptRepository.save(updatedReceipt);

    console.log(`[DB]: Successfully updated Receipt ID: ${id}`);
    return result;
  }
}