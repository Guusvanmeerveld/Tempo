import WebSocket from 'ws';
import http, { IncomingMessage, ServerResponse } from 'http';
import EventEmitter from 'events';
import Console from './utils/console';

import Discord from './utils/requests/discord';

export default class WebSocketServer extends EventEmitter {
	private http: http.Server;
	private server: WebSocket.Server;

	constructor() {
		super();

		this.http = http.createServer(this.request);
		this.server = new WebSocket.Server({ noServer: true });

		this.http.on('upgrade', (request: IncomingMessage, socket, head) =>
			this.authenticate(request, (err?: string, client?: any) => {
				if (err || !client) {
					socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
					socket.destroy();
					return;
				}

				this.server.handleUpgrade(request, socket, head, (ws) =>
					this.server.emit('connection', ws, request, client)
				);
			})
		);

		this.server.on('connection', (ws) => {
			ws.on('message', (msg) => this.emit('message', ws, msg));
		});
	}

	private request(req: IncomingMessage, res: ServerResponse) {
		res.statusCode = 404;
		res.end();
	}

	private async authenticate(req: IncomingMessage, callback: (err?: string, client?: any) => void) {
		if (!req.headers.authorization) {
			callback('No authorization header present');
			return;
		}

		const exists = await Discord.exists(req.headers.authorization);

		if (!exists) {
			callback('No valid user');
			return;
		}
	}

	public start() {
		this.http.listen(process.env.PORT, () =>
			Console.success('Started websocket server on port ' + process.env.PORT)
		);
	}
}
