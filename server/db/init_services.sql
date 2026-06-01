-- Run this SQL once to create the services table (Postgres)

CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  category TEXT,
  duration TEXT,
  price NUMERIC(10,2)
);
