import React, { useEffect, useState } from 'react';
import { supabase } from '@backend/services/supabaseClient';
import { toast } from 'react-toastify';

const StatsCard = () => {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [pendingProjects, setPendingProjects] = useState(0);
  const [completedProjects, setCompletedProjects] = useState(0);
  
  const stats = [
    { title: 'Total Employees', value: employeeCount, color: 'bg-blue-300' },
    { title: 'Active Projects', value: pendingProjects, color: 'bg-green-300' },
    { title: 'Completed Projects', value: completedProjects, color: 'bg-yellow-300' },
  ];

  useEffect(() => {
    const fetchEmployeeCount = async () => {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .neq('role','admin')
        .not('email','is',null)

      if (error) {
        console.error('Error fetching employee count:', error.message);
      } else {
        setEmployeeCount(count);
      }
    };

    fetchEmployeeCount();

    const handlePendingProjects = async () => {
      try {
        const { count, error } = await supabase
          .from('tasks')
          .select('*',{count: 'exact',head:true})
          .in('status',['Pending','Failed'])
    
        if (error) {
          toast.error(error.message)
          return
        } else {
          console.log("pending projects ",count)
          setPendingProjects(count)
        }
    
    
    
      } catch (err) {
        toast.error(err.message || 'Something went wrong')
      }
    }
    handlePendingProjects();

    const handleCompletedProjects  = async() =>{ 
      try {
        const {count,error} = await supabase
                      .from('tasks')
                      .select('*',{count: 'exact', head: true})
                      .eq('status','Completed')

                      if (error){
                        toast.error(error)
                        return;
                      } else{
                       console.log('Completed Projects count: ',count)
                        setCompletedProjects(count)
                      }

                      

      } catch (error) {
        toast.error(error || 'Something went wrong')
      }
    }
    handleCompletedProjects();
  }, []);

  
  

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {stats.map((stat, index) => (
        <div key={index} className={`${stat.color} p-4 rounded-lg shadow`}>
          <h3 className="text-lg font-semibold">{stat.title}</h3>
          <p className="text-2xl mt-2">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCard;