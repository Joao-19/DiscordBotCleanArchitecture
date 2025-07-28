import express from 'express';
import config from "./env.config.js";
import registerControllers from "./src/main.js";

const app = express();
app.set('view engine', 'ejs');
app.set('views', '..front/views');

// Middleware global que loga todas as requisições
app.use((req, res, next) => {
    console.log(`${req.method.toUpperCase()} - ${req.url}`);
    next(); // Continua para a próxima função
});

app.listen(Number(config.host.port), config.host.domain, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log(`APP listing on port: ${config.host.port}`);
        registerControllers();
    }
});

export default app;