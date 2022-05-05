
import { log } from "console";

enum TrafficSign {
	'IN' = '->',
	'OUT' = '<-',
}

class Logger {

	static trafficError (s: any, sign: TrafficSign) {
		log(`\x1b[31m${sign} ${s}\x1b[0m`);
	}

	static trafficInfo (s: any, sign: TrafficSign) {
		log(`\x1b[32m${sign} ${s}\x1b[0m`);
	}

	static trafficLog (s: any, sign: TrafficSign) {
		log(`${sign} ${s}`);
	}

	static error (s: any) {
		log(`\x1b[31m* ${s}\x1b[0m`);
	}
	static info (s: any) {
		log(`\x1b[32m* ${s}\x1b[0m`);
	}
	static log (s: any) {
		log(`* ${s}`);
	}
	static alert (s: any) {
		log(`\x1b[93m* ${s}\x1b[0m`);
	}
	static trace (...info: any) {
		log(info.join(', '));
	}
}

export {Logger, TrafficSign};