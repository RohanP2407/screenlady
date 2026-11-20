# Accolade Screenlady — Cloudflare Worker Backend

Independent serverless backend powered by **Cloudflare Workers**, **Hono**, and **ImageKit.io** for media optimization, CDN delivery, magazine orders, and Razorpay payment integration.

---

## 🚀 Quick Start

### 1. Run Backend Locally
In the `backend` directory, run:
```powershell
npm run dev
```
The Worker will start locally at **`http://localhost:8787`**.

### 2. Deploy to Cloudflare Workers
```powershell
npm run deploy
```
This deploys the worker globally to Cloudflare's edge network under your Cloudflare account.

---

## 🖼️ ImageKit.io Media Setup

### 1. Get ImageKit Credentials
Sign up or log in to [ImageKit.io](https://imagekit.io) and open your **Developer Options** dashboard:
* **URL-Endpoint**: e.g. `https://ik.imagekit.io/accoladescreenlady`
* **Public Key**: e.g. `public_xxxxxx`
* **Private Key**: e.g. `private_xxxxxx`

### 2. Configure Cloudflare Secrets
Set your ImageKit credentials in Cloudflare:
```powershell
npx wrangler secret put IMAGEKIT_PRIVATE_KEY
```
Wrangler will securely prompt you to paste your ImageKit private key.

In `backend/wrangler.jsonc`, confirm or update your `IMAGEKIT_URL_ENDPOINT` and `IMAGEKIT_PUBLIC_KEY`:
```json
"vars": {
  "IMAGEKIT_URL_ENDPOINT": "https://ik.imagekit.io/accoladescreenlady",
  "IMAGEKIT_PUBLIC_KEY": "public_xxxxxx"
}
```

---

## 💳 Razorpay Secrets Setup

When you are ready to enable live magazine payments:
```powershell
npx wrangler secret put RAZORPAY_KEY_ID
npx wrangler secret put RAZORPAY_KEY_SECRET
```
Wrangler will securely prompt you to paste your secret values.

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | API status, health check, and active services |
| `GET` | `/api/imagekit/auth` | Client-side ImageKit upload authentication tokens |
| `POST` | `/api/media/upload` | Upload new photo/asset directly to ImageKit Media Library |
| `GET` | `/api/media/:path` | Proxy or redirect to ImageKit global CDN |
| `POST` | `/api/orders` | Place magazine order (Name, Phone, Address, Issue) |
| `GET` | `/api/orders` | View recent orders (session list) |
| `POST` | `/api/razorpay/create-order` | Create Razorpay payment order |
| `POST` | `/api/razorpay/verify` | Verify Razorpay HMAC-SHA256 payment signature |

---

## 🌐 CORS Configuration
The backend has CORS enabled for:
* `http://localhost:4321` (Local Astro frontend)
* `http://localhost:4322` (Local Admin Portal)
* `https://*.pages.dev` (Cloudflare Pages preview & production deployments)
* `https://accoladescreenlady.com` (Custom production domain)

