import React, { useState } from 'react'
import Input from '../Inputs/Input'
import EmojiPickerPopUp from '../Inputs/EmojiPickerPopUp';

const AddIncomeForm = ({onAddIncome}) => {
    const[income,setIncome]=useState({
        source:"",
        amount:"",
        date:"",
        icon:"",
    });
    const handleChange=(key,value)=>{
        setIncome({...income,[key]:value});
    }
  return (
    <div>
      <EmojiPickerPopUp icon={income.icon} onSelect={(selectedIcon)=>handleChange("icon",selectedIcon)}></EmojiPickerPopUp>
        <Input value={income.source}  onChange={({target})=>handleChange("source",target.value)} label="Income Source " placeholder="FreeLance,Salary etc." type='text'></Input>
        <Input value={income.amount} onChange={({target})=>handleChange("amount",target.value)} label="Amount " placeholder=" " type='number'></Input>
        <Input value={income.date} onChange={({target})=>handleChange("date",target.value)} label="Income Date " placeholder="" type='date'></Input>
        <div className="flex justify-end mt-6">
          <button type='button' className='add-btn add-btn-fill' onClick={()=>onAddIncome(income)}>
            Add Income
          </button>
        </div>
    </div>
  )
}

export default AddIncomeForm