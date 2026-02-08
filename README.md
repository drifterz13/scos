## SCOS - Overview

### Access URLs

| Resource | Link |
| --- | --- |
| **Web Interface** | [SCOS Dashboard](http://scos-web-bucket-6cf380d.s3-website-ap-southeast-1.amazonaws.com/) |
| **Order API Docs** | [Swagger/OpenAPI Documentation](https://r86ajekc64.execute-api.ap-southeast-1.amazonaws.com/api/orders/docs) |
| **Warehouse API Docs** | [Swagger/OpenAPI Documentation](https://r86ajekc64.execute-api.ap-southeast-1.amazonaws.com/api/warehouse/docs) |


### Tech Stack

| Category | Technology |
| --- | --- |
| **Monorepo** | [Turbo](https://turbo.build/) |
| **Runtime** | [Bun](https://bun.sh/) |
| **Frontend (UI)** | [React](https://react.dev/) |
| **Infra** | [AWS](https://aws.amazon.com/) |
| **Database** | [AWS RDS](https://aws.amazon.com/rds/) |
| **Queue** | [AWS SQS](https://aws.amazon.com/sqs/) |
| **API Docs** | [OpenAPI](https://www.openapis.org/) & [Scalar](https://scalar.com/) |
| **CI/CD & IaC** | [GitHub Actions](https://github.com/features/actions) & [Pulumi](https://www.pulumi.com/) |


---

## Project Setup

### Prerequisites

* **Bun:** (v1.3.2+)
* **Docker & Docker Compose**

### How to Install

```bash
# 1. Install all dependencies
bun install

# 2. Start the database, SQS, etc.
docker compose -f docker-compose.dev.yml up -d

# 3. Create .env files
cp apps/order-api/.env.template apps/order-api/.env
cp apps/warehouse-api/.env.template apps/warehouse-api/.env

# 4. Run database migrations for each service
cd apps/order-api
bun run db:migrate

cd ../warehouse-api
bun run db:migrate
bun run db:seed

# 5. Start all services
bun dev-all
```

---

## Application Design

We use **Clean Architecture** and **Domain-Driven Design (DDD)**. This helps keep the code organized so it is easy to test and change later without breaking other parts.

### Project Structure

#### Backend (Microservices)

Each folder like `order-api` is a separate service.

```text
apps/
└── order-api/
    └── src/
        ├── domain/           # Core business rules (no outside libraries)
        │   ├── entities/     # Main data models
        │   ├── value-objects/# Small data pieces (like Money or Email)
        │   ├── repositories/ # Interfaces for the database
        │   └── services/     # Logic that doesn't fit in one entity
        ├── application/      # Use cases (what the app actually does)
        │   ├── use-cases/    # The steps for each action
        │   ├── dto/          # Data formats for input/output
        │   └── interfaces/   # Rules for outside services
        ├── infrastructure/   # Tools and actual implementations
        │   ├── repositories/ # Actual database code
        │   └── api/          # Calling other APIs
        ├── presentation/     # How users connect to us
        │   ├── controllers/  # Handling requests
        │   └── routes/       # API endpoints
        ├── composition-root.ts # Where we link everything together
        └── server.ts         # Start the app here

```

#### Frontend (By Feature)

We group code by "features" instead of just "components" to keep things tidy.

```text
apps/web/
├── src/
│   ├── features/           # Independent modules
│   │   └── order/          # All logic for Orders
│   │       ├── components/ # UI just for this feature
│   │       ├── hooks/      # React logic for this feature
│   │       ├── services/   # API calls for this feature
│   │       └── types/      # TypeScript definitions
│   ├── components/         # Shared UI (Buttons, Inputs, etc.)
│   ├── lib/                # Common tools and setup
│   └── App.tsx             # Main entry
└── package.json            

```

---

## Architectural Design

The system uses a **Microservices** architecture to separate different domains of the application. Each service maintains its own database and can scale independently. This architectural style emphasizes scalability, performance, and extensibility.

### Performance & Scalability

* **Cloud:** We use **AWS ECS Fargate** to scale automatically and **AWS Cloud Map** so services can find each other.
* **Background Jobs:** We use **AWS SQS** for heavy tasks. This keeps the app fast because the user doesn't have to wait for the task to finish.
* **Fast Runtime:** We use **Bun** because it starts and runs faster than Node.js.

### Data Consistency

* **Database:** We use **AWS RDS (PostgreSQL)**. We use the **Read Committed** level and **ACID transactions** to make sure data is always correct and never lost.
* **Syncing Services:** (Planned) We will use the **Outbox Pattern** or **CDC** to make sure all services stay in sync.
* **Eventual Consistency**: We trade off immediate consistency for performance and scalability. Some operations may take time to reflect across services.

### Extensibility

* Because services are separate, we can add new features as new services without affecting the old ones.

---

## Testing Strategy

Because the **Domain** is separate from the database, we can write a lot of unit tests for the business rules.

### Test Coverage

| Area | What we test |
| --- | --- |
| **Basic Data** | Money math, Quantity rules, Map coordinates. |
| **Logic** | Discounts (0-20%), Shipping costs, Checking stock. |
| **Use Cases** | Creating orders, Planning how to ship, Updating inventory. |
| **Integration** | Finding the closest warehouse to the customer. |

---

## Improvements & Future Work

### Performance & Scalability

* [ ] **Caching:** Use **Redis** to reduce database load.
* [ ] **CDN:** Use **AWS CloudFront** to make the website load fast everywhere.
* [ ] **Auto-scaling:** Set up ECS to scale based on CPU/Memory use.

### Data Consistency

* [ ] **Outbox Pattern:** Build a service to send messages to SQS safely.
* [ ] **Event Consumer:** Build a service to process stock updates.

### Features

* [ ] **Authentication**: Secure login so only authorized users can access the system.
* [ ] **Order History**: A page to view all placed orders.
* [ ] **Order Details**: A page to view order information.

### Others

* [x] **Documentation:** Set up **Swagger** for API docs.
* [ ] **Logging:** Move logs to **CloudWatch** for better monitoring.
* [ ] **Error Handling:** Define clear error codes and messages for the APIs.

