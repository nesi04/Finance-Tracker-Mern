const xlsx = require('xlsx');
const Expense=require('../models/Expense');
exports.addExpense=async(req,res)=>{
    const userId=req.user.id;
    try {
        const{icon,category,amount,date}=req.body;
        if(!category||!amount||!date){
            return res.status(400).json({message:"All fields are requires"});
        }
        const newExpense=new Expense({
            userId,icon,category,amount,date:new Date(date)
        });
        await newExpense.save();
        res.status(200).json(newExpense);
    } catch (error) {
        res.status(500).json({message:"Server Error"});
    }
};

exports.getAllExpense=async(req,res)=>{
    const userId=req.user.id;

    try {
        const expense = await Expense.find({userId}).sort({date:-1});
        res.json(expense);
        
    } catch (error) {
        res.status(500).json({message:"Server Error"});
    }
};

exports.deleteExpense=async(req,res)=>{
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.status(201).json({message:"Expense deleted successfully"});
    } catch (error) {
        res.status(500).json({message:"Server Error"});
    }
};


exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;
    try {
        const expenses = await Expense.find({ userId }).sort({ date: -1 });

        const data = expenses.map((item) => ({
            Category: item.category,
            Amount: item.amount,
            Date: item.date ? new Date(item.date).toISOString().split("T")[0] : "", // Format date
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);

        xlsx.utils.book_append_sheet(wb, ws, "Expense");

        // Generate an Excel file in memory and send it as a response
        const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

        res.setHeader("Content-Disposition", 'attachment; filename="Expense_details.xlsx"');
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

        res.send(buffer);
    } catch (error) {
        console.error("Error generating expense report:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

