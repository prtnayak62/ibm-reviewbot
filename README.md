# 🔍 WatsonX Code Review Bot

This project automatically reviews the **last commit** using **WatsonX** for any added/modified `.js` files in a GitLab push event.

## 🚀 Features

- Automatically fetches latest committed `.js` files (added/modified).
- Calls WatsonX LLM to analyze and provide detailed code review.
- Sends review summary via Outlook email.
- Supports GitLab Webhooks.

---

## 🏗️ Architecture

1. GitLab webhook receives a **push** event.
2. The `gitReview.model.js`:
   - Identifies `.js` files in the last commit.
   - Fetches raw file content from GitLab using GitLab API.
   - Generates a code review prompt and calls WatsonX.
   - Sends review summary via email using **Outlook SMTP**.

---

## 🛠️ Configuration

### Setup `.env`:

