import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight, Clock, Minus, Plus, CalendarDays, User, Sparkles } from 'lucide-react';
import AnimatedSection from '../components/shared/AnimatedSection';

const bookingServices = [
  { id: '1', name: 'Wash & Blowout', price: 65, duration: '45 min', category: 'Hair' },
  { id: '2', name: 'Hair Balayage', price: 265, duration: '3 hr 15 min', category: 'Hair' },
  { id: '3', name: 'Full Hair Highlights', price: 265, duration: '3 hr 40 min', category: 'Hair' },
  { id: '4', name: 'Eyebrow Threading', price: 14, duration: '15 min', category: 'Waxing' },
  { id: '5', name: 'Eyebrow Waxing', price: 14, duration: '15 min', category: 'Waxing' },
  { id: '6', name: 'Brazilian Waxing (Hard Wax)', price: 60, duration: '25 min', category: 'Waxing' },
  { id: '7', name: 'Brazilian Waxing (Chocolate Wax)', price: 55, duration: '25 min', category: 'Waxing' },
  { id: '8', name: 'Eyebrow + Upper Lip + Chin', price: 26, duration: '30 min', category: 'Waxing' },
  { id: '9', name: 'Full Face', price: 40, duration: '45 min', category: 'Waxing' },
  { id: '10', name: 'Lash Lift + Tint', price: 85, duration: '1 hr 15 min', category: 'Lashes' },
  { id: '11', name: 'Lash Tint', price: 25, duration: '15 min', category: 'Lashes' },
  { id: '12', name: 'Full Leg + Arms + Underarm', price: 115, duration: '1 hr 15 min', category: 'Waxing' },
  { id: '13', name: 'Full Back Waxing', price: 50, duration: '20 min', category: 'Waxing' },
  { id: '14', name: 'Bikini Wax', price: 35, duration: '15 min', category: 'Waxing' },
  { id: '15', name: 'Stomach Wax', price: 35, duration: '20 min', category: 'Waxing' },
];

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
];

const steps = ['Select Services', 'Date & Time', 'Your Details', 'Confirmation'];

interface SelectedService {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [booked, setBooked] = useState(false);

  const total = selectedServices.reduce((sum, s) => sum + s.price * s.quantity, 0);

  const toggleService = (service: typeof bookingServices[0]) => {
    const exists = selectedServices.find((s) => s.id === service.id);
    if (exists) {
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, { id: service.id, name: service.name, price: service.price, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setSelectedServices(
      selectedServices.map((s) =>
        s.id === id ? { ...s, quantity: Math.max(1, s.quantity + delta) } : s
      )
    );
  };

  const canNext = () => {
    if (currentStep === 0) return selectedServices.length > 0;
    if (currentStep === 1) return selectedDate && selectedTime;
    if (currentStep === 2) return form.name && form.email && form.phone;
    return true;
  };

  const handleConfirm = async () => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: form.name,
          client_email: form.email,
          client_phone: form.phone,
          services: selectedServices.map(s => ({
            service_id: s.id,
            name: s.name,
            price: s.price,
            quantity: s.quantity,
          })),
          date: selectedDate,
          time_slot: selectedTime,
          total_price: total,
        }),
      });

      if (response.ok) {
        setBooked(true);
      } else {
        alert('Failed to book appointment. Please try again.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to book appointment. Please try again.');
    }
  };

  // Generate next 14 days
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d;
  }).filter((d) => d.getDay() !== 0); // exclude Sunday

  return (
    <div>
      {/* Hero */}
      <section
        className="pt-32 pb-16 text-center"
        style={{ background: 'linear-gradient(135deg, #2C2416 0%, #1A1612 100%)' }}
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span className="text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--color-gold)', fontWeight: 500 }}>
            Reserve Your Experience
          </span>
          <h1 className="text-4xl md:text-5xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: '#fff' }}>
            Book an Appointment
          </h1>
          <div className="divider-gold mt-4" />
        </motion.div>
      </section>

      <section className="section max-w-4xl mx-auto">
        {/* Step Indicator */}
        <AnimatedSection className="flex items-center justify-center gap-4 mb-12 flex-wrap">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300"
                  style={{
                    background: i <= currentStep ? 'var(--color-gold)' : 'transparent',
                    color: i <= currentStep ? '#fff' : 'var(--color-muted)',
                    border: `1.5px solid ${i <= currentStep ? 'var(--color-gold)' : 'rgba(201,169,110,0.25)'}`,
                  }}
                >
                  {i < currentStep ? <Check size={14} /> : i + 1}
                </div>
                <span
                  className="text-xs tracking-wide uppercase hidden sm:inline"
                  style={{
                    color: i <= currentStep ? 'var(--color-gold)' : 'var(--color-muted)',
                    fontWeight: i === currentStep ? 600 : 400,
                  }}
                >
                  {step}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className="w-8 h-px hidden sm:block"
                  style={{ background: i < currentStep ? 'var(--color-gold)' : 'rgba(201,169,110,0.2)' }}
                />
              )}
            </div>
          ))}
        </AnimatedSection>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {/* STEP 1: Select Services */}
          {currentStep === 0 && (
            <motion.div key="step-1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookingServices.map((service) => {
                  const selected = selectedServices.find((s) => s.id === service.id);
                  return (
                    <motion.div
                      key={service.id}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => toggleService(service)}
                      className="p-5 rounded-xl border cursor-pointer transition-all duration-300"
                      style={{
                        background: selected ? 'rgba(201,169,110,0.06)' : 'rgba(255,255,255,0.6)',
                        borderColor: selected ? 'var(--color-gold)' : 'rgba(201,169,110,0.12)',
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-sm font-semibold" style={{ color: 'var(--color-brown)' }}>
                            {service.name}
                          </h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs" style={{ color: 'var(--color-gold)', fontWeight: 600 }}>
                              ${service.price}
                            </span>
                            <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-muted)' }}>
                              <Clock size={11} /> {service.duration}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {selected && (
                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              <button onClick={() => updateQuantity(service.id, -1)} className="w-6 h-6 rounded-full border flex items-center justify-center cursor-pointer" style={{ borderColor: 'var(--color-gold)', color: 'var(--color-gold)', background: 'transparent' }}>
                                <Minus size={12} />
                              </button>
                              <span className="text-sm font-semibold w-4 text-center">{selected.quantity}</span>
                              <button onClick={() => updateQuantity(service.id, 1)} className="w-6 h-6 rounded-full border flex items-center justify-center cursor-pointer" style={{ borderColor: 'var(--color-gold)', color: 'var(--color-gold)', background: 'transparent' }}>
                                <Plus size={12} />
                              </button>
                            </div>
                          )}
                          <div
                            className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all"
                            style={{
                              borderColor: selected ? 'var(--color-gold)' : 'rgba(201,169,110,0.3)',
                              background: selected ? 'var(--color-gold)' : 'transparent',
                            }}
                          >
                            {selected && <Check size={12} color="#fff" />}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 2: Date & Time */}
          {currentStep === 1 && (
            <motion.div key="step-2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="mb-8">
                <h3 className="text-lg mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-brown)' }}>
                  <CalendarDays size={18} style={{ color: 'var(--color-gold)' }} />
                  Select Date
                </h3>
                <div className="flex gap-3 flex-wrap">
                  {dates.map((date) => {
                    const dateStr = date.toISOString().split('T')[0];
                    const isSelected = selectedDate === dateStr;
                    return (
                      <motion.button
                        key={dateStr}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setSelectedDate(dateStr)}
                        className="flex flex-col items-center p-3 rounded-xl border cursor-pointer transition-all min-w-[70px]"
                        style={{
                          background: isSelected ? 'var(--color-gold)' : 'rgba(255,255,255,0.6)',
                          borderColor: isSelected ? 'var(--color-gold)' : 'rgba(201,169,110,0.15)',
                          color: isSelected ? '#fff' : 'var(--color-brown)',
                        }}
                      >
                        <span className="text-xs uppercase" style={{ fontWeight: 600 }}>
                          {date.toLocaleDateString('en', { weekday: 'short' })}
                        </span>
                        <span className="text-lg font-bold">{date.getDate()}</span>
                        <span className="text-xs">{date.toLocaleDateString('en', { month: 'short' })}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-lg mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-brown)' }}>
                  <Clock size={18} style={{ color: 'var(--color-gold)' }} />
                  Select Time
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {timeSlots.map((time) => {
                    const isSelected = selectedTime === time;
                    return (
                      <motion.button
                        key={time}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setSelectedTime(time)}
                        className="py-2.5 px-3 rounded-lg border text-sm cursor-pointer transition-all"
                        style={{
                          background: isSelected ? 'var(--color-gold)' : 'rgba(255,255,255,0.6)',
                          borderColor: isSelected ? 'var(--color-gold)' : 'rgba(201,169,110,0.15)',
                          color: isSelected ? '#fff' : 'var(--color-brown)',
                          fontWeight: isSelected ? 600 : 400,
                        }}
                      >
                        {time}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Client Details */}
          {currentStep === 2 && (
            <motion.div key="step-3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="max-w-lg mx-auto">
                <h3 className="text-lg mb-6 flex items-center gap-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-brown)' }}>
                  <User size={18} style={{ color: 'var(--color-gold)' }} />
                  Your Information
                </h3>
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="text-xs tracking-[0.12em] uppercase mb-2 block" style={{ color: 'var(--color-muted)', fontWeight: 600 }}>Full Name</label>
                    <input className="input-field" placeholder="Your full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs tracking-[0.12em] uppercase mb-2 block" style={{ color: 'var(--color-muted)', fontWeight: 600 }}>Email Address</label>
                    <input className="input-field" type="email" placeholder="you@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs tracking-[0.12em] uppercase mb-2 block" style={{ color: 'var(--color-muted)', fontWeight: 600 }}>Phone Number</label>
                    <input className="input-field" type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Summary */}
          {currentStep === 3 && !booked && (
            <motion.div key="step-4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div
                className="max-w-lg mx-auto p-8 rounded-2xl border"
                style={{ background: 'rgba(255,255,255,0.6)', borderColor: 'rgba(201,169,110,0.15)' }}
              >
                <h3 className="text-xl mb-6" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-brown)' }}>
                  Booking Summary
                </h3>

                <div className="space-y-4 mb-6">
                  {selectedServices.map((s) => (
                    <div key={s.id} className="flex justify-between text-sm" style={{ color: 'var(--color-brown)' }}>
                      <span>{s.name} {s.quantity > 1 && `(x${s.quantity})`}</span>
                      <span style={{ fontWeight: 600 }}>${s.price * s.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="h-px mb-4" style={{ background: 'rgba(201,169,110,0.15)' }} />

                <div className="flex justify-between mb-6">
                  <span className="text-sm font-semibold" style={{ color: 'var(--color-brown)' }}>Total</span>
                  <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)' }}>${total}</span>
                </div>

                <div className="space-y-2 mb-8 text-sm" style={{ color: 'var(--color-muted)' }}>
                  <p><strong>Date:</strong> {selectedDate && new Date(selectedDate + 'T00:00:00').toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                  <p><strong>Time:</strong> {selectedTime}</p>
                  <p><strong>Name:</strong> {form.name}</p>
                  <p><strong>Email:</strong> {form.email}</p>
                  <p><strong>Phone:</strong> {form.phone}</p>
                </div>

                <button onClick={handleConfirm} className="btn-gold w-full flex items-center justify-center gap-2">
                  <Sparkles size={16} />
                  Confirm Booking
                </button>
              </div>
            </motion.div>
          )}

          {/* Success */}
          {booked && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ background: 'var(--color-gold)' }}
              >
                <Check size={32} color="#fff" />
              </motion.div>
              <h2 className="text-3xl mb-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-brown)' }}>
                Booking Confirmed!
              </h2>
              <p className="text-base" style={{ color: 'var(--color-muted)' }}>
                We look forward to seeing you, {form.name}. A confirmation has been sent to {form.email}.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        {!booked && (
          <div className="flex justify-between items-center mt-10">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              className="flex items-center gap-2 text-sm cursor-pointer bg-transparent border-0"
              style={{ color: currentStep === 0 ? 'transparent' : 'var(--color-muted)', pointerEvents: currentStep === 0 ? 'none' : 'auto' }}
            >
              <ChevronLeft size={16} /> Back
            </button>

            {/* Total Preview */}
            {selectedServices.length > 0 && currentStep < 3 && (
              <span className="text-sm" style={{ color: 'var(--color-muted)' }}>
                Total: <span style={{ color: 'var(--color-gold)', fontWeight: 700 }}>${total}</span>
              </span>
            )}

            {currentStep < 3 && (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canNext()}
                className="btn-gold flex items-center gap-2 !py-2.5 !px-6"
                style={{ opacity: canNext() ? 1 : 0.4, cursor: canNext() ? 'pointer' : 'not-allowed' }}
              >
                Continue <ChevronRight size={16} />
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
