
import { auth, db } from "../../backend/services/supabaseClient";


   export const fetchUserProfile =  async () =>{
    try {
        const {data:{user} , error: userError} =  await auth.getUser()
              if (userError || !user){
                throw new Error('No authenticated user found')
              }

              const {data, err} = await db
                .from('profiles')
                .select('id,name,role,avatarurl')
                .eq('id',user.id)
                .single()

                if (err){
                    throw err;
                } 
                return data;
    } catch (error) {
        console.error("Error fetching user data",error)
    }
  }


