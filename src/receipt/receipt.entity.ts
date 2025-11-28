import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

// Match the status enum from the frontend for consistency
export enum ReceiptStatus {
  Scanning = 'SCANNING',
  Review = 'REVIEW',
  Confirmed = 'CONFIRMED'
}

@Entity('receipts') // Defines the SQL table name
export class ReceiptEntity {
  @PrimaryGeneratedColumn('uuid') // Generates a UUID for the primary key
  id: string;

  @Column({ name: 'user_id' })
  @Index() // Index this column for fast lookups
  userId: string;
  
  // --- Core Data ---
  @Column()
  merchant: string;
  
  @Column({ type: 'decimal', precision: 10, scale: 2 }) // Ensure precision for currency
  total: number;
  
  @Column({ length: 3 }) // 'PLN', 'USD', etc.
  currency: string;
  
  @Column({ type: 'timestamp with time zone' })
  date: Date;
  
  // --- AI/Classification Data ---
  @Column({ name: 'category_id', default: 0 })
  categoryId: number;
  
  // Storing complex data as JSONB (PostgreSQL specific)
  @Column({ type: 'jsonb', default: [] }) 
  items: Array<{ name: string; price: number }>;
  
  @Column({ type: 'decimal', precision: 3, scale: 2 })
  confidenceScore: number;
  
  @Column({ type: 'enum', enum: ReceiptStatus, default: ReceiptStatus.Review })
  status: ReceiptStatus;
  
  // --- Asset and Timestamps ---
  @Column({ name: 'image_url', nullable: true })
  imageUrl: string; // Placeholder for S3/Cloud Storage URL (not the full base64)

  @Column({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}