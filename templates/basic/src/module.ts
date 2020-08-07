import { createExtension } from "@cognigy/extension-tools";

/* import all nodes */
import { node } from "./nodes/node";

/* import all connections */
import { secret } from "./connections/secret";

export default createExtension({
	nodes: [
		node,
	],

	connections: [
		secret
	]
});