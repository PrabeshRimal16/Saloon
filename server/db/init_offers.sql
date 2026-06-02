-- Create offers table
CREATE TABLE IF NOT EXISTS offers (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  discount_percent INT DEFAULT 0,
  valid_until DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample offers with staggered timestamps
DELETE FROM offers;
INSERT INTO offers (title, description, discount_percent, valid_until, created_at) VALUES
  ('Summer Glow Package', 'A curated 3-step ritual including deep exfoliation, hydration therapy, and our signature gold-leaf finishing mist. Perfect for rehydrating after sun exposure.', 20, '2025-08-31', NOW() - INTERVAL '5 days'),
  ('First-Time Client Special', 'A warm welcome to the L''Atelier family. Applicable on any service over $150 for new members. Includes complimentary stylistic consultation.', 15, '2025-12-31', NOW() - INTERVAL '3 days'),
  ('Weekend Solstice', 'Transform your Friday or Saturday appointment. Book any full-service color and receive a complimentary upgrade to our Oribe Gold Lust restorative treatment.', 25, '2025-11-30', NOW() - INTERVAL '2 days'),
  ('Bridal Party Ritual', 'Group styling and champagne breakfast for parties of five or more. Exclusive package for wedding preparation.', 30, '2025-09-30', NOW() - INTERVAL '1 day'),
  ('Loyalty Rewards', 'Every 5th visit gets 18% off your next service. Exclusive benefits for our returning clients.', 18, '2025-12-31', NOW()),
  ('Seasonal Spring Refresh', 'Refresh your look this season with our new spring collection services. 22% discount on all spring packages.', 22, '2025-06-30', NOW() - INTERVAL '4 days'),
  ('Corporate Wellness', 'Special rates for corporate groups and wellness programs. 12% discount for companies with 10+ bookings.', 12, '2025-10-31', NOW() - INTERVAL '6 days'),
  ('VIP Platinum Package', 'Premium treatment bundle with exclusive access to master stylists. Complimentary products and priority booking.', 35, '2025-12-31', NOW() - INTERVAL '7 days');
