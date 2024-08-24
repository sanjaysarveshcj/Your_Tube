import * as api from "../Api";
import { debounce } from 'lodash';

const debouncedAddToHistory = debounce(async (historydata, dispatch) => {
    try {
      const { data } = await api.addtohistory(historydata);
      dispatch({ type: "POST_HISTORY", data });
      dispatch(getallhistory());
    } catch (error) {
      console.log(error);
    }
  }, 1000); 
  
  export const addtohistory = (historydata) => (dispatch) => {
    debouncedAddToHistory(historydata, dispatch);
  };

// export const addtohistory=(historydata)=>async(dispatch)=>{
//     try {
//         const{data}=await api.addtohistory(historydata)
//         dispatch({type:"POST_HISTORY",data})
//         dispatch(getallhistory())
//     } catch (error) {
//         console.log(error)
//     }
// }
export const getallhistory=()=>async(dispatch)=>{
    try {
        const {data}=await api.getallhistory()
        dispatch({type:'FETCH_ALL_HISTORY',payload:data})
    } catch (error) {
        console.log(error)
    }
}
export const clearhistory=(historydata)=>async(dispatch)=>{
    try {
        const {userid}=historydata
        await api.deletehistory(userid)
        dispatch(getallhistory())
    } catch (error) {
        console.log(error)
    }
}