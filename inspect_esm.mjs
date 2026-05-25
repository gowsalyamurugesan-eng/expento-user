import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Manually parse .env
let envConfig = {};
try {
    const envFile = fs.readFileSync('.env', 'utf8');
    envConfig = envFile.split('\n').reduce((acc, line) => {
        const [key, ...vals] = line.split('=');
        if (key && vals.length > 0) {
            acc[key.trim()] = vals.join('=').trim();
        }
        return acc;
    }, {});
} catch (e) {
    fs.writeFileSync('output.txt', 'Error reading .env: ' + e.message);
    process.exit(1);
}

const supabaseUrl = envConfig['VITE_SUPABASE_URL'];
const supabaseKey = envConfig['VITE_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseKey) {
    fs.writeFileSync('output.txt', 'Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectView() {
    try {
        const { data, error } = await supabase
            .from('product_available_by_pincode')
            .select('*')
            .limit(1);

        if (error) {
            fs.writeFileSync('output.txt', 'Error fetching view: ' + JSON.stringify(error));
        } else {
            if (data && data.length > 0) {
                const result = {
                    keys: Object.keys(data[0]),
                    sample: data[0]
                };
                fs.writeFileSync('output.txt', JSON.stringify(result, null, 2));
            } else {
                fs.writeFileSync('output.txt', 'View is empty');
            }
        }
    } catch (e) {
        fs.writeFileSync('output.txt', 'Exception: ' + e.message);
    }
}

inspectView();
