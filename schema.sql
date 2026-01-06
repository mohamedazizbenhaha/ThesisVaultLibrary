-- Thesis Vault Database Schema
-- Run this in your Neon database console to create the table

CREATE TABLE IF NOT EXISTS theses (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  abstract TEXT,
  fields TEXT[] NOT NULL,
  year INTEGER NOT NULL,
  publisher TEXT,
  thesis_url TEXT NOT NULL,
  cover_image_url TEXT,
  university_logo_url TEXT,
  author_icons TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_theses_year ON theses(year);
CREATE INDEX IF NOT EXISTS idx_theses_publisher ON theses(publisher);
CREATE INDEX IF NOT EXISTS idx_theses_fields ON theses USING GIN(fields);

-- Insert sample data (optional)
INSERT INTO theses (
  title, 
  abstract, 
  fields, 
  year, 
  publisher, 
  thesis_url,
  cover_image_url,
  university_logo_url,
  author_icons
) VALUES (
  'Advanced Machine Learning Techniques for Data Analysis',
  'This thesis explores cutting-edge machine learning algorithms and their applications in big data analysis, focusing on neural networks and deep learning architectures.',
  ARRAY['Computer Science', 'Machine Learning', 'Data Science'],
  2024,
  'MIT',
  'https://example.com/thesis-ml',
  'https://picsum.photos/seed/ml/400/600',
  'https://picsum.photos/seed/mit/100/100',
  ARRAY['https://i.pravatar.cc/150?img=1', 'https://i.pravatar.cc/150?img=2']
),
(
  'Sustainable Urban Development in Smart Cities',
  'An exploration of sustainable development practices in modern urban environments, with a focus on smart city technologies and environmental impact.',
  ARRAY['Urban Planning', 'Sustainability', 'Technology'],
  2023,
  'Stanford University',
  'https://example.com/thesis-urban',
  'https://picsum.photos/seed/urban/400/600',
  'https://picsum.photos/seed/stanford/100/100',
  ARRAY['https://i.pravatar.cc/150?img=3']
),
(
  'Quantum Computing Applications in Cryptography',
  'This research investigates the potential of quantum computing in revolutionizing cryptographic systems and security protocols.',
  ARRAY['Physics', 'Computer Science', 'Cryptography'],
  2024,
  'Oxford University',
  'https://example.com/thesis-quantum',
  'https://picsum.photos/seed/quantum/400/600',
  'https://picsum.photos/seed/oxford/100/100',
  ARRAY['https://i.pravatar.cc/150?img=4', 'https://i.pravatar.cc/150?img=5', 'https://i.pravatar.cc/150?img=6']
);
