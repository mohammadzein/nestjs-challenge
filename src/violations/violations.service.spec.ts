import { Test, TestingModule } from '@nestjs/testing';
import { ViolationsService } from './violations.service';

describe('ViolationsService', () => {
  let service: ViolationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ViolationsService],
    }).compile();

    service = module.get<ViolationsService>(ViolationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('parseDate', () => {
    it('should parse date time string to DateTime object', () => {
      let dateTimeString = "2020-01-11 00:09:00";
    
      let dateTimeObject = service.parseDate(dateTimeString);
    
      expect(typeof dateTimeObject === 'object').toBe(true)
    })

    it('timestamp of the datetime 2020-01-11 00:09:00 should be equal to 1578694140000', () => {
      let dateTimeString = "2020-01-11 00:09:00";
  
      let dateTimeObject = service.parseDate(dateTimeString);
  
      expect(dateTimeObject.ts).toEqual(1578694140000)
    })
  
    it('invalid property of the datetime 2020-01-11 00:09:00 should be equal to null', () => {
      let dateTimeString = "2020-01-11 00:09:00";
  
      let dateTimeObject = service.parseDate(dateTimeString);
  
      expect(dateTimeObject.invalid).toBeNull()
    })

    it('invalid reason of the datetime 2020-01-0 00:09:00 should be equal to unit out of range', () => {
      let dateTimeString = "2020-01-0 00:09:00";
  
      let dateTimeObject = service.parseDate(dateTimeString);
      
      expect(dateTimeObject.invalid['reason']).toEqual('unit out of range')
    })
      
    it('weekday long property of the datetime 2020-01-11 00:09:00 should be equal to Saturday', () => {
      let dateTimeString = "2020-01-11 00:09:00";
  
      let dateTimeObject = service.parseDate(dateTimeString);
  
      expect(dateTimeObject.weekdayLong).toBe('Saturday')
    })
  })

  describe('fixDateTime', () => {
    it('should add one day to the datetime since they starts from zero', () => {
      let dateTimeString = "2020-01-0 00:09:00";
  
      let fixedDateTime = service.fixDateTime(dateTimeString);
  
      expect(fixedDateTime).toBe('2020-01-1 00:09:00')
    })
  })  
});
