# Vercel Deployment Guide - Admin Functionality Fix

## What Changed?

The admin functionality now uses **MongoDB** instead of the filesystem, which is necessary because Vercel's serverless environment doesn't persistently store files on disk. All changes have been made to:

- ✅ **lib/db.ts** - Migrated to MongoDB with connection pooling
- ✅ **lib/auth.ts** - Uses environment variables for credentials
- ✅ **API routes** - Updated to handle async database calls
- ✅ **package.json** - Added MongoDB driver

## Setup Instructions

### 1. Create a MongoDB Database

**Option A: Free MongoDB Atlas (Recommended)**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new Project
4. Create a new Cluster (select the free tier M0)
5. Wait for cluster to be deployed (~10 min)
6. Click "Connect" and select "Drivers"
7. Choose Node.js as driver
8. Copy the connection string and replace `<username>` and `<password>` with your actual credentials
9. The URI should look like: `mongodb+srv://username:password@cluster.mongodb.net/smilecraft?retryWrites=true&w=majority`

**Option B: MongoDB Community (Local Development)**
- For local testing, you can use `mongodb://localhost:27017/smilecraft`

### 2. Set Environment Variables on Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add the following variables:

```
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/smilecraft?retryWrites=true&w=majority
ADMIN_EMAIL = smilecraftdental@gmail.com
ADMIN_PASSWORD = ibrahimghani
SESSION_SECRET = (generate a random string, e.g., using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
EMAIL_USER = your-email@gmail.com
EMAIL_PASSWORD = your-app-specific-password
ADMIN_NOTIFICATION_EMAIL = admin@smilecraftdental.com
NODE_ENV = production
```

**.env.local** (For local development):
Create a `.env.local` file in your project root with the same variables.

### 3. Update Credentials

Replace the default credentials:
- **ADMIN_EMAIL**: Change from `smilecraftdental@gmail.com` to your email
- **ADMIN_PASSWORD**: Change from `ibrahimghani` to a secure password
- **SESSION_SECRET**: Generate a random secret (store securely)

### 4. Install Dependencies

```bash
npm install
# or
yarn install
```

### 5. Deploy to Vercel

```bash
vercel
# or push to GitHub and auto-deploy
```

## Testing the Admin Panel

1. Navigate to `https://your-domain.vercel.app/admin/login`
2. Log in with your configured credentials
3. Create a test appointment
4. Verify it appears in the admin dashboard
5. Test updating and deleting appointments

## Troubleshooting

### "Unauthorized" Error When Logging In
- Check environment variables are set correctly on Vercel
- Verify ADMIN_EMAIL and ADMIN_PASSWORD match your configured values
- Clear browser cookies and try again

### Appointments Not Appearing After Creation
- Verify MongoDB connection string is correct
- Check that MONGODB_URI is set in Vercel environment variables
- Check Vercel function logs for connection errors

### Connection Timeout Errors
- Ensure your MongoDB IP whitelist includes Vercel IPs (usually allow all: `0.0.0.0/0`)
- Check MongoDB cluster is running
- Verify database name matches ("smilecraft")

### View Logs
In Vercel dashboard:
1. Click your project
2. Go to **Deployments** → Select latest deployment
3. Click **Runtime Logs** to see errors

### Rolling Back
If deployment fails, Vercel automatically keeps previous working versions. Click the previous deployment to revert.

## Security Best Practices

1. **Never commit `.env.local`** - Add it to `.gitignore`
2. **Use strong passwords** - Generate secure SESSION_SECRET
3. **Rotate credentials** - Change ADMIN_PASSWORD periodically
4. **Limit MongoDB access** - Only allow necessary IP addresses
5. **Use HTTPS only** - Vercel provides free SSL certificates

## File Storage (Alternative)

If you want to keep using file storage, you can use:
- **Vercel KV** - Built-in Redis storage
- **AWS S3** - Cloud file storage
- **Supabase** - PostgreSQL database

Contact support if you need help migrating to these alternatives.

## Cost

- **MongoDB Atlas**: Free tier includes 512MB storage (sufficient for most small businesses)
- **Vercel**: Free tier includes serverless functions
- **Total**: Totally free to start

Upgrade to paid plans as your app grows.
