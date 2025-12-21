
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.28.0';

const supabaseUrl = 'https://juqdnmkqbznkaqmkqddq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1cWRubWtxYnpua2FxbWtxZGRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NTg0OTAsImV4cCI6MjA4MTEzNDQ5MH0.8Itg8D3VQwwLpAu80gd8fvyXPEYIg3kugBfc_hHT88M'
const supabase = createClient(supabaseUrl, supabaseKey)


export default supabase

