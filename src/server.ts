import express from 'express';
import routes from './routes/routes' 
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

app.use(routes)

const porta = 3333
app.listen(porta, () => console.log(`http://localhost:${porta}/`));

// npm init -y
// npx tsc --init
// npm i ts-node-dev
// npm install @types/express
// npm i knex sqlite3
// knex migrate:latest // cria tabela
// knex migrate:rollback // apaga tabela