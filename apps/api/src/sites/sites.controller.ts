import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateSiteDto } from './dto/create-site.dto';
import { SitesService } from './sites.service';

@Controller()
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Get('sites/:address')
  async getSite(@Param('address') address: string) {
    return this.sitesService.findByAddress(address);
  }

  @Post('sites')
  async publishSite(@Body() createSiteDto: CreateSiteDto) {
    return this.sitesService.upsert(createSiteDto);
  }

  @Get('search')
  async search(@Query('q') q = '') {
    return this.sitesService.search(q);
  }
}

