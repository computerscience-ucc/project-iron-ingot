# Facebook Messenger Integration — Complete Setup Guide

This guide walks you through creating a Meta app, connecting your Facebook Page, and configuring the webhook so the custom Messenger widget works on the UCC INGO website.

---

## Prerequisites

Before starting, make sure you have:

- [ ] **Admin or Editor access** to the UCC CS Council Facebook Page
- [ ] A **personal Facebook account** (needed to create a Meta Developer account)
- [ ] The UCC INGO website running locally or deployed

---

## Part 1: Create a Meta Developer Account

1. Go to [https://developers.facebook.com](https://developers.facebook.com)
2. Click **"Get Started"** in the top right
3. Log in with your personal Facebook account
4. Accept the Meta Developer Terms
5. Verify your email address

You now have a Developer account.

---

## Part 2: Create a Meta App

1. Go to [https://developers.facebook.com/apps/creation/](https://developers.facebook.com/apps/creation/)
2. On the **"Create an app"** page:
   - **App name**: Enter `UCC INGO Messenger` (or any name you want)
   - **App contact email**: Your email address
   - Click **Next**
3. On the **"Use cases"** screen:
   - Select **"Business messaging"** (it should be under the Featured or All tab)
   - Click **Next**
4. On the **"Business"** screen:
   - Select your **Business Account** if you have one, or create one
   - A Business Account is required for Messenger — click **"Create a business portfolio"** if you don't have one
   - Click **Next**
5. On the **"Requirements"** screen:
   - You'll see what permissions are needed — this is normal
   - Click **Submit** or **Create App**
6. You'll be redirected to your new App Dashboard

> **Important:** Write down your **App ID** — you'll find it in the dashboard under "App Details" or in the URL.

---

## Part 3: Add the Messenger Product

1. In your App Dashboard, you should see a list of products to add
2. Find **"Messenger"** and click **"Set up"**
   - If you don't see it, go to **Products** in the left sidebar and add it
3. You're now in the Messenger settings

---

## Part 4: Connect Your Facebook Page

1. In the Messenger settings, look for **"Token Generation"** or **"Generate access tokens"**
2. Select your **UCC CS Council Facebook Page** from the dropdown
3. Click **"Generate Token"**
4. **Copy the token immediately** — this is your `FB_PAGE_ACCESS_TOKEN`
   - It will look something like: `EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **Save this somewhere safe** — you won't be able to see it again

---

## Part 5: Get Your Page ID

1. Go to your Facebook Page: [https://www.facebook.com/UCCBSCS2022](https://www.facebook.com/UCCBSCS2022)
2. Click **Settings** (or **Manage Page** → **Settings**)
3. In the left sidebar, click **"General"**
4. Find **"Page ID"** at the top
5. **Copy the Page ID** — this is your `FB_PAGE_ID`

---

## Part 6: Get Your App Secret

1. Go back to your App Dashboard: [https://developers.facebook.com](https://developers.facebook.com)
2. Click on your app name in the top left
3. In the left sidebar, go to **Settings** → **Basic**
4. Find **"App Secret"** — click **"Show"** and enter your password
5. **Copy the App Secret** — this is your `FB_APP_SECRET`

---

## Part 7: Create a Verify Token

This is a **custom string you make up yourself** — it's not from Meta.

1. Open your `.env` file in the project
2. For `FB_VERIFY_TOKEN`, enter any string you want, for example:
   ```
   FB_VERIFY_TOKEN=ucc-messenger-2026
   ```
3. **Remember this string** — you'll enter it in the Meta Developer Console too

---

## Part 8: Set Up the Webhook

> **Important:** Your webhook URL must be publicly accessible. For local development, use ngrok (see Part 8a). For production, use your Vercel/Next.js deployment URL.

### Part 8a: For Local Development (ngrok)

1. Install ngrok: [https://ngrok.com](https://ngrok.com)
2. In a new terminal, run:
   ```bash
   ngrok http 3000
   ```
3. Copy the **HTTPS URL** it gives you (e.g., `https://abc123.ngrok-free.app`)
4. Your webhook URL will be: `https://abc123.ngrok-free.app/api/messenger/webhook`

### Part 8b: Configure the Webhook in Meta

1. In the Messenger settings, find **"Webhooks"** section
2. Click **"Subscribe to Events"** or **"Add callback URL"**
3. Enter:
   - **Callback URL**: Your webhook URL (e.g., `https://abc123.ngrok-free.app/api/messenger/webhook`)
   - **Verify Token**: The same string you put in `FB_VERIFY_TOKEN` (e.g., `ucc-messenger-2026`)
4. Click **"Verify and Save"**
   - You should see a success message — this means the verification worked
5. In the event subscription list, check **"messages"**
6. Click **Save**

---

## Part 9: Update Your .env File

Open `.env` and fill in all four values:

```env
# Facebook Messenger (Meta Graph API — server-only, no NEXT_PUBLIC_ prefix)
FB_PAGE_ID=your_page_id_here
FB_APP_SECRET=your_app_secret_here
FB_VERIFY_TOKEN=ucc-messenger-2026
FB_PAGE_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## Part 10: Test It

1. Restart your dev server:
   ```bash
   npm run dev
   ```
2. Open the website in your browser
3. Click the **Messenger chat bubble** (blue circle, left of the CSBot)
4. Type a message and send it
5. Go to your **Facebook Page Inbox** → [https://www.facebook.com/UCCBSCS2022/inbox](https://www.facebook.com/UCCBSCS2022/inbox)
6. You should see the message there
7. **Reply from the Facebook Page Inbox**
8. The reply should appear in the chat widget on the website

---

## Part 11: Deploy to Production (Vercel)

1. Add the environment variables in the Vercel Dashboard:
   - Go to your project → **Settings** → **Environment Variables**
   - Add these four variables:
     | Key | Value |
     |---|---|
     | `FB_PAGE_ID` | Your Page ID |
     | `FB_APP_SECRET` | Your App Secret |
     | `FB_VERIFY_TOKEN` | Your verify token |
     | `FB_PAGE_ACCESS_TOKEN` | Your Page Access Token |
2. Update the webhook URL in Meta Developer Console:
   - Change from ngrok URL to: `https://your-vercel-domain.vercel.app/api/messenger/webhook`
   - Verify again

---

## Troubleshooting

| Problem                                                   | Solution                                                                                 |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| "Messenger is not configured" error                       | Check that all 4 env vars are set in `.env` and restart the server                       |
| Webhook verification fails                                | Make sure `FB_VERIFY_TOKEN` in `.env` matches what you entered in Meta Developer Console |
| Messages sent from website don't appear in Facebook Inbox | Check `FB_PAGE_ACCESS_TOKEN` — it must have `pages_messaging` permission                 |
| Messages from Facebook don't appear in the widget         | Check that the webhook is subscribed to the `messages` event and your server is running  |
| Webhook URL not working locally                           | Use ngrok and make sure it's running before testing                                      |
| Token expired                                             | Page Access Tokens expire — regenerate one in the Meta Developer Console                 |

---

## Reference: App ID Location

If you need your **App ID** for any reason:

1. Go to [https://developers.facebook.com](https://developers.facebook.com)
2. Click on your app
3. Go to **Settings** → **Basic**
4. **App ID** is displayed at the top

---

## Summary of Values

| Variable               | Where to get it                                              | Example              |
| ---------------------- | ------------------------------------------------------------ | -------------------- |
| `FB_PAGE_ID`           | Facebook Page → Settings → General → Page ID                 | `1234567890`         |
| `FB_APP_SECRET`        | Meta Developer Console → App → Settings → Basic → App Secret | `abc123xyz...`       |
| `FB_VERIFY_TOKEN`      | You make this up (any string)                                | `ucc-messenger-2026` |
| `FB_PAGE_ACCESS_TOKEN` | Meta Developer Console → App → Messenger → Token Generation  | `EAAxxxx...`         |

---

_Created for the UCC INGO Facebook Messenger Integration project._
