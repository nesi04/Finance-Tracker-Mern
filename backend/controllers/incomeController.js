const xlsx = require('xlsx');
const Income=require('../models/income');
exports.addIncome=async(req,res)=>{
    const userId=req.user.id;
    try {
        const{icon,source,amount,date}=req.body;
        if(!source||!amount||!date){
            return res.status(400).json({message:"All fields are requires"});
        }
        const newIncome=new Income({
            userId,icon,source,amount,date:new Date(date)
        });
        await newIncome.save();
        res.status(200).json(newIncome);
    } catch (error) {
        res.status(500).json({message:"Server Error"});
    }
};

exports.getAllIncome=async(req,res)=>{
    const userId=req.user.id;

    try {
        const income = await Income.find({userId}).sort({date:-1});
        res.json(income);
        
    } catch (error) {
        res.status(500).json({message:"Server Error"});
    }
};

exports.deleteIncome=async(req,res)=>{
    try {
        await Income.findByIdAndDelete(req.params.id);
        res.status(201).json({message:"Income deleted successfully"});
    } catch (error) {
        res.status(500).json({message:"Server Error"});
    }
};



exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;
    try {
        const income = await Income.find({ userId }).sort({ date: -1 });

        const data = income.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date ? new Date(item.date).toISOString().split("T")[0] : "", // Format date
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);

        xlsx.utils.book_append_sheet(wb, ws, "Income");

        // Generate an Excel file in memory and send it as a response
        const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

        res.setHeader("Content-Disposition", 'attachment; filename="income_details.xlsx"');
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

        res.send(buffer);
    } catch (error) {
        console.error("Error generating income report:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

