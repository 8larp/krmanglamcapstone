# Amazon ECS Demo: Node.js Express App Deployment Guide

This guide walks students through building, running, containerizing, and deploying a simple Express application on Amazon ECS using Amazon ECR.

---

## 1. Project Overview

This project demonstrates how to:

- build a simple Node.js + Express web application
- run it locally
- create a Docker image
- push the image to Amazon ECR
- deploy it on Amazon ECS

The app is a basic calculator web application that runs on port 3000.

---

## 2. Project Structure

```text
amazon-ecs-demo-with-node-express-main/
├── Dockerfile
├── .dockerignore
├── README.md
├── README_STUDENT_GUIDE.md
├── diagram/
└── sample-nodejs-app/
    ├── app.js
    ├── index.html
    ├── package.json
    ├── Dockerfile
    └── ...
```

The main application code is inside:

- `sample-nodejs-app/app.js`
- `sample-nodejs-app/index.html`
- `sample-nodejs-app/package.json`

---

## 3. Prerequisites

Students should have:

- Node.js installed
- npm installed
- Docker installed and running
- AWS CLI installed and configured
- An AWS account with permission to use ECR and ECS

Check your tools:

```bash
node -v
npm -v
docker --version
aws --version
```

Make sure AWS credentials are configured:

```bash
aws configure
```

---

## 4. Run the App Locally

Go to the app folder:

```bash
cd sample-nodejs-app
```

Install dependencies:

```bash
npm install
```

Start the app:

```bash
npm start
```

The app should start and print:

```text
server started on port 3000
```

Open in the browser:

```text
http://localhost:3000
```

You should see the calculator page.

---

## 5. Build the Docker Image

From the project root:

```bash
cd /Users/deepak/Downloads/amazon-ecs-demo-with-node-express-main
docker build -t krmanglam .
```

If you are inside the app folder, this also works:

```bash
cd sample-nodejs-app
docker build -t sample-nodejs-app .
```

Check if it builds successfully:

```bash
docker images
```

---

## 6. Run the Docker Container

Run the app in a container:

```bash
docker run --rm -p 3000:3000 --name krmanglam-test krmanglam
```

Open the browser:

```text
http://localhost:3000
```

If port 80 is already in use, use another available port, for example:

```bash
docker run --rm -p 8080:3000 krmanglam
```

Then browse:

```text
http://localhost:8080
```

---

## 7. Test the Calculator Functionality

The app supports simple arithmetic operations via form submission.

Examples:

- `7 + 3 = 10`
- `10 x 5 = 50`

You can test using curl:

```bash
curl -sS -X POST -d 'num1=7&num2=3&operator=%2B' http://localhost:3000
```

Expected result:

```text
That was easy, your result is: 10
```

---

## 8. Push the Image and Deploy on Amazon ECS Using the AWS Console

### Step 1: Create a repository in Amazon ECR

1. Open the AWS Console.
2. Go to `Amazon ECR`.
3. Click `Create repository`.
4. Name it: `sample-nodejs-app`.
5. Leave the default settings as they are.
6. Click `Create repository`.

### Step 2: Push the image to ECR

1. In the ECR repository page, click `View push commands`.
2. Copy the commands shown by AWS.
3. Run those commands in your terminal from the repository root.
4. This will authenticate Docker and push the built image to ECR.

> The AWS Console shows the exact Docker commands to use, so students can copy-paste the commands instead of writing them manually.

### Step 3: Create a cluster

1. Open the Amazon ECS console.
2. Click `Clusters`.
3. Click `Create cluster`.
4. Choose `EC2 Linux + Networking`.
5. Name the cluster: `sample-nodejs-app-cluster`.
6. Choose a single EC2 instance.
7. Use a public subnet.
8. Make sure the security group allows inbound HTTP on port 80.
9. Create the cluster.

### Step 4: Create a task definition

1. In ECS, go to `Task definitions`.
2. Click `Create new task definition`.
3. Choose `EC2`.
4. Provide a task definition name: `sample-nodejs-app`.
5. Click `Add container`.
6. Use:
   - Container name: `sample-nodejs-app`
   - Image: the ECR image URI
   - Port mapping: `80 (host) -> 3000 (container)`
7. Save the container settings.
8. Create the task definition.

### Step 5: Create a service

1. Go to your cluster.
2. Click `Create` and choose `Create service`.
3. Choose `Launch type: EC2`.
4. Select the task definition you created.
5. Set the service name: `sample-nodejs-app-service`.
6. Set desired number of tasks to `1`.
7. Keep other settings default unless your instructor asks otherwise.
8. Click `Create service`.

Once the service is running, the app should be reachable through the EC2 instance’s public IP or public DNS.

---

## 9. Important Notes

- Do not run multiple services on the same port if the port is already occupied.
- If `docker run -p 80:3000` fails, it usually means another app is using port 80.
- Use a free port like `3000` or `8080` while testing locally.
- Keep AWS resources clean after testing to avoid unnecessary charges.

---

## 10. Troubleshooting

### Docker build fails

Check:

```bash
docker --version
```

Make sure Docker Engine is running.

### App does not start

Check the logs:

```bash
npm start
```

Or when running containerized:

```bash
docker logs <container-name>
```

### App not reachable in browser

Check:

- the correct port mapping
- security group rules
- whether the app is listening on `0.0.0.0` inside the container
- whether the EC2 instance is public and reachable

---

## 11. Summary

This project demonstrates a complete application lifecycle:

1. build app locally
2. fix runtime and Docker issues
3. create Docker image
4. run container locally
5. push image to ECR
6. deploy on ECS

This is a practical introduction to containerized application deployment on AWS.

---

## 12. Useful Local Commands

```bash
# local app
cd sample-nodejs-app
npm install
npm start

# docker build
cd ..
docker build -t krmanglam .

# docker run
docker run --rm -p 3000:3000 krmanglam

# test app
curl -X POST -d 'num1=7&num2=3&operator=%2B' http://localhost:3000
```

---

## 13. Final Reminder

Always stop or clean up your AWS resources after the lab to prevent unexpected charges.

This project is meant to help students understand how a simple Node.js application is packaged, tested, and deployed in a real cloud environment.
