import express, { Request, Response, NextFunction } from 'express';
import config from "./env.config.js";
import registerControllers from "./src/main.js";

const app = express();
// app.set('views', '..front/views');

console.log(1234444, config);

// Middleware global que loga todas as requisições
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method.toUpperCase()} - ${req.url}`);
    next(); // Continua para a próxima função
});

app.listen(Number(config.host.port), config.host.domain, (err?: Error) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`APP listing on port: ${config.host.port}`);
        registerControllers();
    }
});

export default app;