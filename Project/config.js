


import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabaseUrl = 'https://lpmrtazyoenskpvxiksi.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwbXJ0YXp5b2Vuc2twdnhpa3NpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NTc4OTYsImV4cCI6MjA4MDIzMzg5Nn0.52Nvjvu5GQKcFGGvSXxXvR23nlNF8LNMxu8A2i8UZDI'

export const supabase = createClient(supabaseUrl, supabaseKey);