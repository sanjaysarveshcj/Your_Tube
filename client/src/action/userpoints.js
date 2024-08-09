import * as api from "../Api";

export const getUserPoints=(userid)=>async(dispatch)=>{
  try {
      const {data}=await api.getUserPoints(userid)
      dispatch({type:'FETCH_ALL_POINTS',payload: data.points})
  } catch (error) {
      console.log(error)
  }
}
