WatsonX-Agent-AI

Smart Git-integrated Code Review Assistant Powered by IBM WatsonX





🚀 Overview

WatsonX-Agent-AI is an automated code review solution that listens to Git push events, extracts the latest JavaScript file changes, analyzes the code using IBM WatsonX LLMs, and sends intelligent review suggestions directly to developers via email.

This agent makes pull request reviews smarter, faster, and insightful — ideal for teams aiming to improve code quality at scale.

📁 Folder Structure

watsonx-agent-ai/
├── server/
│   ├── controllers/
│   │   └── gitWebhook/
│   │       └── gitWebhook.controller.js
│   ├── helpers/
│   │   ├── config/
│   │   │   ├── utilsconfig.js
│   │   │   └── dbconfig.js
│   │   ├── logger/
│   │   │   └── logger.js
│   │   └── resource/
│   │       ├── errorcode/
│   │       │   └── error-code.js
│   │       └── db-script/
│   │           └── db-script.json
│   ├── models/
│   │   ├── customer/
│   │   │   └── verifyContactNo.model.js
│   │   └── watsonapi/
│   │       └── gitWebhook.model.js
│   └── customer/
│       └── registerDongle.model.js
├── package.json
└── README.md

💡 Key Features

✅ Handles GitLab/GitHub push events

🧠 Automatically reviews the last modified JavaScript files

🤖 Uses IBM WatsonX LLM for context-aware code analysis

📬 Sends email feedback to the author of the commit

🔐 Supports GitLab Private Token and IAM authentication

🛡️ Environment-driven security for secrets and credentials

📦 Setup & Configuration

1. Clone the Repository

git clone https://github.com/your-org/watsonx-agent-ai.git
cd watsonx-agent-ai

2. Install Dependencies

npm install

3. Environment Variables

Create a .env file:

PORT=3000
WEBHOOK_SECRET=your_webhook_secret
SMTP_USER=your_outlook_email
SMTP_PASS=your_app_password_or_login_pass
WATSONX_APIKEY=your_ibm_cloud_api_key
WATSONX_PROJECTID=your_project_id

🧪 How It Works

Git push triggers webhook

App receives payload, extracts last commit files

Each JS file fetched from GitLab API

Files sent as prompt to WatsonX API

Receives suggestions formatted in markdown

Sends result via Outlook SMTP to developer

📝 Example Email Review

Subject: Code Review Feedback - Commit by John Doe

Hi John,

Here is the code review for your recent commit:
...
WatsonReview:
### Review for server/controllers/gitWebhook/gitWebhook.controller.js
...

🤝 Contributions

Contributions, pull requests, or feedback are welcome. Please fork and raise a PR or open an issue.

📄 License

MIT License

👩‍💻 Author

Priti NayakIBM – WatsonX Innovation Bot