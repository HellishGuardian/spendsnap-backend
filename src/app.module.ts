// spendsnap-backend/src/app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <-- NEW IMPORT
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScanModule } from './scan/scan.module'; // Ensure this is imported
import { ReceiptModule } from './receipt/receipt.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // Specify the database type
      host: 'localhost',
      port: 5432, // Default PostgreSQL port
      username: 'postgres', // Use your local PostgreSQL username
      password: 'H9v!Rk4$TpZwQ7xB', 
      database: 'spendsnap_db',
      
      // AutoLoad Models and Migration Configuration
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Looks for all *.entity.ts files
      synchronize: true, // Auto-create tables (Set to false in Production!)
    }),
    ScanModule,
    ReceiptModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}