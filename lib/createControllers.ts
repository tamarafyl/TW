import DataController from './controllers/data.controller';
import IndexController from './controllers/index.controller';
import UserController from './controllers/user.controller';
import DataService from './modules/services/data.service';
import UserService from './modules/services/user.service';
import PasswordService from './modules/services/password.service';
import TokenService from './modules/services/token.service';
import Controller from './interfaces/controller.interface';

export function createControllers(): Controller[] {
    const dataService = new DataService();
    const userService = new UserService();
    const passwordService = new PasswordService();
    const tokenService = new TokenService();

    return [
        new DataController(dataService),
        new UserController(),
        new IndexController(),
    ];
}