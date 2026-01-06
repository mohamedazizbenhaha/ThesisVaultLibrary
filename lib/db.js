import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL);

/**
 * Thesis Schema (Postgres):
 * - id: SERIAL PRIMARY KEY
 * - title: TEXT NOT NULL
 * - abstract: TEXT
 * - fields: TEXT[] NOT NULL
 * - year: INTEGER NOT NULL
 * - universities: TEXT[] DEFAULT '{}' -- Renamed from publisher
 * - thesis_url: TEXT NOT NULL
 * - cover_image_url: TEXT
 * - university_logos: TEXT[] DEFAULT '{}' -- New field
 * - author_icons: TEXT[] DEFAULT '{}'
 * - created_at: TIMESTAMP DEFAULT NOW()
 * - updated_at: TIMESTAMP DEFAULT NOW()
 */

// Fetch all theses with filters
export async function getAllTheses(filters = {}) {
  try {
    // We fetch all and filter in JS for simplicity with Neon serverless dynamic queries
    const result = await sql`SELECT * FROM theses ORDER BY year DESC, created_at DESC`;

    let filtered = [...result];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(search) ||
        (t.abstract && t.abstract.toLowerCase().includes(search))
      );
    }

    if (filters.field) {
      filtered = filtered.filter(t => t.fields && t.fields.includes(filters.field));
    }

    if (filters.year) {
      filtered = filtered.filter(t => t.year === parseInt(filters.year));
    }

    if (filters.university) {
      filtered = filtered.filter(t => t.universities && t.universities.includes(filters.university));
    }

    return filtered;
  } catch (error) {
    console.error('Error in getAllTheses:', error);
    throw error;
  }
}

// Fetch single thesis
export async function getThesisById(id) {
  try {
    const result = await sql`SELECT * FROM theses WHERE id = ${id}`;
    return result[0];
  } catch (error) {
    console.error('Error in getThesisById:', error);
    throw error;
  }
}

// Create new thesis
export async function createThesis(data) {
  try {
    const {
      title, abstract, fields, year, universities,
      thesis_url, cover_image_url, university_logos, author_icons, author_names, author_roles
    } = data;

    const result = await sql`
      INSERT INTO theses (
        title, abstract, fields, year, universities, 
        thesis_url, cover_image_url, university_logos, author_icons, author_names, author_roles
      ) VALUES (
        ${title}, ${abstract}, ${fields}, ${year}, ${universities}, 
        ${thesis_url}, ${cover_image_url}, ${university_logos}, ${author_icons}, ${author_names}, ${author_roles}
      ) RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Error in createThesis:', error);
    throw error;
  }
}

// Update existing thesis
export async function updateThesis(id, data) {
  try {
    const {
      title, abstract, fields, year, universities,
      thesis_url, cover_image_url, university_logos, author_icons, author_names, author_roles
    } = data;

    const result = await sql`
      UPDATE theses SET 
        title = ${title},
        abstract = ${abstract},
        fields = ${fields},
        year = ${year},
        universities = ${universities},
        thesis_url = ${thesis_url},
        cover_image_url = ${cover_image_url},
        university_logos = ${university_logos},
        author_icons = ${author_icons},
        author_names = ${author_names},
        author_roles = ${author_roles},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Error in updateThesis:', error);
    throw error;
  }
}

// Delete thesis
export async function deleteThesis(id) {
  try {
    const result = await sql`DELETE FROM theses WHERE id = ${id} RETURNING *`;
    return result[0];
  } catch (error) {
    console.error('Error in deleteThesis:', error);
    throw error;
  }
}

// Get filter options (unique fields, years, universities)
export async function getFilterOptions() {
  try {
    const theses = await sql`SELECT fields, year, universities FROM theses`;

    const fields = [...new Set(theses.flatMap(t => t.fields || []))].sort();
    const universities = [...new Set(theses.flatMap(t => t.universities || []))].sort();
    const years = [...new Set(theses.map(t => t.year))].sort((a, b) => b - a);

    return { fields, universities, years };
  } catch (error) {
    console.error('Error in getFilterOptions:', error);
    throw error;
  }
}

// Get dashboard stats
export async function getDashboardStats() {
  try {
    const theses = await sql`SELECT fields, universities FROM theses`;

    const totalTheses = theses.length;
    const totalFields = [...new Set(theses.flatMap(t => t.fields || []))].length;
    const totalUniversities = [...new Set(theses.flatMap(t => t.universities || []))].length;

    return {
      totalTheses,
      totalFields,
      totalUniversities
    };
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    throw error;
  }
}

// Setup admins table
export async function setupAdminsTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Check if admin exists
    const admins = await sql`SELECT * FROM admins WHERE username = 'admin'`;
    if (admins.length === 0) {
      await sql`
        INSERT INTO admins (username, password)
        VALUES ('admin', 'admin123')
      `;
      console.log('Default admin user created');
    }
  } catch (error) {
    console.error('Error setupAdminsTable:', error);
    throw error;
  }
}

export async function getAdminByUsername(username) {
  try {
    const result = await sql`SELECT * FROM admins WHERE username = ${username}`;
    return result[0];
  } catch (error) {
    console.error('Error getAdminByUsername:', error);
    throw error;
  }
}

export { sql };
