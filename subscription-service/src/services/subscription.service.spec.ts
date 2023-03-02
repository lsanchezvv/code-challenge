import { Test } from '@nestjs/testing';
import { RabbitMqProvider } from '../providers/rabbitMq.provider';
import { CampaignRepository } from '../repositories/campaign.repository';
import { SubscriberRepository } from '../repositories/subscriber.repository';
import { SubscriptionRepository } from '../repositories/subscription.repository';
import { SubscriptionsService } from './subscription.service';
import { Campaign } from '../models/campaign.entity';
import { Subscriber } from '../models/subscriber.entity';
import { Subscription } from '../models/subscription.entity';
import { GenderEnum } from '../common/types';
import { NotFoundException } from '@nestjs/common';

describe('SubscriptionService', () => {
  let service: SubscriptionsService;
  let rabbitMqStub;
  let subscriptionRepo;
  let subscriberRepository;
  let campaignRepository;
  let expectedSubscription;

  beforeEach(async () => {
    const campaign = new Campaign();
    campaign.campaignName = 'Sales';
    campaign.id = 1;
    campaign.isActive = true;
    const subscriber = new Subscriber();
    subscriber.id = 1;
    subscriber.gender = GenderEnum.MALE;
    subscriber.dateOfBirth = new Date('1999-01-01');
    subscriber.firstName = 'Luis';
    subscriber.email = 'luis@test.com';
    expectedSubscription = new Subscription();
    expectedSubscription.id = 1;
    expectedSubscription.campaign = campaign;
    expectedSubscription.optIn = true;
    expectedSubscription.subscriber = subscriber;
    expectedSubscription.createdAt = new Date('1999-01-01');
    expectedSubscription.updatedAt = new Date('1999-01-01');

    rabbitMqStub = {
      sendSubscriptionEmailNotification: () => Promise.resolve(),
    };

    subscriptionRepo = {
      fetchSubscriptionsByEmail: () => Promise.resolve([expectedSubscription]),
      fetchSubscriptionDetailsByEmailAndId: () => Promise.resolve(),
      fetchSubscriptionBySubscriberIdAndCampaignId: () => Promise.resolve(),
      createSubscriptionWithSubscriber: () => Promise.resolve(),
      saveSubscription: () => Promise.resolve(),
      updateSubscription: () => Promise.resolve(),
    };

    subscriberRepository = {
      fetchSubscriberByEmail: () => Promise.resolve(),
    };

    campaignRepository = {
      fetchCampaignById: () => Promise.resolve(),
    };

    const module = await Test.createTestingModule({
      providers: [
        SubscriptionsService,
        {
          provide: RabbitMqProvider,
          useValue: rabbitMqStub,
        },
        {
          provide: SubscriptionRepository,
          useValue: subscriptionRepo,
        },
        {
          provide: SubscriberRepository,
          useValue: subscriberRepository,
        },
        {
          provide: CampaignRepository,
          useValue: campaignRepository,
        },
      ],
    }).compile();

    service = module.get<SubscriptionsService>(SubscriptionsService);
  });

  afterEach(() => {
    jest.resetModules();
  });

  it('Service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSubscriptionsByEmail()', () => {
    it('should return subscriptions array', async () => {
      const result = await service.getSubscriptionsByEmail('test@test.com');

      expect(result).toStrictEqual([expectedSubscription]);
    });

    it('should throw an error when subscriptions are not found', async () => {
      subscriptionRepo.fetchSubscriptionsByEmail = () => Promise.resolve(null);

      const fn = () => service.getSubscriptionsByEmail('test@test.com');

      await expect(fn).rejects.toThrow(NotFoundException);
    });
  });

  describe('createSubscriptionWithSubscriber()', () => {
    it('creates a new subscription and a new subcriber', async () => {});
    it('creates a new subscription with an existing subcriber', async () => {});
    it('throws an error if the campaign does not exists', async () => {});
    it('throws an error if the subscription already exists', async () => {});
  });
});
