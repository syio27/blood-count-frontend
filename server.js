import { express } from "express";
import path from "path";

const app = express();

app.use(express.static('./dist/herokuTest'));

app.get("/*", (req, res) =>
    res.sendFile('index.html', { root: 'dist/angular-heroku' }),
);

app.listen(process.env.PORT || 8080);