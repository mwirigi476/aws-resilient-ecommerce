const { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } = require("@aws-sdk/client-sqs");
const sqs = new SQSClient({ region: "eu-north-1" });
const queueUrl = process.env.QUEUE_URL;

async function poll() {
    try {
        const data = await sqs.send(new ReceiveMessageCommand({ QueueUrl: queueUrl, MaxNumberOfMessages: 5, WaitTimeSeconds: 10 }));
        if (data.Messages) {
            for (const msg of data.Messages) {
                console.log(`Processing background order task payload: ${msg.Body}`);
                await sqs.send(new DeleteMessageCommand({ QueueUrl: queueUrl, ReceiptHandle: msg.ReceiptHandle }));
            }
        }
    } catch (err) { console.error("Worker processing error", err); }
    setTimeout(poll, 1000);
}
poll();
