const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');

const {
    S3Client,
    PutObjectCommand
} = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_ACCESS_SECRET
    },
    region: 'us-west-2'
});

// Middleware to parse JSON requests
router.use(bodyParser.json());

// Webhook endpoint
router.post(process.env.WEBHOOK, async (req, res) => {
    console.log('Received Webhook Payload:', req.body);
    AWS.config.logger = console;

    // serialize json data
    const jsonData = JSON.stringify(req.body);

    // Generate unique s3 obj key
    const timestamp = Date.now();
    const objectKey = `web3hook-data/${timestamp}.json`;

    const bucketParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: objectKey,
        Body: jsonData,
        ContentType: 'application/json'
    };
    try {
        const data = await s3Client.send(new PutObjectCommand(bucketParams));
        console.log('Data stored in S3:', data);
        res.send(data)
    }
    catch (err) {
        console.log("Error", err);
        res.status(500).send('Failed to store in S3');
    }


});

module.exports = router;