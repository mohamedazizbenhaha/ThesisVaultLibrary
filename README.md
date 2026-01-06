# Thesis Vault - Setup Instructions

## 1. Database Setup (IMPORTANT - Do this first!)

You need to run the SQL schema in your Neon database console:

1. Go to [Neon Console](https://console.neon.tech)
2. Select your database
3. Open the SQL Editor
4. Copy and paste the contents of `schema.sql`
5. Click "Run" to execute the SQL

This will create the `theses` table with sample data.

## 2. Environment Variables

The `.env.local` file has been created with your credentials:
- Database URL: Already configured
- Admin username: `admin`
- Admin password: `admin123`

**Change the admin password in production!**

## 3. Start the Development Server

```bash
cd vault
npm run dev
```

The app will be available at `http://localhost:3000`

## 4. Test the Application

### Public Site
- Visit `http://localhost:3000`
- You should see 3 sample theses
- Try searching and filtering

### Admin Dashboard
- Visit `http://localhost:3000/manage/login`
- Login with: username `admin`, password `admin123`
- View dashboard statistics
- Try adding a new thesis
- Try editing an existing thesis
- Try deleting a thesis

## 5. API Endpoints

- `GET /api/theses` - Get all theses (public)
- `GET /api/theses/:id` - Get single thesis (public)
- `POST /api/auth` - Login (returns JWT token)
- `POST /api/theses` - Create thesis (requires auth)
- `PUT /api/theses/:id` - Update thesis (requires auth)
- `DELETE /api/theses/:id` - Delete thesis (requires auth)

## 6. Deployment to Netlify

1. Push your code to GitHub
2. Connect your repo to Netlify
3. Add environment variables in Netlify dashboard:
   - `DATABASE_URL`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `JWT_SECRET`
4. Deploy!

## Features Implemented ✅

- ✅ Public browsing interface with search and filters
- ✅ Beautiful thesis cards with hover effects
- ✅ Admin login with JWT authentication
- ✅ Admin dashboard with statistics
- ✅ Add new thesis with direct URL inputs
- ✅ Edit existing theses
- ✅ Delete theses
- ✅ Image URL previews
- ✅ Responsive design
- ✅ Modern UI with gradients and animations
- ✅ Netlify serverless functions ready
- ✅ Neon database integration

## Asset Specifications & Guidance

To maintain the premium look of the Thesis Vault, please follow these guidelines for visual assets:

### 1. Research Cover Images
- **Aspect Ratio**: **16:9** (e.g., 1920x1080 or 1280x720).
- **Style**: Professional, high-resolution images or minimalist abstract designs.
- **Format**: JPG or WebP (optimized for web).
- **Size Example**: **1280 x 720 px** is ideal for sharp display.
- **Tip**: Use consistent lighting if multiple covers are displayed together.

### 2. University/Institution Logos
- **Style**: Rectangular orientation is preferred.
- **Padding**: Ensure logos are cropped closely (minimal white space).
- **Format**: Transparent PNG or SVG is highly recommended.
- **Size Example**: **400 x 200 px** or similar rectangular dimensions.
- **Fitting**: The system uses `object-cover` to fill the rectangular badge, so ensure the main brand mark is centered.

### 3. Author Icons
- **Aspect Ratio**: **1:1** (Square).
- **Style**: Clear portraits or high-quality avatars.
- **Format**: PNG, JPG or WebP.
- **Size Example**: **200 x 200 px** is perfect for circular bubbles.
- **Fitting**: Displayed as circular bubbles; centered portraits work best.

---

## 🔒 Security Trick
The admin dashboard is obfuscated behind the path `/lab_gate_accessx82`.
- **Hidden Access**: On the homepage, hold **Ctrl + Shift** and click the logo to navigate to the admin portal.

## Next Steps

1. Run the database schema
2. Start the dev server
3. Test all features
4. Customize colors/styling if needed
5. Deploy to Netlify
