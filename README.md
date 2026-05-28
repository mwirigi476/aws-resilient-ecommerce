# aws-resilient-ecommerce# Capstone Project: Resilient, Scalable, and Recoverable AWS Infrastructure

## 🏗️ Production Architecture Blueprint
This repository hosts a production-grade, highly available, and decoupled three-tier e-commerce microservices application deployed manually using the AWS Management Console.

### 🛡️ Single Point of Failure (SPOF) Removal Analysis
1. **Network Infrastructure Integration**: Provisions Multi-AZ networks with distinct public and isolated private subnets across availability zones `eu-north-1a` and `eu-north-1b`. This removes physical facility down-time vectors.
2. **Compute Architecture Layer**: Deploys front-facing Node.js application tasks inside Amazon ECS Fargate clusters across independent zones, managed by an Application Load Balancer (ALB).
3. **Storage Tier Decoupling**: Implements Amazon RDS PostgreSQL using a synchronous **Multi-AZ instance configuration (2 instances)**, guaranteeing sub-minute failovers to an isolated standby zone if the primary node crashes.
4. **Active Session Durability**: Integrates **DynamoDB Global Tables** to maintain fully synchronized, cross-region state replication for ongoing shopping-cart user sessions.

---

## 📈 Scalability, Caching, and Load Testing Metrics
- **Messaging Pipeline**: Connects an asynchronous **Amazon SQS Ingestion Queue** (`ecommerce-order-queue`) to decouple high-volume transactional checkout calls from downstream computational tasks.
- **Microservices Worker Scaling**: Backend Fargate containers evaluate queue metrics. If workloads spike, target tracking scaling adjustments dynamically scale the task pool from 1 to 4 instances.
- **Hot Caching Subtier**: Integrates **Amazon ElastiCache Redis** to cache repetitive product inventory lists, cutting database latency down to sub-milliseconds.

---

## 🚒 Disaster Recovery (DR) Parameters & Runbook

Our system maps business continuity objectives directly to AWS services:
- **Target RTO (Recovery Time)**: < 15 Minutes
- **Target RPO (Recovery Point)**: < 5 Minutes

### Active Failover Verification Actions
1. **Infrastructure Health Status Monitoring**: Amazon Route 53 continuously samples the health endpoint (`/health`) of our active primary Application Load Balancer.
2. **Automated Traffic Redirection**: If a region-wide outage occurs, Route 53 DNS Failover routing tables automatically switch active endpoints over to your configured backup disaster recovery site.
3. **Data Loss Protection**: Managed lifecycle policies inside **AWS Backup** enforce daily data snapshots for both RDS and DynamoDB with a strict 14-day retention cycle.

---

## 🧠 Architectural Reflections & Financial Trade-offs
- **Cost vs. Resilience**: Utilizing active Multi-AZ networks, twin database clusters, and persistent NAT Gateway pathways incurs higher ongoing charges. However, this investment is necessary to prevent costly downtime for an enterprise e-commerce platform.
- **Complexity vs. Reliability**: Introducing an SQS queue increases the number of application components to monitor, but it protects our database from failing under heavy traffic loads by smoothing out unpredictable promotional spikes.
