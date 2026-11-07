import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Site, SiteDocument } from '../schemas/site.schema';
import { CreateSiteDto } from './dto/create-site.dto';
import { extractTextContent } from './html-utils';

@Injectable()
export class SitesService {
  constructor(
    @InjectModel(Site.name)
    private readonly siteModel: Model<SiteDocument>,
  ) {}

  async findByAddress(address: string): Promise<Site> {
    const normalized = address.trim().toLowerCase();
    const site = await this.siteModel
      .findOne({ address: normalized })
      .select('address title html author updatedAt -_id')
      .lean()
      .exec();

    if (!site) {
      throw new NotFoundException(`Site not found at address: ${address}`);
    }

    return site;
  }

  async upsert(dto: CreateSiteDto): Promise<Site> {
    const address = dto.address.trim().toLowerCase();
    const textContent = extractTextContent(dto.html);

    const site = await this.siteModel
      .findOneAndUpdate(
        { address },
        {
          $set: {
            address,
            title: dto.title.trim(),
            html: dto.html,
            textContent,
            author: dto.author.trim(),
          },
        },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      )
      .select('address title html author updatedAt -_id')
      .lean()
      .exec();

    return site;
  }

  async search(query: string): Promise<Array<Omit<Site, 'html'> & { snippet: string }>> {
    const q = query.trim();
    if (!q) {
      return [];
    }

    const sites = await this.siteModel
      .find(
        { $text: { $search: q } },
        { score: { $meta: 'textScore' } },
      )
      .sort({ score: { $meta: 'textScore' } })
      .select('address title author textContent updatedAt -_id')
      .limit(20)
      .lean()
      .exec();

    return sites.map((site) => {
      const idx = site.textContent.toLowerCase().indexOf(q.toLowerCase());
      const start = Math.max(0, idx - 40);
      const end = Math.min(site.textContent.length, (idx === -1 ? 0 : idx) + q.length + 80);
      const snippet = site.textContent.slice(start, end).trim();

      return {
        address: site.address,
        title: site.title,
        author: site.author,
        textContent: site.textContent,
        updatedAt: site.updatedAt,
        snippet: (start > 0 ? '...' : '') + snippet + (end < site.textContent.length ? '...' : ''),
      };
    });
  }
}

