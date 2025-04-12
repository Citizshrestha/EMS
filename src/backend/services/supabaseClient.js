import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// Initialize Supabase client for regular operations (using anon key)
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Supabase client for admin operations (using service role key)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

export const createUserProfile = async () => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error('Error getting user: ', userError.message);
    throw userError;
  }

  if (!user) {
    throw new Error('No authenticated user found');
  }

  const { error: insertError } = await supabase.from('profiles').insert({
    id: user.id,
    name: 'new_user_' + Math.floor(Math.random() * 1000),
    email: user.email,
  });

  if (insertError) {
    console.error('Error inserting profile:', insertError.message);
    throw insertError;
  }

  console.log('User profile created successfully!');
};

// Function to upload an image to a Supabase storage bucket
export const uploadImage = async (filePath, file, bucketName) => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file);
  if (error) throw error;
  return { data, error };
};

// Function to sign in a user (for testing the login flow)
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Error signing in:', error.message);
    throw error;
  }

  console.log('Sign-in successful:', data);
  return data;
};

export const auth = supabase.auth;
export const db = supabase;
export { supabase, supabaseAdmin };