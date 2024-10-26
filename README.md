# Question Rotation System

This project implements a scalable system for dynamically assigning region-specific questions to users on a configurable cycle. The system is designed to handle 100k daily active users and can scale to millions globally.

## Prerequisites

Ensure that you have the following installed:

- **Node.js** (>=14.x)
- **npm** (>=6.x)
- **Serverless Framework** (>=3.x)
- **Docker** (Required for running DynamoDB locally)

## Installation and Setup

**Clone the repository:**

```bash
git clone https://github.com/Bshal/question-rotation-system.git
cd question-rotation-system
npm install
```

## Running the Application

1. **Start the application**:
   Start both Serverless Offline and DynamoDB Local by running:
   ```bash
   npm run dev
   ```
2. **Seed the database**:
   Once the application is running, seed the database with initial data:
   ```bash
   npm run seed
   ```
   This will populate the `QuestionsTable` and `CycleConfigTable` with predefined data for testing

## API Endpoints

**- Get Current Question**

- **URL**: `/dev/currentQuestion`
- **Method**: `GET`
- **Query Parameters**:
  - `region`: The region for which the question should be fetched (e.g., `Singapore`, `US`).

_Example Request_:

```bash
GET /dev/currentQuestion?region=Singapore
```

**- Update Cycle Configuration**

- **URL**: `/dev/updateCycleConfig`
- **Method**: `POST`
- **Request Body**:
  - `region`: The region to update (e.g., `US`)
  - `currentCycle`: The new current cycle.
  - `cycleDuration`: The new cycle duration (in days).

_Example Request_:

```bash
POST /dev/updateCycleConfig
Content-Type: application/json

{
  "region": "US",
  "currentCycle": 2,
  "cycleDuration": 14
}
```

## How AWS Helps in Scaling

- **Serverless Architecture**
  AWS Lambda automatically scales the number of function instances based on the number of requests, meaning you don’t need to worry about provisioning or managing servers.

- **DynamoDB On-Demand Scaling**
  DynamoDB’s on-demand scaling allows it to handle thousands of requests per second by scaling horizontally, ensuring that your database can grow as your application load increases.

## Pros and Cons of Using AWS

### Pros:

- **Scalable:** AWS Lambda and DynamoDB auto-scale with user growth.
- **Cost-Effective:** Pay only for the compute power used (serverless model).
- **Global Reach:** Easily deploy across multiple regions for low-latency.
- **Reliable:** Built-in monitoring and high availability.

### Cons:

- **Cold Starts:** Delays can occur during function startup.
- **Vendor Lock-In:** Migrating away from AWS requires effort.
