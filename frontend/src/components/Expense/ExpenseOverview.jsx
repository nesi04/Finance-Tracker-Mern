import React, { useEffect, useState } from 'react'
import { LuPlus } from 'react-icons/lu'
import CustomBarChart from '../Charts/CustomBarChart';
import { prepareExpenseLineChartData } from '../../utils/helper';
import CustomLineChart from '../Charts/CustomLineChart';


const IncomeOverview = ({transactions,onExpenseIncome}) => {
  const [chartData,setChartData]=useState([]);
  useEffect(()=>{
    const result = prepareExpenseLineChartData(transactions);
    setChartData(result);
    return ()=>{}
  },[transactions]);
  return (
    <div className='card'>
      <div className="flex items-center justify-between">
        <div className="">
          <h5 className='text-lg'>Expense overview</h5>
          <p className='text-xs text-gray-400 mt-0.5'>Track your spending trends overtime and gain insights of where your money goes.</p>
        </div>
        <button className='add-btn' onClick={onExpenseIncome}>
          <LuPlus className='text-lg'/> Add Expense
        </button>
      </div>
      <div className="mt-10">
          <CustomLineChart data={chartData}></CustomLineChart>
      </div>

    </div>
  )
}

export default IncomeOverview