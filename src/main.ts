import http from "http";

import {Koa} from "./types";
import Router from "./router";
import {Logger} from "./logger";
import errorCatch from "./errors";

import Auth from "./auth/validate";
import * as Handlers from "./handlers/mod";

const app = new Koa();
const router = new Router();

// healthy info
router.get('/', (ctx) => {
	ctx.body = {
		version: 'v1.0.0',
		message: 'The notes manager based on nodejs and postgres.',
	}
});

router.get('/cates/:cate_id/notes/:note_id', (ctx) => {
	ctx.body = {
		cateId: ctx.params.get('cate_id'),
		noteId: ctx.params.get('note_id'),
	}
});


router.get('/tags', Auth.validate('get:tag'), Handlers.tags.getList);


// catch errors emitted during holding requests
// it also log this information and the traffic status
app.use(errorCatch);

// add all handler
app.use(router.route());




const port = 8080
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




