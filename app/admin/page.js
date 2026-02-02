'use client'
import { useEffect, useState } from 'react';
import { createClient } from '../utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullReport, setFullReport] = useState('');
  const [isUpcoming, setIsUpcoming] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();

  // 1. Check if user is Admin
  useEffect(() => {
    const checkRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login'); 
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        alert("Access Denied: You are not an admin.");
        router.push('/');
      } else {
        setIsAdmin(true);
      }
    };
    checkRole();
  }, [router, supabase]);

  // 2. Handle Form Submit
   // 2. Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = null;

      // Upload Image if it exists
      if (imageFile) {
        // CLEAN THE FILENAME: Remove spaces and special characters
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`; 

        const { error: uploadError } = await supabase.storage
          .from('activity-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;
        
        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('activity-images')
          .getPublicUrl(fileName);
          
        imageUrl = publicUrl;
      }

      // Save Data to Database
      const { error: dbError } = await supabase
        .from('activities')
        .insert([{
          title,
          short_description: shortDesc,
          full_report: fullReport,
          is_upcoming: isUpcoming,
          image_url: imageUrl
        }]);

      if (dbError) throw dbError;

      alert("Activity Posted Successfully!");
      // Reset Form
      setTitle('');
      setShortDesc('');
      setFullReport('');
      setImageFile(null);
      setIsUpcoming(false);

    } catch (error) {
      console.error(error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) return <div className="p-10">Checking permissions...</div>;

  return (
    <div className="min-h-screen bg-base-200 p-10">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-primary">Admin Dashboard</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Title */}
          <div className="form-control">
            <label className="label"><span className="label-text">Activity Title</span></label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="input input-bordered" required />
          </div>

          {/* Short Description */}
          <div className="form-control">
            <label className="label"><span className="label-text">Short Description (for homepage preview)</span></label>
            <textarea value={shortDesc} onChange={e => setShortDesc(e.target.value)} className="textarea textarea-bordered h-20" required></textarea>
          </div>

          {/* Full Report */}
          <div className="form-control">
            <label className="label"><span className="label-text">Full Report / Details</span></label>
            <textarea value={fullReport} onChange={e => setFullReport(e.target.value)} className="textarea textarea-bordered h-40" required></textarea>
          </div>

          {/* Upcoming Toggle */}
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-4">
              <span className="label-text font-bold">Is this an Upcoming Activity?</span> 
              <input type="checkbox" checked={isUpcoming} onChange={e => setIsUpcoming(e.target.checked)} className="checkbox checkbox-primary" />
            </label>
          </div>

          {/* Image Upload */}
          <div className="form-control">
            <label className="label"><span className="label-text">Upload Image</span></label>
            <input type="file" onChange={e => setImageFile(e.target.files[0])} className="file-input file-input-bordered w-full" />
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary mt-4" disabled={loading}>
            {loading ? "Posting..." : "Post Activity"}
          </button>

        </form>
      </div>
    </div>
  );
}