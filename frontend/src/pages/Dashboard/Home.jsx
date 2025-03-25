import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import{IoMdCard}from'react-icons/io'
import{LuHandCoins,LuWalletMinimal}from 'react-icons/lu'
import { addThousandSeparator } from '../../utils/helper';
import InfoCard from '../../components/cards/InfoCard';
import RecentTransactions from '../../components/Dashboard/RecentTransactions';
import FinanceOverview from '../../components/Dashboard/FinanceOverview';
import ExpenseTransactions from '../../components/Dashboard/ExpenseTransactions';
import Last30daysExpenses from '../../components/Dashboard/Last30daysExpenses';
import RecentIncomeWithChart from '../../components/Dashboard/RecentIncomeWithChart';
import RecentIncome from '../../components/Dashboard/RecentIncome';

const Home = () => {
  useUserAuth();
  const navigate = useNavigate();
  const [dashboardData,setDashboardData]=useState(null);
  const[loading,setLoading]=useState(false);
  const fetchDashboardData = async()=>{
    if(loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${API_PATHS.DASHBOARD.GET_DATA}`);
      if(response.data){
        setDashboardData(response.data);
      }
    

      
    } catch (error) {
      console.log('Something went wrong Please try again',error);
    }finally{
      setLoading(false);
    }
  };
  useEffect(()=>{
    fetchDashboardData();
    
    return ()=>{};
  },[]);
  
  return (
    <DashboardLayout activeMenu='Dashboard'>
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 md:grid-col-3 gap-6 ">
          <InfoCard icon={<IoMdCard></IoMdCard>} label="Total Balance " value={addThousandSeparator(dashboardData?.totalBalance||0)} color='bg-primary'/>
          <InfoCard icon={<LuWalletMinimal/>} label="Total Income " value={addThousandSeparator(dashboardData?.totalIncome||0)} color='bg-orange-500'/>
          <InfoCard icon={<LuHandCoins></LuHandCoins>} label="Total Expense " value={addThousandSeparator(dashboardData?.totalExpenses||0)} color='bg-red-500'/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <RecentTransactions transaction={dashboardData?.recentTransaction} onSeeMore={()=>navigate('/expense')}/>
            <FinanceOverview totalBalance={dashboardData?.totalBalance||0} totalIncome={dashboardData?.totalIncome||0} totalExpenses={dashboardData?.totalExpenses||0}/>
            <ExpenseTransactions transactions={dashboardData?.last30DaysExpenses?.transactions||[]} onSeeMore={()=>navigate("/expense")}/>
            <Last30daysExpenses data={dashboardData?.last30DaysExpenses?.transactions||[]}></Last30daysExpenses>
            <RecentIncomeWithChart data={dashboardData?.last60DaysIncome?.transactions?.slice(0,4)||[]} totalIncome={dashboardData?.totalIncome||0}/>
            <RecentIncome transactions={dashboardData?.last60DaysIncome?.transactions||[]} onSeeMore={()=>navigate('/income')}></RecentIncome>
        </div>
      </div>
    </DashboardLayout>
  )
};

export default Home