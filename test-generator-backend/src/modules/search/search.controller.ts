import { Controller, Get, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { SearchService } from './search.service';
import { SearchQueryDto } from './dto/search-query.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  /** Public library search; each call runs a few indexed queries. */
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  @Get()
  search(@Query() query: SearchQueryDto) {
    return this.searchService.search(query.q);
  }
}
