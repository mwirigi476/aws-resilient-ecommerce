const express = require('express');
const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");
const app = express();
const sqs = new SQSClient({ region: "eu-north-1" });

app.use(express.json());
app.get('/health', (req, res) => res.status(200).send({ status: 'UP' }));

app.post('/order', async (req, res) => {
    try {
        const command = new SendMessageCommand({
            QueueUrl: process.env.QUEUE_URL,
            MessageBody: JSON.stringify({ orderId: Date.now(), items: req.body.items })
        });
        await sqs.send(command);
        res.status(202).send({ message: "Order successfully queued!" });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});
app.listen(8080, () => console.log('Web listener online on port 8080'));
