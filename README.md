# Microservices Architecture Project

http://adfcd14b75d81470abbe4b3056fb30b5-1454631012.ap-southeast-2.elb.amazonaws.com/

## Overview

This project is a culmination of the knowledge and skills acquired from a comprehensive <a href="https://www.udemy.com/course/microservices-with-node-js-and-react">Udemy course</a> by Stephen Grider. In addition to the course I deployed infrastructure using Terraform to AWS EKS across 2 regions to ensure availability, reliability and scalability of the application. While the frontend and functionality of the application are lacking this project is to demonstrate my skillset in devops and application architecture design and I will be taking the learnings from this project and using it as a template going forward to create scalable and reliable applications quickly.

### Technologies Used

- **Frontend:** React, Next.js, JavaScript
- **Backend:** Node.js, Express, TypeScript
- **Databases:** MongoDB, Redis
- **Deployment:** Docker, Kubernetes, Terraform, AWS EKS, CI/CD with github actions

### What This Project Demonstrates

- Architecting scalable apps using microservices.
- Deploying a multi-service app with Docker and Kubernetes.
- Solving concurrency issues in distributed systems.
- Building a Server-Side Rendered React App to render data from microservices.
- Sharing reusable code between multiple Express servers using custom NPM packages.
- Writing comprehensive tests for each service.
- Communicating data between services with an event bus.
- Writing production-level code, with no shortcuts.
- Terraform and Infrastructure as Code experience
- AWS cloud and EKS experience
- Continuous Integration and Continuous Deployment with Github Actions

### Application Features
The application is a ticket onselling site 
- Sign up, Sign in, Sign out (JWT/Cookies)
- It lets users list tickets for sale
- Buy other users tickets with the stripe API
- Hold tickets for 15mins while another user is in the checkout process
- View ticket order and purchase history
