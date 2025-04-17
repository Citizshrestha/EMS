import React, { useRef, useState, useEffect } from 'react';
import { auth, db, uploadImage } from "../../../backend/services/supabaseClient";
import {fetchUserProfile} from '@utils/userProfile'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiSearch } from 'react-icons/fi';

const Header = () => {
  const fileInputRef = useRef(null);
  const [userName, setUserName] = useState('Admin User');
  const [userRole, setUserRole] = useState('Employee');
  const [avatarUrl, setAvatarUrl] = useState(); 
  const [loading, setLoading] = useState(true);
  const [searchQuery,setSearchQuery] = useState('')
  const [filteredEmp,setFilteredEmp] = useState([])
  const [employees,setEmployees] = useState([])
  const [employeesLoading,setEmployeesLoading] = useState(true)
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
         const data = await fetchUserProfile();
          if (data){
             if (data.name) setUserName(data.name)
             if (data.role) setUserRole(data.role)
             if (data.avatarurl) setAvatarUrl(data.avatarurl)
          }
      } catch (error) {
        console.error('Error in fetching or loading user',error)
      } finally{
        setLoading(false)
      }
    };
   
    const fetchEmp  = async () => {
      try {
         setEmployeesLoading(true)
         const {data,error} = await db
               .from('profiles')
               .select('*')
               .neq('role','admin')
               if (error){
                 toast.error(error)
                 setEmployees([])
               }
               setEmployees(data || [])
      } catch (error) {
         toast.error(`Error fetching employees ${error}`)
         setEmployees([])
      } finally{
       setEmployeesLoading(false)
      }
   }

    loadUserProfile();
    fetchEmp();

  }, []);

 


  const handleProfileImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const { data: { user }, error: userError } = await auth.getUser();
      if (userError) throw new Error(`Error fetching user: ${userError.message}`);
      if (!user) throw new Error("No authenticated user found");

      const fileExtract = file.name.split('.').pop();
      const filename = `${user.id}/${Date.now()}.${fileExtract}`;

      console.log('Uploading file:', filename);

      const { data, error } = await uploadImage(filename, file, 'avatars');
      if (error) {
        console.error('Upload error details:', error);
        throw new Error(`Upload failed: ${error.message}`);
      }
      console.log('Upload successful, data:', data);

      const { data: { publicUrl } } = db.storage
                                      .from('avatars')
                                      .getPublicUrl(filename);

      console.log('Public URL:', publicUrl);

      if (!publicUrl) throw new Error('Failed to generate public URL');

      const { error: updateError } = await db
        .from('profiles')
        .update({ avatarurl: publicUrl }) 
        .eq('id', user.id);

      if (updateError) throw new Error(`Update failed: ${updateError.message}`);

      setAvatarUrl(publicUrl);
      console.log('Profile image updated successfully');
    } catch (error) {
      console.error('Error uploading image:', error.message);
    }
  };

  const handleSearch = (e) => {
      const query = e.target.value.toLowerCase().trim();
      setSearchQuery(query)

      if (!employees || employees.length === 0 || query === ''){
        setFilteredEmp([]);
        return;
      }

      const filteredEmp  = employees.filter((emp) => emp.name.toLowerCase().includes(query));
      setFilteredEmp(filteredEmp);
  }

  const handleSearchButtonClick = () => {
    if (filteredEmp.length === 1){
      navigate(`/profile/${filteredEmp[0].id}` ,{
      state: {employee: filteredEmp[0]}
      
    });
  }  else if (filteredEmp.length === 0) {
    toast.error('No employees found. Please refine your search.');
  } else {
    toast.info('Multiple employees found. Please select from the suggestions.');
  }
     
};

 const handleEmpClick = (emp) => {
  navigate(`/profile/${emp.id}`, {
    state: {employee: emp}
  });
 }
  
  return (
    <header className="bg-white shadow mt-[-12px] p-4 flex items-center justify-between">
      <div className="flex-1 gap-2 flex max-w-md">
        <input
          value={searchQuery}
          onChange={handleSearch}
          type="text"
          placeholder="Search..."
          disabled={employeesLoading}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60A5FA]"
        />
        <button 
        onClick={handleSearchButtonClick}
        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-500 flex items-center justify-center">
          <FiSearch size={20}/>
        </button>
      </div>

        {/* Suggestion Dropdown */}
        {filteredEmp.length > 0 && (
          <ul className="absolute bg-white border rounded-lg mt-20 w-[50%] shadow-lg z-10">
              {filteredEmp.map((emp) => (
                <li
                key={emp.id}
                onClick={() => handleEmpClick(emp)}
                className='p-2 hover:bg-gray-100 cursor-pointer'
                  >
                    {emp.name}
                </li>
              ))}
          </ul>
        )}


      <div className="flex items-center space-x-3">
        <img
          onClick={handleProfileImageClick}
          src={avatarUrl } 
          alt="User Avatar"
          className="w-10 h-10 rounded-full cursor-pointer"
        />
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleImageUpload}
          accept="image/*"
        />
        <div>

          <p className="font-semibold">
            {loading ? 'Loading...' : userName}
          </p>
          <p className="text-sm text-gray-500">
            {loading ? 'Loading...' : (userRole === 'admin' ? 'Admin' : 'Employee')}
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
