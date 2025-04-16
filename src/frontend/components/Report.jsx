import React from 'react'
import TaskList from './Employees/TaskList'
import Header from './common/Header'

const Report = () => {
  return (
    <div className='w-full max-h-[90vh] overflow-y-auto no-scrollbar p-4'>
        <Header />
        <TaskList />
    </div>
  )
}

export default Report
