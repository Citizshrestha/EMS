import React, { useEffect, useState } from 'react'
import { supabase } from '../../backend/services/supabaseClient';

const StatsCard = () => {
  const [employeeCount,setEmployeeCount] = useState(0);
    const stats= [
        {title: 'Total Employees',
         value: employeeCount,
         color: 'bg-blue-300'
        },
        {title: 'Active Projects',
         value: '12',
         color: 'bg-green-300'
        },
        {title: 'Pending Requests',
         value: '8',
         color: 'bg-yellow-300'
        },
    ];

    useEffect(() => {
      const fetchEmployeeCount = async () => {
        const { count, error } = await supabase
          .from('profiles') // or 'employees' depending on your table
          .select('*', { count: 'exact', head: true });
  
        if (error) {
          console.error('Error fetching employee count:', error.message);
        } else {
          setEmployeeCount(count);
        }
      };
  
      fetchEmployeeCount();
    }, []);
    
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
       {stats.map((stat,index) => (
         <div key={index} className={`${stat.color} p-4 rounded-lg shadow `}>
            <h3 className="text-lg font-semibold">{stat.title}</h3>
            <p className="text-2xl mt-2">{stat.value}</p>
         </div>
       ))}
    </div>
  )
}

export default StatsCard
