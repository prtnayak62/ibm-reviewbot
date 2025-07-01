// Placeholder for gitWebhook.controller.js

"use strict"

/**
 * @module Register-Customer 
 * @Author Liton Kar
 * @Description This module will register new customer. This function will commnicate with model file.
 *
 */

const Validator = require('jsonschema').Validator;
const v = new Validator();
const logger = require('../../helpers/logger/logger');
const express = require('express');
const bodyParser = require('body-parser');
const webhookModule = require('../../models/watsonapi/gitWebhook.model');
const gitWebhook = new webhookModule();

const path = require('path');
const app = express();
const PORT = 3000;
const SECRET = 'your_webhook_secret'; // GitHub/GitLab secret

//app.use(bodyParser.json({ verify: verifySignature }));
 const handleWebhook = (req, res) => {
  //const event = req.headers['x-github-event'] || req.headers['x-gitlab-event'];
  const payload = req.body;

  logger.info(` Webhook Received: ${payload.event}`);
 logger.info(`Payload - ${JSON.stringify(payload)}`);
        gitWebhook.gitReview(payload).then((result) => {
                       logger.debug(`gitWebhook ==> handleWebhook :: Response - Success--${JSON.stringify(result)}`);
                       res.status(200).json(result);
                   }).catch((err) => {
                    console.log(err);
                       logger.error(`gitWebhook ==> handleWebhook  :: Error -${JSON.stringify(err)}`);
                       res.json(err);
                   })
  // Example: Only process push events
};


module.exports = {
    handleWebhook
} 