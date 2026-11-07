import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Visit, VisitDocument } from '../schemas/visit.schema';
import { RecordVisitDto } from './dto/record-visit.dto';

@Injectable()
export class VisitsService {
  constructor(
    @InjectModel(Visit.name)
    private readonly visitModel: Model<VisitDocument>,
  ) {}

  async record(dto: RecordVisitDto): Promise<Visit> {
    const visitedAt = dto.visitedAt ? new Date(dto.visitedAt) : new Date();
    const created = await this.visitModel.create({
      person: dto.person.trim(),
      address: dto.address.trim().toLowerCase(),
      via: dto.via,
      visitedAt,
    });

    return {
      person: created.person,
      address: created.address,
      via: created.via,
      visitedAt: created.visitedAt,
    };
  }

  async findByPerson(person: string, limit = 100): Promise<Visit[]> {
    const p = person.trim();
    if (!p) {
      return [];
    }

    return this.visitModel
      .find({ person: p })
      .sort({ visitedAt: -1 })
      .limit(limit)
      .select('person address via visitedAt -_id')
      .lean()
      .exec();
  }
}

