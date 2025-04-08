import React from 'react'

const StatsCard = () => {
    const stats= [
        {title: 'Total Employees',
         value: '50',
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
    ]
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
