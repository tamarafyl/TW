import App from './app';
import UserController from "./controllers/user.controller"
import IndexController from "./controllers/index.controller";
import DataController from "./controllers/data.controller";
import TokenService from "./modules/services/toket.service";


const app: App = new App([
    new UserController(),
    new DataController(),
    new IndexController()
]);

const tokenService = new TokenService();
setInterval(() => {
    tokenService.removeExpiredTokens()
        .then(() => console.log('Wygasłe tokeny zostały usunięte'))
        .catch(err => console.error('Błąd podczas usuwania wygasłych tokenów:', err));
}, 60 * 60 * 1000); 

app.listen();