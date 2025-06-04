import App from './app';
import { createControllers } from './createControllers';
import TokenService from './modules/services/token.service';

const controllers = createControllers();
const app: App = new App(controllers);

const tokenService = new TokenService();
setInterval(() => {
    tokenService.removeExpiredTokens()
        .then(() => console.log('Wygasłe tokeny zostały usunięte'))
        .catch(err => console.error('Błąd podczas usuwania wygasłych tokenów:', err));
}, 60 * 60 * 1000);

app.listen();