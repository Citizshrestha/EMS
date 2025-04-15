import React from 'react'

const EmpStatsCard = () => {
  return (
    <div className='flex h-[10rem]  w-full gap-10 '>
        <div 
        className='bg-red-600 h-[60%] w-[16rem] text-white text-left px-7 py-2 rounded-xl'
        >
            <h2 className='font-bold text-4xl py-1'>1</h2>
            <span className='text-xl '>New Task</span>
        </div>
        <div text-white
        className='bg-emerald-600 h-[60%] text-white w-[16rem] text-left px-7 py-2 rounded-xl'

        >
            <h2 className='font-bold text-4xl py-1'>3</h2>
            <span className='text-xl '>Completed Task</span>
        </div>
        <div 
        className='bg-blue-500 text-white h-[60%] w-[16rem] text-left px-7 py-2 rounded-xl'

        >
            <h2 className='font-bold text-4xl py-1'>0</h2>
            <span className='text-xl '>Accpeted Task</span>
        </div>
        <div 
        className='bg-yellow-500 text-white h-[60%] w-[16rem] text-left px-7 py-2 rounded-xl'

        >
            <h2 className='font-bold text-4xl py-1'>1</h2>
            <span className='text-xl '>Failed Task</span>
        </div>
     
    </div>
  )
}

export default EmpStatsCard
