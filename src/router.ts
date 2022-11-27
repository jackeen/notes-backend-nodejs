/**
 * Using trie to implement the router for Koa.
 */

import path from "path";

import { Middleware } from "koa";

import { CustomParam } from "./router.param";

// for router using it to collect restful params during request
declare module "koa" {
	interface DefaultContext {
		params: CustomParam;
	}
}

interface RouterNode {
	name: string;
	isEndpoint: boolean;
	methods: Map<string, Middleware>;
	children: Map<string, RouterNode>;
	isParam: boolean;
	paramKey: string;
}

class Router {

	private base: string;
	private baseHandler: Middleware;
	private routeTrie: RouterNode;

	constructor(base?: string, baseHandler?: Middleware) {
		this.base = base;
		this.baseHandler = baseHandler;
		this.routeTrie = this._createRouterNode('');
	}

	private _throwError(err: string) {
		throw new Error(`* Router: ${err}`);
	}

	private _createRouterNode (name: string): RouterNode {
		return {
			name,
			isEndpoint: false,
			methods: new Map(),
			children: new Map(),
			isParam: false,
			paramKey: '',
		}
	}

	private _checkEndpoint (endpoint: string) {
		if (endpoint === '') {
			this._throwError('The endpoint is empty.');
		}
	}

	private _attachHandler (node: RouterNode, method: string, handler: Middleware) {
		node.isEndpoint = true;
		node.methods.set(method, handler);
	}

	private _spiltEndpoint (endpoint: string): string[] {
		let pathArr: string[];
		pathArr = endpoint.split('/');
		if (pathArr[0] === '') {
			pathArr.shift();
		}
		if (pathArr[pathArr.length-1] === '') {
			pathArr.pop();
		}
		return pathArr;
	}

	private _recordPathParam(node: RouterNode) {
		const name = node.name;
		if (name[0] === ':') {
			node.isParam = true;
			node.paramKey = name.slice(1);
		}
	}

	private _getParamNodeKey(nodes: Map<string, RouterNode>): string {
		for (const k of nodes.keys()) {
			if (k[0] === ':') {
				return k;
			}
		}
		return null;
	}

	private _insertTrie (method: string, endpoint: string, handler: Middleware) {
		this._checkEndpoint(endpoint);
		if (this.base) {
			endpoint = path.join(this.base, endpoint);
		}

		const pathArr = this._spiltEndpoint(endpoint);
		let trieNode = this.routeTrie;
		pathArr.forEach((v) => {
			let node = trieNode.children.get(v);
			if (node === undefined) {
				node = this._createRouterNode(v)
				trieNode.children.set(v, node);
			}
			this._recordPathParam(node);
			trieNode = node;
		});
		this._attachHandler(trieNode, method, handler);
	}

	private _reachRouterNode (endpoint: string, params: CustomParam): RouterNode {
		const pathArr = this._spiltEndpoint(endpoint);

		let trieNode = this.routeTrie;
		pathArr.every((v) => {
			let currentNode = trieNode.children.get(v);
			if (currentNode === undefined) {
				// try to figure out if it is a param in restful path
				const paramKey = this._getParamNodeKey(trieNode.children);
				if (paramKey === null) {
					trieNode = null;
					return false;
				}
				currentNode = trieNode.children.get(paramKey);
				params.set(currentNode.paramKey, v);
				trieNode = currentNode;
				return true;
			} else {
				trieNode = currentNode;
				return true;
			}
		});
		return trieNode;
	}

	private _nestMiddlewareList(handlers: Middleware[]): Middleware {
		if (this.baseHandler) {
			handlers.unshift(this.baseHandler);
		}

		return async (ctx, next) => {
			const n = handlers.length;
			function nest(i: number): Promise<any> {
				if (i === n) {
					return next();
				}
				return Promise.resolve(handlers[i](ctx, () => nest(++i)));
			}
			await nest(0);
		}
	}

	public get (endpoint: string, ...handlers: Middleware[]) {
		this._insertTrie('GET', endpoint, this._nestMiddlewareList(handlers));
	}

	public post (endpoint: string, ...handlers: Middleware[]) {
		this._insertTrie('POST', endpoint, this._nestMiddlewareList(handlers));
	}

	public put (endpoint: string, ...handlers: Middleware[]) {
		this._insertTrie('PUT', endpoint, this._nestMiddlewareList(handlers));
	}

	public patch (endpoint: string, ...handlers: Middleware[]) {
		this._insertTrie('PATCH', endpoint, this._nestMiddlewareList(handlers));
	}

	public delete (endpoint: string, ...handlers: Middleware[]) {
		this._insertTrie('DELETE', endpoint, this._nestMiddlewareList(handlers));
	}

	public route (): Middleware {
		return async (ctx, next) => {
			const endpoint = ctx.request.path;
			const method = ctx.request.method;
			const params = new CustomParam();
			const node = this._reachRouterNode(endpoint, params);

			if (node === null) {
				ctx.throw(404);
			}

			if (node.isEndpoint) {
				const handler = node.methods.get(method);
				if (handler) {
					ctx.params = params;
					await handler(ctx, next);
				} else {
					ctx.throw(405);
				}
			} else {
				ctx.throw(404);
			}
		}
	}

}


export default Router;