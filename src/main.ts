import http from "http";

import Koa from "koa";
import bodyParser from "koa-bodyparser"

import Router from "./router";
import { Logger } from "./logger";
import errorCatch from "./errors";

import { validate } from "./auth/validate";
import * as Tag from "./handlers/tag";
import * as Cate from "./handlers/cate";
import * as Note from "./handlers/note";
import * as User from "./handlers/user";

const app = new Koa();
const router = new Router();


app.use(async (ctx, next) => {
	ctx.set('Access-Control-Allow-Origin', '*');
	await next();
});


// healthy info
router.get('/', (ctx) => {
	ctx.body = {
		success: true,
		version: 'v1.0.0',
		information: 'The notes manager based on nodejs and postgres.',
	}
});

router.post('/user/login', User.login);
router.post('/users', User.createNew);
router.get('/users/check/:user_name', User.checkExisted);

router.get('/tags', validate('get:tag'), Tag.getAll);
router.post('/tags', validate('post:tag'), Tag.insert);
router.patch('/tags/:id', validate('patch:tag'), Tag.update);
router.delete('/tags/:id', validate('delete:tag'), Tag.remove);

router.get('/cates', validate('get:cate'), Cate.getAll);
router.post('/cates', validate('post:cate'), Cate.insert);
router.patch('/cates/:id', validate('patch:cate'), Cate.update);
router.delete('/cates/:id', validate('delete:cate'), Cate.remove);

router.get('/notes', validate('get:note'), Note.getAll);
router.get('/notes/:id', validate('get:note'), Note.fetchDetail);
router.post('/notes', validate('post:note'), Note.insert);
router.patch('/notes/:id', validate('patch:note'), Note.update);
router.delete('/notes/:id', validate('delete:note'), Note.remove);


// catch errors emitted during holding requests
// it also log this information and the traffic status
app.use(errorCatch);

// parsing body automatically
app.use(bodyParser());

// add all handler
app.use(router.route());


const port = parseInt(process.env.SERVER_PORT, 10) || 8080;
const server = http.createServer(app.callback());

server.addListener('listening', () => {
	Logger.info(`Server bind on: ${port}`);
});

server.addListener('error', (err) => {
	Logger.error(`${err.message}`);
});

server.addListener('close', () => {
	Logger.info('Server closed');
});

server.listen(port);




// if (require.main === module) {

// }




