# Order Microservice

A GraphQL-based microservice for handling orders in an e-commerce system, built with NestJS, MongoDB, and Stripe integration.

## Features

- Create and manage orders with items and shipping details
- Process payments using Stripe
- Track order and payment status
- GraphQL API for flexible querying
- MongoDB for data persistence

## Prerequisites

- Node.js (v16 or later)
- MongoDB instance
- Stripe account (for payment processing)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd order-microservice
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/order-service
   STRIPE_SECRET_KEY=your_stripe_secret_key
   PORT=3000
   NODE_ENV=development
   ```

## Running the Application

```bash
# Development mode with watch
$ npm run start:dev

# Production build
$ npm run build
$ npm run start:prod
```

The GraphQL Playground will be available at `http://localhost:3000/graphql` when running in development mode.

## API Documentation

### Queries

- `orders`: Get all orders
- `order(id: ID!)`: Get order by ID
- `ordersByUser(userId: String!)`: Get orders by user ID

### Mutations
With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
