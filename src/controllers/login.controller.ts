import { User, IUser } from './../models'
import { toHash, createRandomToken } from '../utils/utils'

class LoginController {
  
  async login(req: any, res: any) {

    const { username, password } = req.body
    const hash = toHash(username, password)

    let result:IUser[] = await User.find({ hash })

    if (result.length > 0) {
      let token = createRandomToken()
      result[0].token = token;
      await User.updateOne({_id: result[0]._id},result[0])
      res.status(200).json({ token })
    }else{
      res.status(403).json({error: ''})
    }
    
  }

  async checkAuth(req: any, res: any) {
    const token = req.body.token
    let result:IUser[] = await User.find({ token })
    if (result.length > 0) {
      res.status(200).json({message: "User authenticated"})
    }else{
      res.status(403).json({error: ''})
    }
  }

  async logout(req: any, res: any) {
    const token = req.body.token
    let result:IUser[] = await User.find({ token })
    result[0].token = ""
    await User.updateOne({_id: result[0]._id},result[0])
    res.status(200).json({message: "logout"}) 
  }

}

export default LoginController;