console.clear();

import { config } from 'dotenv';
config();

import WebSocket, { Data } from 'ws';
import http, { IncomingMessage, ServerResponse } from 'http';
import EventEmitter from 'events';
import Console from '../bot/utils/console';

import Discord from '../bot/utils/requests/discord';
import { WsMsgData } from '../bot/socket';

type ClientType = 'bot' | 'user';

interface ConnectedClient {
	token: string;
	ws?: WebSocket;
	type: ClientType;
}

interface User extends ConnectedClient {
	guild: string;
}

export default class WebSocketServer extends EventEmitter {
	private http: http.Server;
	private server: WebSocket.Server;

	private clients: ConnectedClient[] = [];

	constructor() {
		super();

		this.http = http.createServer(this.handleRequest);
		this.server = new WebSocket.Server({ noServer: true });

		this.http.on('upgrade', (request: IncomingMessage, socket, head) =>
			this.authenticate(request, (client?: ConnectedClient) => {
				if (!client) {
					socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
					socket.destroy();
					return;
				}

				this.server.handleUpgrade(request, socket, head, (ws) => this.handleConnection(ws, client));
			})
		);
	}

	/**
	 * Handle an incoming websocket connection
	 * @param ws
	 * @param client
	 */
	private handleConnection(ws: WebSocket, client: ConnectedClient) {
		ws.addListener(
			'close',
			() => (this.clients = this.clients.filter((filter) => filter !== client))
		);

		client.ws = ws;
		this.clients.push(client);

		if (client.type === 'bot') {
			this.msg(ws, { type: 'guilds', content: '433347979747786753' });
		}

		ws.on('message', (msg) => this.handleMsg(client, msg));
	}

	/**
	 * Send a message to a client
	 * @param client
	 * @param msg
	 */
	private msg(client: WebSocket, msg: WsMsgData) {
		client.send(JSON.stringify(msg));
	}

	/**
	 * Handle an incoming websocket message
	 * @param client
	 * @param msg
	 */
	private handleMsg(client: ConnectedClient, msg: Data) {
		const parsed: WsMsgData = JSON.parse(msg.toString());

		if (client.type === 'bot') {
			switch (parsed.type) {
				case 'guilds':
					break;
				default:
					break;
			}
		}
	}

	/**
	 * Handle an incoming webserver request
	 * @param req
	 * @param res
	 */
	private handleRequest(req: IncomingMessage, res: ServerResponse) {
		res.statusCode = 404;
		res.end();
	}

	/**
	 * Authenticate an incoming request for authorization
	 * @param req
	 * @param callback
	 * @returns
	 */
	private async authenticate(req: IncomingMessage, callback: (client?: ConnectedClient) => void) {
		const headers = req.headers.authorization;
		if (!headers) {
			callback();
			return;
		}

		const token = headers.replace('Bearer ', '');

		if (token === process.env.DISCORD) {
			callback({
				token,
				type: 'bot',
			});

			return;
		}

		const exists = await Discord.exists(token);

		if (exists) {
			callback({
				token,
				type: 'user',
			});

			return;
		}

		callback();
	}

	/**
	 * Start the websocket server
	 */
	public start() {
		this.http.listen(process.env.PORT, () =>
			Console.success('Started websocket server on port ' + process.env.PORT)
		);
	}
}

const webServer = new WebSocketServer();
webServer.start();
