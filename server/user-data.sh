#!/bin/bash
yum update -y
yum install -y nodejs

# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
yum install -y unzip
unzip awscliv2.zip
./aws/install

# Create app directory
mkdir -p /opt/algo360fx
cd /opt/algo360fx

# Download and extract application
aws s3 cp s3://algo360fx-deployment/app.zip .
unzip app.zip

# Install dependencies
npm install

# Start the application
npm start
