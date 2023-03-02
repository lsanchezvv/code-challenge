# ADIDAS NODEJS SUBSCRIPTION SYSTEM CODING CHALLENGE

The purpose of this system is to manage subscriptions.

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

## Running all the projects

1. In the main directory run 
  `docker-compose up --build`
2. Once all services are up and running, run the following command to add campaign seeds: 
  `docker exec -it subscription-service npm run seed:run`
## Playing around with the endpoitns
Once all the services are up and running you can play around with the following curl commands or you can use another tool to make request. I
1. Send a couple of post request to create a subscriptions. (No auth needed for this endpoint)
```
curl -X POST localhost:3001/subscriptions -d \
'{ "email": "adidas@test.com", "firstName": "adidas", "gender": "male", "dateOfBirth": "1988-02-27", "campaignId": 1, "optIn": true }' \
-H "Content-Type: application/json"

curl -X POST localhost:3001/subscriptions -d \
'{ "email": "snow@test.com", "firstName": "John", "gender": "male", "dateOfBirth": "1958-01-01", "campaignId": 1, "optIn": true }' \
-H "Content-Type: application/json"

curl -X POST localhost:3001/subscriptions -d \
'{ "email": "adidas@test.com", "firstName": "adidas", "gender": "male", "dateOfBirth": "1988-02-27", "campaignId": 2, "optIn": true }' \
 -H "Content-Type: application/json"

curl -X POST localhost:3001/subscriptions -d \
'{ "email": "adidas@test.com", "firstName": "adidas", "gender": "male", "dateOfBirth": "1988-02-27", "campaignId": 3, "optIn": true }' \
-H "Content-Type: application/json"

curl -X POST localhost:3001/subscriptions \
-d '{ "email": "snow@test.com", "firstName": "John", "gender": "male", "dateOfBirth": "1958-01-01", "campaignId": 1, "optIn": true }' \
-H "Content-Type: application/json"
```

2. Try to do a get request to retrieve subscriptions (without being authenticated. You should get a not authorized error.
  ```
  curl -X GET localhost:3001/subscriptions 
  ```
3. Try to log in and get an access token. 
  ```
  curl -X POST http://localhost:3001/auth/login -d '{"username": "adidas@test.com", "password": "password"}' -H "Content-Type: application/json"
  ```
4. use the access token to make the get request again and you should get a list of subscriptions
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" localhost:3001/subscriptions -X GET

5. try to get the subscription details using the same access token. you should get the subscription details. 
  ```
  curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" localhost:3001/subscriptions/1 -X GET
  ```
6. make a patch request to cancel a subscription. Using the subscription id and the access token associated to the subcriber email
  ```
  curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" localhost:3001/subscriptions/1/cancel -X PATCH
  ```
7. Do a get request to get the details of the same subscription id and you should see the optIn set to false for the given susbcription.
  ```
  curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" localhost:3001/subscriptions/1 -X GET
  ```
## Remarks about the projects
1. There are 3 services running, 1 postgres database and a rabbitmq server.
2. Regarding security
The security is very basic and simple by using a jwt token once the user is logged in. With more time, I could have implemented better security, including Authorization between the services. I tried to simulate an Authorization service, but i'm using the subscriber table information to do a simple check if the email exists. The password is not being used, any password would work for this case. Ideally, this should have proper validation, including password salt and hashing to store it in the database or use an external service to handle that. We could also use other strategies for auth.
3. Regarding testing I ran out of time for the testing. Was only able to write 2 unit tests for the subscription service. My approach to unit test is checking the function im testing and following through the different escenarios in the code, checking who was called and who was not, expected results and errors that were thrown.
4. Logging, I could have done a better use of logging for debugging purposes and tracking down the flow of order subsription. Always having in mind to not log sensitive data.
5. Broker service, regarding the broker service it does not have any security around it, with more time I could have added better security like implementing api key and authorization to it. Also add credentials and not use the defaults as for this case. 
6. The email service is just listening to the created queue, no email implementation was done as per the challenge.
7. Documentation is available for subscription-service by going to: http://localhost:3000/api.
8. With more time I could have done better validation on the endpoints and checking for different types of parameters that are being received.
9. Regarding database, the database changes are being synced automatically using typeorm, in a real world we should be using migrations to keep track of the changes and have an easier rollback mechanism.
9. Regarding branch and commits, Very few commits will be shown since everytime I created a new project using nest, it created it's own git and didn't realize that until the last minute. Ideally, while working on a feature, we should work on a feature branch and commit every unit of work.
