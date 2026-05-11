"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const supabase_js_1 = require("@supabase/supabase-js");
// Load env from root
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// ─── Health Check ───
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', message: 'Sovereign Grooming API is running' });
});
// ─── Services ───
app.get('/api/services', async (_req, res) => {
    const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('active', true)
        .order('display_order');
    if (error)
        return res.status(500).json({ error: error.message });
    res.json(data);
});
app.post('/api/services', async (req, res) => {
    const { data, error } = await supabase
        .from('services')
        .insert(req.body)
        .select()
        .single();
    if (error)
        return res.status(500).json({ error: error.message });
    res.status(201).json(data);
});
app.put('/api/services/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('services')
        .update(req.body)
        .eq('id', req.params.id)
        .select()
        .single();
    if (error)
        return res.status(500).json({ error: error.message });
    res.json(data);
});
app.delete('/api/services/:id', async (req, res) => {
    const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', req.params.id);
    if (error)
        return res.status(500).json({ error: error.message });
    res.json({ success: true });
});
// ─── Bookings ───
app.get('/api/bookings', async (_req, res) => {
    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
    if (error)
        return res.status(500).json({ error: error.message });
    res.json(data);
});
app.post('/api/bookings', async (req, res) => {
    const { data, error } = await supabase
        .from('bookings')
        .insert(req.body)
        .select()
        .single();
    if (error)
        return res.status(500).json({ error: error.message });
    res.status(201).json(data);
});
app.patch('/api/bookings/:id/status', async (req, res) => {
    const { status } = req.body;
    const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', req.params.id)
        .select()
        .single();
    if (error)
        return res.status(500).json({ error: error.message });
    res.json(data);
});
// ─── Offers ───
app.get('/api/offers', async (_req, res) => {
    const { data, error } = await supabase
        .from('offers')
        .select('*')
        .order('created_at', { ascending: false });
    if (error)
        return res.status(500).json({ error: error.message });
    res.json(data);
});
app.post('/api/offers', async (req, res) => {
    const { data, error } = await supabase
        .from('offers')
        .insert(req.body)
        .select()
        .single();
    if (error)
        return res.status(500).json({ error: error.message });
    res.status(201).json(data);
});
app.put('/api/offers/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('offers')
        .update(req.body)
        .eq('id', req.params.id)
        .select()
        .single();
    if (error)
        return res.status(500).json({ error: error.message });
    res.json(data);
});
app.delete('/api/offers/:id', async (req, res) => {
    const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', req.params.id);
    if (error)
        return res.status(500).json({ error: error.message });
    res.json({ success: true });
});
// ─── Employees ───
app.get('/api/employees', async (_req, res) => {
    const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at');
    if (error)
        return res.status(500).json({ error: error.message });
    res.json(data);
});
app.post('/api/employees', async (req, res) => {
    const { data, error } = await supabase
        .from('employees')
        .insert(req.body)
        .select()
        .single();
    if (error)
        return res.status(500).json({ error: error.message });
    res.status(201).json(data);
});
app.put('/api/employees/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('employees')
        .update(req.body)
        .eq('id', req.params.id)
        .select()
        .single();
    if (error)
        return res.status(500).json({ error: error.message });
    res.json(data);
});
app.delete('/api/employees/:id', async (req, res) => {
    const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', req.params.id);
    if (error)
        return res.status(500).json({ error: error.message });
    res.json({ success: true });
});
// ─── Contact Messages ───
app.post('/api/contacts', async (req, res) => {
    const { data, error } = await supabase
        .from('contacts')
        .insert({ ...req.body, read: false })
        .select()
        .single();
    if (error)
        return res.status(500).json({ error: error.message });
    res.status(201).json(data);
});
app.get('/api/contacts', async (_req, res) => {
    const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });
    if (error)
        return res.status(500).json({ error: error.message });
    res.json(data);
});
// ─── Start ───
app.listen(port, () => {
    console.log(`✨ Sovereign Grooming API running on port ${port}`);
});
