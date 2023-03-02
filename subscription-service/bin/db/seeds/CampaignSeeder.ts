import { Client } from 'pg';

const campaigns = [
  { campaignName: 'Sales', active: true },
  { campaignName: 'Marketing', active: true },
  { campaignName: 'Summer season', active: true },
];

class CampaignSeeder {
  private client: Client;

  constructor() {
    this.client = new Client({
      host: process.env.DB_HOST,
      database: 'subscription',
      user: 'postgres',
      password: 'postgres',
    });
  }

  private async getClient(): Promise<Client> {
    try {
      await this.client.connect();
    } catch (error) {
      console.log('An error has occurred while connecting to the database');
    }

    return this.client;
  }

  private async insertCampaigns(): Promise<void> {
    const query = `
      WITH records_to_insert ("campaignName", "isActive") AS (
        VALUES ${campaigns
          .map((record) => `('${record.campaignName}', ${record.active})`)
          .join(',')}
      )
      INSERT INTO public.campaign ("campaignName", "isActive")
      SELECT "campaignName", "isActive" 
      FROM records_to_insert
      -- WHERE "campaignName" not in (
      --  ${campaigns.map((record) => `'${record.campaignName}'`).join(',')}
     -- );
    `;

    try {
      await this.client.query(query);
      console.log('Campaigns seeded successfully');
    } catch (error) {
      console.error(
        'An error occurred while seeding campaigns:',
        error.message,
        error.stack,
      );
    }
  }

  public async run(): Promise<void> {
    await this.getClient();
    await this.insertCampaigns();
    this.client.end();
  }
}

const campaignSeeder = new CampaignSeeder();
campaignSeeder.run().catch((error) => console.error(error));
