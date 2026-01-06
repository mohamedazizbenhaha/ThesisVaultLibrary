# 🚨 IMPORTANT: Initialize Your Database First!

## The Issue

Your application is running, but you're seeing errors because the **database table doesn't exist yet**. 

The error shows: `TypeError: data.filter is not a function` and `500 Internal Server Error` when calling `/api/theses`.

This happens because the Neon database doesn't have the `theses` table created yet.

---

## ✅ Solution: Run the SQL Schema

You must run this **ONCE** in your Neon database console:

### Step-by-Step Instructions:

1. **Go to Neon Console**
   - Visit: [https://console.neon.tech](https://console.neon.tech)
   - Log in to your account

2. **Select Your Database**
   - Find your project in the list
   - Click on it to open

3. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Or click the "Run query" button

4. **Copy the Schema**
   - Open the file: `vault/schema.sql`
   - Copy ALL the contents (Ctrl+A, Ctrl+C)

5. **Paste and Run**
   - Paste into the SQL editor
   - Click "Run" or press Ctrl+Enter

6. **Verify Success**
   - You should see: "CREATE TABLE", "CREATE INDEX" (3x), "INSERT" (3x)
   - This means the table was created and 3 sample theses were added

---

## 📋 The SQL Schema (for reference)

The schema creates:
- **theses table** with columns for title, abstract, fields, year, publisher, URLs, etc.
- **3 indexes** for faster searching (year, publisher, fields)
- **3 sample theses** with placeholder images to test the app

---

## 🎯 After Running the Schema

1. **Refresh your browser** at http://localhost:3000
2. You should now see **3 theses** displayed on the homepage
3. Try the search and filters
4. Login to admin panel and manage theses

---

## 🔍 Verification

To verify the table was created:

**Option 1: In Neon Console**
```sql
SELECT COUNT(*) FROM theses;
```
Should return: 3

**Option 2: In the App**
- Refresh homepage → Should show "3 theses found"
- Cards should display with cover images and information

---

## 🛠️ Troubleshooting

**If you still see errors:**

1. Check that the SQL ran without errors in Neon
2. Make sure you're connected to the right database
3. Verify your DATABASE_URL in `.env.local` is correct
4. Restart the dev server:
   - Stop server (Ctrl+C in terminal)
   - Run `npm run dev` again

**Console Errors:**
- If you see "relation 'theses' does not exist" → Table wasn't created, run the schema
- If you see "column 'X' does not exist" → Schema might be partially run, drop the table and recreate

---

## 📝 Quick Reference

**Schema Location**: `c:\Users\Med Aziz ben Haha\Documents\thesis library\vault\schema.sql`

**Neon Database URL**: Your DATABASE_URL is already configured in `.env.local`

**What Gets Created**:
- Table: `theses`
- Indexes: 3 (for search performance)
- Sample Data: 3 theses with example data

---

## ✨ Once Done

After running the schema, your app will be fully functional:
- ✅ Browse 3 sample theses
- ✅ Search and filter
- ✅ Admin login (admin / admin123)
- ✅ Add new theses
- ✅ Edit existing theses
- ✅ Delete theses

**Ready to test!** 🚀
