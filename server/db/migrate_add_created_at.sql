-- Migration: add created_at column if it doesn't exist

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='services' AND column_name='created_at'
  ) THEN
    ALTER TABLE services ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT now();
  END IF;
END
$$;
