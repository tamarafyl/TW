import jwt from 'jsonwebtoken';
import  TokenModel  from '../schemas/token.schema';
import {config} from '../../config';

class TokenService {
   public async create(user: any) {
       const access = 'auth';
       const userData = {
           userId: user.id,
           name: user.email,
           role: user.role,
           isAdmin: user.isAdmin,
           access: access
       };

       const value = jwt.sign(
           userData,
           config.JwtSecret,
           {
               expiresIn: '3h'
           });

      await TokenModel.create({
           userId: user._id,
           createDate: Date.now(),
           type: 'authorization',
           value
       });

       return value;
   }

   public getToken(token: any) {
       return {token: token.value};
   }
   public async remove(userId: string) {
       try {
           const result = await TokenModel.deleteOne({ userId: userId });
       
           if (result.deletedCount === 0) {
               throw new Error('Wystąpił błąd podczas usuwania danych');
           }
           return result;
       } catch (error) {
           console.error('Error while removing token:', error);
           throw new Error('Error while removing token');
       }
   }

    public async removeExpiredTokens() {
       const now = Date.now();
       const expiryTime = 3 * 60 * 60 * 1000;
       await TokenModel.deleteMany({
           createDate: { $lt: now - expiryTime }
       });
   }
}

export default TokenService;
