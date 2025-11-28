import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReceiptService } from './receipt.service';
import { ReceiptEntity, ReceiptStatus } from './receipt.entity';
import { ScanResponseDto } from '../scan/dto/scan-response.dto';

// Define the mock repository and its methods
const mockReceiptRepository = {
  // Mock methods used by the service
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(), // For the update method
  merge: jest.fn(),  // For the update method
};

// Define mock data for testing
const mockReceipt: ReceiptEntity = {
  id: 'uuid-123',
  userId: 'user-abc123',
  merchant: 'Test Store',
  total: 50.00,
  currency: 'USD',
  date: new Date(),
  categoryId: 1,
  items: [],
  confidenceScore: 1.0,
  status: ReceiptStatus.Confirmed,
  createdAt: new Date(),
  imageUrl: 'https://mock.com/image_123.jpg',
};

const mockScanDto: ScanResponseDto = {
  merchant: 'Carrefour S.A.',
  total: 125.75,
  currency: 'PLN',
  date: new Date().toISOString(),
  categoryId: 1,
  items: [{ name: 'Milk', price: 4.99 }],
  confidenceScore: 0.95,
  status: ReceiptStatus.Confirmed,
};


describe('ReceiptService', () => {
  let service: ReceiptService;
  let repository: Repository<ReceiptEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReceiptService,
        {
          // Provide the mock repository using its token
          provide: getRepositoryToken(ReceiptEntity),
          useValue: mockReceiptRepository,
        },
      ],
    }).compile();

    service = module.get<ReceiptService>(ReceiptService);
    repository = module.get<Repository<ReceiptEntity>>(getRepositoryToken(ReceiptEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Test 1: Testing the createReceipt method
  describe('createReceipt', () => {
    it('should successfully save a new receipt', async () => {
      // Setup the mocks for this test
      mockReceiptRepository.create.mockReturnValue(mockReceipt);
      mockReceiptRepository.save.mockResolvedValue(mockReceipt);

      const result = await service.createReceipt(mockScanDto, mockReceipt.userId);

      // Assertions
      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalledWith(mockReceipt);
      expect(result).toEqual(mockReceipt);
    });
  });

  // Test 2: Testing the findAllByUser method
  describe('findAllByUser', () => {
    it('should return an array of receipts for a given user', async () => {
      const receiptList = [mockReceipt];
      // Setup the mock for the find method
      mockReceiptRepository.find.mockResolvedValue(receiptList);

      const result = await service.findAllByUser(mockReceipt.userId);

      // Assertions
      expect(repository.find).toHaveBeenCalledWith({
        where: { userId: mockReceipt.userId }, // Test the filtering logic!
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(receiptList);
    });
  });

  // Test 3: Testing the updateReceipt method
  describe('updateReceipt', () => {
    it('should successfully update and return the merged receipt', async () => {
      const updateData = { merchant: 'New Merchant Name' };
      const mergedReceipt = { ...mockReceipt, ...updateData };

      // Setup the mocks for the update process
      mockReceiptRepository.findOne.mockResolvedValue(mockReceipt); // Receipt exists
      mockReceiptRepository.merge.mockReturnValue(mergedReceipt);
      mockReceiptRepository.save.mockResolvedValue(mergedReceipt);

      const result = await service.updateReceipt(mockReceipt.id, updateData);

      // Assertions
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: mockReceipt.id } });
      expect(repository.merge).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalledWith(mergedReceipt);
      expect(result.merchant).toBe(updateData.merchant);
    });

    it('should throw an error if the receipt is not found', async () => {
      mockReceiptRepository.findOne.mockResolvedValue(undefined); // Receipt does not exist
      
      // We expect the function call to throw the custom error
      await expect(service.updateReceipt('non-existent-id', {})).rejects.toThrow();
    });
  });
});