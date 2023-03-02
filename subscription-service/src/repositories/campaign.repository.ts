import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Campaign } from '../models/campaign.entity';

@Injectable()
export class CampaignRepository {
  constructor(
    @InjectRepository(Campaign)
    private dataSource: DataSource,
  ) {}

  async fetchCampaignById(campaignId: number) {
    return this.dataSource
      .createQueryBuilder()
      .select('campaign')
      .from(Campaign, 'campaign')
      .where('campaign.id = :campaignId', { campaignId })
      .getOne();
  }
}
