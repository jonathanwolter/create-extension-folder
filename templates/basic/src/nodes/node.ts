import { createNodeDescriptor, INodeFunctionBaseParams } from "@cognigy/extension-tools";

/**
 * This file contains a simple node whith no children and no connections.
 *
 * It demonstrates how you can write a new flow-node in Cognigy.AI 4.0.0
 * and shows important concepts like:
 *
 * - describing the 'default values' for your node
 * - describing the 'fields' of your node - our UI will generate a UI for these
 * - defining the actual code ('function')
 * - showing how the new 'api' works which can be used by nodes (see 'api')
 * - how to use connections
 */

export interface IAmANode extends INodeFunctionBaseParams {
	config: {
		text: string;
		connection: {
			secret: string
		};
	}
}

export const node = createNodeDescriptor({
	type: "node",
	defaultLabel: "node",
	fields: [
		{
			key: "text",
			label: "some text",
			type: "cognigyText",
			params: {
				required: true,
			}
		}
	],
	function: async ({ cognigy, config }: IAmANode) => {
		const { api } = cognigy;
		const { text, connection } = config;

		api.say(text + connection.secret);
	}
});