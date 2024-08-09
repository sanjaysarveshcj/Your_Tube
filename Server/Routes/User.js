import express from "express"
import { login } from "../Controllers/Auth.js"
import { updatechaneldata,getallchanels } from "../Controllers/channel.js"
import { getUserPoints } from "../Controllers/userpoints.js";
const routes=express.Router();

routes.post('/login',login)
routes.patch('/update/:id',updatechaneldata)
routes.get('/getallchannel',getallchanels)

routes.get('/userpoints/:id',getUserPoints)

export default routes;