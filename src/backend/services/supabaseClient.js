import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize Supabase client first
const supabase = createClient(supabaseUrl, supabaseKey);

const createUserProfile = async () => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error('Error getting user: ', userError.message);
    return;
  }

  const { error: insertError } = await supabase.from('profiles').insert({
    id: user.id,
    name: 'new_user_' + Math.floor(Math.random() * 1000),
    email: user.email,
  });

  if (insertError) {
    console.error('Error inserting profile:', insertError.message);
  } else {
    console.log('User profile created successfully!');
  }
};

export const uploadImage = async (filePath, file, bucketName) => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file);
  if (error) throw error;
  return { data, error };
};

// Export everything needed
export const auth = supabase.auth;
export const db = supabase;
export { supabase, createUserProfile };