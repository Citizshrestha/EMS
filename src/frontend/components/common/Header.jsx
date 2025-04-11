import React, { useRef, useState, useEffect } from 'react';
import { auth, db, uploadImage } from "../../../backend/services/supabaseClient";

const Header = () => {
  const fileInputRef = useRef(null);
  const [userName, setUserName] = useState('Admin User');
  const [userRole, setUserRole] = useState('Employee');
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=faces'); // Fallback URL
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user }, error: userError } = await auth.getUser();
        if (userError || !user) {
          throw new Error("No authenticated user found");
        }

        const { data, error } = await db
          .from('profiles')
          .select('name, role, avatarurl') // Include avatarurl
          .eq('id', user.id)
          .single();

        if (error) throw error;
        if (data) {
          if (data.name) setUserName(data.name);
          if (data.role) setUserRole(data.role);
          if (data.avatarurl) setAvatarUrl(data.avatarurl);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
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

      const fileExt = file.name.split('.').pop();
      const filename = `${user.id}/${Date.now()}.${fileExt}`;

      console.log('Uploading file:', filename);

      const { data, error } = await uploadImage(filename, file, 'avatars');
      if (error) {
        console.error('Upload error details:', error);
        throw new Error(`Upload failed: ${error.message}`);
      }
      console.log('Upload successful, data:', data);

      const { data: { publicUrl } } = db.storage.from('avatars').getPublicUrl(filename);
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

  return (
    <header className="bg-white shadow p-4 flex items-center justify-between">
      <div className="flex-1 max-w-md">
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60A5FA]"
        />
      </div>
      <div className="flex items-center space-x-3">
        <img
          onClick={handleProfileImageClick}
          src={avatarUrl} 
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