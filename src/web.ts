import { createServer, IncomingMessage, Server, ServerResponse } from 'http';
import Console from './utils/console';

export default class WebServer {
	server: Server;
	constructor() {
		this.server = createServer(this.handleRequest);
	}
	public start(port: number) {
		this.server.listen(port);
		Console.info('Started web server on port ' + port);
	}

	private handleRequest(req: IncomingMessage, res: ServerResponse) {
		const ip = req.socket.remoteAddress ?? 'Unknown ip';
		const page = req.url ?? 'Unknown page';

		Console.info(`Visitor ${ip} is requesting ${page}`);

		res.end();
	}
}
