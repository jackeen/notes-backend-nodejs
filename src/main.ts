import http from "http";

import Koa from "koa";
import bodyParser from "koa-bodyparser"

import Router from "./router";
import {Logger} from "./logger";
import errorCatch from "./errors";

import Auth from "./auth/validate";
import * as Tag from "./handlers/tag";

const app = new Koa();
const router = new Router();

// healthy info
router.get('/', (ctx) => {
	ctx.body = {
		version: 'v1.0.0',
		message: 'The notes manager based on nodejs and postgres.',
	}
});

// router.get('/cates/:cate_id/notes/:note_id', (ctx) => {
// 	ctx.body = {
// 		cateId: ctx.params.get('cate_id'),
// 		noteId: ctx.params.get('note_id'),
// 	}
// });


router.get('/tags', Auth.validate('get:tag'), Tag.getAll);
router.post('/tags', Auth.validate('post:tag'), Tag.insert);
router.patch('/tags/:id', Auth.validate('patch:tag'), Tag.update);
router.delete('/tags/:id', Auth.validate('delete:tag'), Tag.remove);

// router.get('/cates', Auth.validate('get:cate'), cates.get);
// router.post('/cates', Auth.validate('post:cate'), cates.post);
// router.patch('/cates/:id', Auth.validate('patch:cate'), cates.patch);
// router.delete('/cates/:id', Auth.validate('delete:cate'), cates.delete);

// router.get('/notes', Auth.validate('get:note'), notes.get);
// router.post('/notes', Auth.validate('post:note'), notes.post);
// router.patch('/notes/:id', Auth.validate('patch:note'), notes.patch);
// router.delete('/notes/:id', Auth.validate('delete:note'), notes.delete);


// catch errors emitted during holding requests
// it also log this information and the traffic status
app.use(errorCatch);

//
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




