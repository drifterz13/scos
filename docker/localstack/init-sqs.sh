#!/bin/bash
echo "Initializing LocalStack SQS..."

awslocal sqs create-queue --queue-name local-scos-order-to-warehouse-queue
awslocal sqs create-queue --queue-name local-scos-warehouse-to-order-queue
awslocal sqs list-queues
