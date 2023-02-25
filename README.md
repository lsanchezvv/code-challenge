# ADIDAS NODEJS SUBSCRIPTION SYSTEM CODING CHALLENGE

The purpose of this system is to manage customer subscriptions.

## Subscription system overall architecture
Overall architecture:
- Public service
  - Backend for frontend (BFF) - Rest API to interact with the user interface
- Subscription service
  - Service that handles the requests from the BFF.
  - Produces messages for the subscription message broker.
- Email service
  - Handles all email notifications to the users
  - Consumes messages from the subscription message broker.
- Subscription message broker
  - Broker for the subscription system
- Subscription database
  - Relational database for persisting subscription service data

### Subscription system architecture diagram
![Subscription system architecture](./images/system_architecture.png)

### Subscription database design diagram
![Subscription database design](./images/db_design.png)
