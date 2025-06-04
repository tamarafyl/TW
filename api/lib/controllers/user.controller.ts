import Controller from '../interfaces/controller.interface';
import {Request, Response, NextFunction, Router} from 'express';
import {auth} from '../middlewares/auth.middleware';
import {admin} from '../middlewares/admin.middleware';
import UserService from "../modules/services/user.service";
import PasswordService from "../modules/services/password.service";
import TokenService from "../modules/services/toket.service"
import { requireRole } from '../middlewares/role.middleware';
import nodemailer from 'nodemailer'; 


class UserController implements Controller {
   public path = '/api/user';
   public router = Router();
   private userService = new UserService();
   private passwordService = new PasswordService();
   private tokenService = new TokenService();

   constructor() {
       this.initializeRoutes();
   }

   private initializeRoutes() {
       this.router.post(`${this.path}/create`,auth, requireRole('admin'), this.createNewOrUpdate);
       this.router.post(`${this.path}/auth`, this.authenticate);
       this.router.delete(`${this.path}/logout/:userId`,auth, this.removeHashSession);
    this.router.post(`${this.path}/reset-password`, this.resetPassword); 
   }

   private authenticate = async (request: Request, response: Response, next: NextFunction) => {
   const { login, password } = request.body;


   try {
       const user = await this.userService.getByEmailOrName(login);
       if (!user) {
           return response.status(401).json({ error: 'Unauthorized' });
       }


       const isAuthorized = await this.passwordService.authorize(user._id, password);
       if (!isAuthorized) {
           return response.status(401).json({ error: 'Unauthorized' });
       }


       const token = await this.tokenService.create(user);
       response.status(200).json(this.tokenService.getToken(token));
   } catch (error) {
       console.error(`Validation Error: ${error.message}`);
       response.status(401).json({ error: 'Unauthorized' });
   }
};


private createNewOrUpdate = async (request: Request, response: Response, next: NextFunction) => {
   const userData = request.body;
   console.log('userData', userData)
   try {
       const user = await this.userService.createNewOrUpdate(userData);
       if (userData.password) {
           const hashedPassword = await this.passwordService.hashPassword(userData.password)
           await this.passwordService.createOrUpdate({
               userId: user._id,
               password: hashedPassword
           });
       }
       response.status(200).json(user);
   } catch (error) {
       console.error(`Validation Error: ${error.message}`);
       response.status(400).json({error: 'Bad request', value: error.message});
   }


};


private removeHashSession = async (request: Request, response: Response, next: NextFunction) => {
   const {userId} = request.params;


   try {
       const result = await this.tokenService.remove(userId);
       console.log('aaa', result)
       response.status(200).json(result);
   } catch (error) {
       console.error(`Validation Error: ${error.message}`);
       response.status(401).json({error: 'Unauthorized'});
   }
};
 private resetPassword = async (request: Request, response: Response, next: NextFunction) => {
      const { login } = request.body;
      if (!login) {
         return response.status(400).json({ error: 'Brak loginu (email lub nazwa użytkownika)' });
      }
      try {
         const user = await this.userService.getByEmailOrName(login);
         if (!user) {
            return response.status(404).json({ error: 'Nie znaleziono użytkownika' });
         }

         // Wygeneruj nowe hasło
         const newPassword = Math.random().toString(36).slice(-8);

         // Zaktualizuj hasło w bazie
         const hashedPassword = await this.passwordService.hashPassword(newPassword);
         await this.passwordService.createOrUpdate({
            userId: user._id,
            password: hashedPassword
         });

         // Skonfiguruj transport do wysyłki maila (przykład dla Gmaila)
         const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
               user: process.env.MAIL_USER, // ustaw w .env
               pass: process.env.MAIL_PASS  // ustaw w .env
            }
         });
          const mailOptions = {
            from: process.env.MAIL_USER,
            to: user.email,
            subject: 'Reset hasła - IoT Dashboard',
            text: `Twoje nowe hasło: ${newPassword}`
         };

         await transporter.sendMail(mailOptions);

         response.status(200).json({ message: 'Nowe hasło zostało wysłane na adres e-mail.' });
      } catch (error) {
         console.error(`Reset Password Error: ${error.message}`);
         response.status(500).json({ error: 'Błąd podczas resetowania hasła' });
      }
   };


}

export default UserController;
