const { createClient }  = require('@supabase/supabase-js')

require("dotenv").config();

const supabaseUrl = process.env.DB_URL
const supabaseKey = process.env.DB_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = { supabase };