import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const createUserProfile =  async() => {
    const {data:{user}, error: userError} = await supabase.auth.getUser()

    if (userError){
        console.error("Error getting user: ",userError.message)
        return;
    }

     const {error: insertError} = await supabase.from('profiles').insert({

        id: user.id,
        username: 'new_user_'+Math.floor(Math.random() * 1000),
        email: user.email,
     });

     if (insertError){
        console.error('Error inserting profiles',insertError.message)
     } else{
        console.log('User profile created successfully!');
     }
}
export const supabase = createClient(supabaseUrl, supabaseKey);
