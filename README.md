# 🔍 WatsonX Code Review Automation

A Node.js-based intelligent code review system that analyzes the latest GitLab commit using IBM WatsonX, and emails a structured review report to the developer. Designed to integrate into CI/CD pipelines or run standalone.

---

## 🚀 Features

- 🔄 **Auto-triggered on Git push** via GitLab/GitHub webhook.
- 🧠 **WatsonX LLM Integration** for intelligent Node.js code analysis.
- 📩 **Email Delivery** of review to last commit author using Nodemailer & Outlook SMTP.
- 📁 **GitLab API** for fetching raw code content for modified files.
- 🛠️ Built for **modular use** and **easy integration** in enterprise-grade systems.

---

## 🧠 How It Works

1. A push event triggers the Git webhook.
2. The system identifies the last commit and modified `.js` files.
3. For each file:
   - Fetches raw source from GitLab.
   - Sends the code to WatsonX for review.
4. WatsonX returns detailed suggestions.
5. A formatted report is created and emailed to the committer.

---

## 🗂️ Folder Structure

```plaintext
watsonx-code-review-bot/
├── server/
│   ├── controllers/
│   │   └── gitWebhook/
│   │       └── gitWebhook.controller.js
│   ├── helpers/
│   │   ├── config/
│   │   │   ├── dbconfig.js
│   │   │   ├── utilsconfig.js
│   │   │   └── VCAP_SERVICES.json
│   │   ├── logger/
│   │   │   └── logger.js
│   │   ├── resource/
│   │   │   ├── db-script/
│   │   │   │   └── db-script.json
│   │   │   └── errorcode/
│   │   │       └── error-code.js
│   ├── models/
│   │   ├── watsonapi/
│   │   │   └── gitWebhook.model.js
│   │   └── customer/
│   │       ├── registerDongle.model.js
│   │       └── verifyContactNo.model.js
├── package.json
├── package-lock.json
├── README.md
