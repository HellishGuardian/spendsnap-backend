import { Test, TestingModule } from '@nestjs/testing';
import { ReceiptController } from './receipt.controller';
import { ReceiptService } from './receipt.service';
import { ReceiptEntity, ReceiptStatus } from './receipt.entity';
import { ExecutionContext, BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

// --- MOCK SETUP ---
// Define a mock implementation for the entire service
const mockReceiptService = {
  findAllByUser: jest.fn(),
  updateReceipt: jest.fn(),
};

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
const mockReceiptList = [mockReceipt];

describe('ReceiptController', () => {
  let controller: ReceiptController;
  let service: ReceiptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReceiptController],
      providers: [
        {
          provide: ReceiptService,
          useValue: mockReceiptService,
        },
        // We mock the repository here too, although the controller doesn't use it directly, 
        // sometimes NestJS may expect it for module resolution.
        { 
          provide: getRepositoryToken(ReceiptEntity), 
          useValue: {} 
        },
      ],
    }).compile();

    controller = module.get<ReceiptController>(ReceiptController);
    service = module.get<ReceiptService>(ReceiptService);

    // Reset all mock function calls before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // --- Test 1: GET /receipt ---
  describe('findAll', () => {
    it('should call findAllByUser with the query parameter userId', async () => {
      // Arrange
      const testUserId = 'user-test-456';
      mockReceiptService.findAllByUser.mockResolvedValue(mockReceiptList);

      // Act
      await controller.findAll(testUserId);

      // Assert
      expect(mockReceiptService.findAllByUser).toHaveBeenCalledWith(testUserId);
      expect(mockReceiptService.findAllByUser).toHaveBeenCalledTimes(1);
    });

    it('should use the default mock userId if query parameter is missing', async () => {
      // Arrange
      mockReceiptService.findAllByUser.mockResolvedValue(mockReceiptList);

      // Act
      await controller.findAll(undefined as any); // Simulate missing query param

      // Assert
      // The controller implementation uses 'user_abc123' as a fallback
      expect(mockReceiptService.findAllByUser).toHaveBeenCalledWith('user_abc123'); 
    });

    it('should return the list of receipts', async () => {
      // Arrange
      mockReceiptService.findAllByUser.mockResolvedValue(mockReceiptList);

      // Act
      const result = await controller.findAll('user-abc123');

      // Assert
      expect(result).toEqual(mockReceiptList);
    });
  });

  // --- Test 2: PATCH /receipt/:id ---
  describe('update', () => {
    it('should call updateReceipt with id and body data', async () => {
      // Arrange
      const updateData = { status: ReceiptStatus.Review };
      const updatedReceipt = { ...mockReceipt, ...updateData };
      mockReceiptService.updateReceipt.mockResolvedValue(updatedReceipt);

      // Act
      const result = await controller.update(mockReceipt.id, updateData);

      // Assert
      expect(mockReceiptService.updateReceipt).toHaveBeenCalledWith(
        mockReceipt.id,
        updateData,
      );
      expect(result.status).toBe(ReceiptStatus.Review);
    });

    it('should return the updated receipt object', async () => {
      // Arrange
      const updateData = { merchant: 'Updated Merchant' };
      const updatedReceipt = { ...mockReceipt, ...updateData };
      mockReceiptService.updateReceipt.mockResolvedValue(updatedReceipt);

      // Act
      const result = await controller.update(mockReceipt.id, updateData);

      // Assert
      expect(result).toEqual(updatedReceipt);
    });
  });
});