import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

// Load env vars manually since we don't have vite's env loading here easily
const envFile = fs.readFileSync('.env', 'utf8');
const envConfig = envFile.split('\n').reduce((acc, line) => {
    const [key, val] = line.split('=');
    if (key && val) acc[key.trim()] = val.trim();
    return acc;
}, {});

const supabaseUrl = envConfig['VITE_SUPABASE_URL'];
const supabaseKey = envConfig['VITE_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectView() {
    console.log('Fetching 1 row from product_available_by_pincode...');
    const { data, error } = await supabase
        .from('product_available_by_pincode')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error fetching view:', error);
    } else {
        console.log('View Schema (Keys):');
        if (data && data.length > 0) {
            console.log(Object.keys(data[0]));
            console.log('Sample Row:', data[0]);
        } else {
            console.log('View is empty.');
        }
    }
}

inspectView();
