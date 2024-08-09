import history from "../Models/history.js"
import User from '../Models/Auth.js'


export const historycontroller=async(req,res)=>{
    const historydata=req.body
    //console.log(historydata)
    const addtohistory=new history(historydata)
    
    try {
        // const existingHistory = await history.findOne({ videoid, viewer });

        // if (existingHistory) {
        //     return res.status(200).json("Video already in history");
        // }else{
        await addtohistory.save()

        await User.findByIdAndUpdate(historydata.viewer, { $inc: { points: 5 } });

        res.status(200).json("added to history and points updated")
    } catch (error) {
        res.status(400).json(error.message)
        return
    }
}


export const getallhistorycontroller=async(req,res)=>{
    try {
        const files=await history.find()
        res.status(200).send(files)
    } catch (error) {
        res.status(400).json(error.message)
        return
    }
}

export const deletehistory =async(req,res)=>{
    const{userid:userid}=req.params;
    try {
        await history.deleteMany({
            viewer:userid
        })
        res.status(200).json({message:"removed from history"})
    } catch (error) {
        res.status(400).json(error.message)
        return
    }
}