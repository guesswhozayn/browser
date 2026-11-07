import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RecordVisitDto } from './dto/record-visit.dto';
import { VisitsService } from './visits.service';

@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Post()
  async recordVisit(@Body() recordVisitDto: RecordVisitDto) {
    return this.visitsService.record(recordVisitDto);
  }

  @Get()
  async getVisits(
    @Query('person') person = '',
    @Query('limit') limit = '100',
  ) {
    const parsedLimit = Math.min(Math.max(Number(limit) || 100, 1), 500);
    return this.visitsService.findByPerson(person, parsedLimit);
  }
}

