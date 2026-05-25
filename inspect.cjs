const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Basic .env parser
function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (!fs.existsSync(envPath)) return {};
        const envFile = fs.readFileSync(envPath, 'utf8');
        return envFile.split('\n').reduce((acc, line) => {
            const [key, ...vals] = line.split('=');
            if (key && vals.length > 0) {
                acc[key.trim()] = vals.join('=').trim();
            }
            return acc;
        }, {});
    } catch (e) {
        return {};
    }
}

const envConfig = loadEnv();
const supabaseUrl = envConfig['VITE_SUPABASE_URL'];
const supabaseKey = envConfig['VITE_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    // Try to find them in .env.local if .env missing?
    // Just exit for now
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
        if (data && data.length > 0) {
            console.log('KEYS:', JSON.stringify(Object.keys(data[0])));
            console.log('SAMPLE:', JSON.stringify(data[0]));
        } else {
            console.log('View is empty.');
        }
    }
}

inspectView();
