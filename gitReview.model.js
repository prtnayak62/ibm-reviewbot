const Validator = require('jsonschema').Validator;
const v = new Validator();
const async = require('async');
const axios = require('axios');
const logger = require('../../helpers/logger/logger');
const responseCode = require('../../helpers/resource/errorcode/error-code');
const utill = require('../../helpers/config/utilsconfig')
const config = utill.EnvConfiguration();


const emailModule = require('../../models/customer/verifyContactNo.model');
const email = new emailModule();




const nodemailer = require('nodemailer');
function codeReviewApp() {
    const gitReview = (param) => {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (callback) => {

                    if (param.event_name !== 'push') {
                        return callback('Not a push event');
                    }
                    const commits = param.commits || [];


                    const lastCommit = commits[commits.length - 1];
                    const prevCommit = commits.length >= 2 ? commits[commits.length - 2] : null;

                    let lastCommitBody = {
                        "projectId": param.project_id,
                        "lastCommit": lastCommit,
                        "prevCommit": prevCommit,
                        "branch": param.ref,
                        "pusher": param.pusher?.name || param.user_name,
                        "repo": param.repository?.name
                    }
                    //logger.info(`Push detected:  ${JSON.stringify(lastCommitBody)} `);

                    //  logger.info(` Push detected on ${branch} by ${pusher} in ${repo}`);

                    callback(null, lastCommitBody);

                    // TODO: Call your Watsonx review script here

                }, (input, callback) => {
        const gitlabToken = "*******************";
        const allJsFiles = [
          ...(input.lastCommit.modified || []),
          ...(input.lastCommit.added || [])
        ].filter(file => file.endsWith('.js'));

        input.jsFiles = allJsFiles;
        input.codeMap = {}; // key: filepath, value: code

        async.eachSeries(allJsFiles, async (filePath) => {
          const code = await callGitLab(input.projectId, filePath, input.lastCommit.id, gitlabToken);
          input.codeMap[filePath] = code;
        }, (err) => {
          if (err) {
            logger.error(`callGitLab error: ${JSON.stringify(err)}`);
            return callback(err);
          }
          callback(null, input);
        });
      }, (input, callback) => {

                    logger.info(`callWatsonXIAM: `);
                    callWatsonXIAM().then((res) => {
                        input.watsonxToken = res;
                        //logger.info(`callWatsonXIAM:  ${JSON.stringify(input)} `);
                        callback(null, input)
                    }).catch((err) => {
                        console.log(err);
                        logger.error(`callWatsonXIAM ==> -${JSON.stringify(err) || err.toString() || err}`);
                        callback(err, null);
                    })
                }, (input, callback) => {
        logger.info(`callWatsonXAPI for all files...`);
        const fileReviews = [];

        async.eachSeries(Object.entries(input.codeMap), async ([filePath, code]) => {
          const prompt = `
You are a senior software engineer.
Please analyze the following Node.js code and provide a review in this format:

### Review for ${filePath}

#### Detected Methods:
- method1
- method2

---

### WatsonX Suggestions:

#### method1:
1. **Purpose**: What this method does.
2. **Issues**:
   - Bullet list of problems.
3. **Suggestions**:
   - Bullet list of improvements.

---

Here is the source code:
${code}
`;

          const watsonResponse = await callWatsonXAPI(input.watsonxToken, prompt);
          const content = watsonResponse?.choices?.[0]?.message?.content || '';
          fileReviews.push(content);
        }, (err) => {
          if (err) return callback(err);
          input.watsonreview = fileReviews.join('\n\n');
          callback(null, input);
        });
      }, (input, callback) => {
                    console.log(input);
                    const reviewContent = `
Hi priti,
Here is the code review for your recent commit:
---
 **Commit ID**: ${input.lastCommit.id}  
**last pusher Name**: ${input.pusher}
**last respository Name**: ${input.repo}
**Files Reviewed**:  
${input.jsFiles.map(f => `- ${f}`).join('\n')}
---
**Purpose**:
Handles incoming webhook events from GitHub/GitLab and logs pusher details.
WatsonReview : ${input.watsonreview}


---

Let us know if you’d like help implementing these improvements.

Best regards,  
WatsonX Code Review Bot
`;
                   
                     let inputParam = {
                                            "senderName": "*************",
                                            "senderEmail": "*****************",
                                            "receiverEmail": '**************',
                                            "emailSubject": `Code Review Feedback - Commit by ${input.pusher}`,
                                            "emailBody": `${reviewContent}`
                                        }
                                        email.sendEmail(inputParam).then((result) => {
                                            callback(null, result);
                                        }).catch((err) => {
                                            callback(err, null);
                                        });
                    
                   

                }


            ],
                (err, result) => {
                    if (err) {
                        let error = {
                            data: {},
                            status: err
                        }
                        reject(error);
                    } else {
                        resolve(result);
                    }
                });
        });
    }





    // const axios = require('axios');

    const callGitLab = async (projectId, filePath, ref, token) => {
        const encodedProjectId = encodeURIComponent(projectId); // Usually just project ID like "2986"
        const encodedFilePath = encodeURIComponent(filePath);   // e.g. "server/controllers/gitWebhook/gitWebhook.controller.js"
        const cleanRef = ref.replace('refs/heads/', '');
        //console.log("encodedProjectId",encodedProjectId);
        //console.log("encodedFilePath",encodedFilePath);

        const url = `************/${encodedProjectId}/repository/files/${encodedFilePath}/raw?ref=${cleanRef}`;
        //console.log(url);
        //console.log('Requesting GitLab URL:', url);

        try {
            const response = await axios.get(url, {
                headers: {
                    'PRIVATE-TOKEN': token
                }
            });
            return response.data;
        } catch (err) {
            console.error(`Error fetching file from GitLab:`, err.response?.data || err.message);
            throw err;
        }
    }

    const callWatsonXAPI = async (accessToken, promptText) => {
        try {
            const modelId = "*****************";     // e.g. "ibm/granite-13b-chat-v2"
            const projectId = "***************"; // Your WatsonX Project ID

            const response = await axios.post('https://ca-tor.ml.cloud.ibm.com/ml/v1/text/chat?version=2023-05-29', {
                model_id: modelId,
                project_id: projectId,
                messages: [
                    {
                        role: 'user',
                        content: promptText
                    }
                ],

                max_new_tokens: 400
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data;
        } catch (error) {
            console.error(' Error calling WatsonX API:', error.response?.data || error.message);
            throw error;
        }
    }

    const callWatsonXIAM = async () => {
        try {
            const response = await axios.post('https://iam.cloud.ibm.com/identity/token',
                new URLSearchParams({
                    'grant_type': 'urn:ibm:params:oauth:grant-type:apikey',
                    'apikey': "********************",  // Use env var
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            return response.data.access_token;
        } catch (error) {
            console.error('Error getting WatsonX IAM token:', error.response?.data || error.message);
            throw error;
        }
    }

    const transporter = nodemailer.createTransport({
        host: '*********',
        port: 587,
        secure: false, // use TLS
        auth: {
            user: '*********', // e.g. pritnay1@in.ibm.com
            pass: '********' // Best to use App Password if 2FA enabled
        },
        tls: {
            ciphers: 'SSLv3'
        }
    });

function sendMail(mailOptions) {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return reject(error);
      }
      resolve(info);
    });
  });
}


    return {
        gitReview,
        callGitLab,
        callWatsonXAPI,
        callWatsonXIAM,
        transporter,sendMail

    }
}

module.exports = codeReviewApp;