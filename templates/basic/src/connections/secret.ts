import { IConnectionSchema } from "@cognigy/extension-tools";

/**
 * This file defines a 'schema' for a connection of type 'api-key'.
 * The connection needs to be referenced in the node that wants to
 * use the connection:
 * - see 'nodes/node.ts'
 *
 * The connection also needs to get exposed in the 'createExtension'
 * call:
 * - see 'module.ts'
 */

export const secret: IConnectionSchema = {
	type: "secret",
	label: "Holds a secret value.",
	fields: [
		{ fieldName: "value" }
	]
};