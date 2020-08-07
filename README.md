# Create Cognigy-4 Extension

This repository will become the new 'custom-modules' repository for Cognigy.AI 4.0.0. We are no longer using the name 'custom-module' but the new term 'extension'.

Currently, extensions can only contain flow-nodes and connections, but we want to add more functionality later on.

- [Download](#creating-an-extension) – How to install a template project.
- [Development](#development) – How to code a new Extension.

This script works on macOS, Windows, and Linux.<br>

## Creating an Extension

```sh
npx create-extension-folder my-extension basic
cd ./my-extension
```
Run those two simple commands to install a new basic template project and get started with development. You can use [additional arguments](#Creating_an_Extension) 

### Get Started Immediately

You do not need to install or configure any additional tools.<br>
They are preconfigured and hidden so that you can focus on the code.

### installing with `npx create-extension-folder <arguments> <my-extension-name>`
Use this command and you are ready to go. Here are the arguments you can use:

* `example` gives you an example extension
* `empty` gives you an (almost) empty project
* `basic` gives you a basic project with only very few, basic elements
* no argument also gives you the basic project

### building with `npm run build`

Builds the app for production and recreates a .tar.gz archive to be seamlessly uploaded.

### deploying with `npm run deploy`

***(not yet working!)***

*advanced* <br> Use the Cognigy API to upload your extension without using the website.

# Development
## How to get started?
If you want to build an extension, please first have a look at the 'example' project template as it contains the code for an extension which includes multiple flow-nodes and uses most of the important concepts we have introduced with the new 'extensions' functionality in Cognigy.AI 4.0.0. <br>Install the 'example' project template with `npx create-extension-folder example example-project`

## @cognigy/extension-tools

### createNodeDescriptor
The method `createNodeDescriptor` is one of the most central methods exposed by the 'extension-tools' package. It is recommended to only use one `createNodeDescriptor` per file (unless it has children), since it is now possible to include multiple descriptory files per Extension.

Defining a node essentially looks like this (you can find this example in 'example/src/nodes/reverseSay):

```typescript
import { createNodeDescriptor, INodeFunctionBaseParams } from "@cognigy/extension-tools";

export interface IReverseSayParams extends INodeFunctionBaseParams {
	config: {
		text: string;
	}
}

export const reverseSay = createNodeDescriptor({
	type: "reverseSay",

	defaults: {
		label: "Simple Reverse Say",
		comment: "Reverses the given string and sends it.",
		config: {
			text: "{{ci.text}}"
		}
	},

	fields: [
		{
			key: "text",
			label: "The text you want to reverse.",
			type: "cognigyText"
		}
	],

	function: async ({ cognigy, config }: IReverseSayParams) => {
		const { api } = cognigy;
		const { text } = config;

		const reversedText = text.split("").reverse().join();

		api.say(reversedText);
	}
});
```

Let's analyze the different pieces we can see in the code-window above:
```typescript
import { createNodeDescriptor, INodeFunctionBaseParams } from "@trash-planet/extension-tools";
```

Here we are just importing the `createNodeDescriptor` method from the extension-tools package. We are also importing a Typescript interface we want to use.

```typescript
export interface IReverseSayParams extends INodeFunctionBaseParams {
	config: {
		text: string;
	}
}
```

In this part of the node-code we are crafting a `new Typescript interface` for the config (the arguments) of the new flow-node. We advise you to do this for your nodes as you will have a better developer experience when you are actually creating the `code` (aka the `function`) of your flow-node. Make sure that you extend on our `INodeFunctionBaseParams` interface - this will give you access to:
- **cognigy** object with sub-properties:
  - **api**: This exposes the APi your flow-nodes can use.
  - **input**: The Cognigy Input Object, this is a proxy so you can set/get values.
  - **context**: The Cognigy Context Object, this is a proxy so you can set/get values.
  - **profile**; The Cognigy Contact Profile Object, this, too, is a proxy so you can set/get values.
- **nodeId** the actual id of the node that is being executed
- **config** this is the config/arguments of your node - that's why you should overwrit this in your own Interface
- **childConfigs[]** in case your node has children, this array contains those children's configs

```typescript
export const reverseSay = createNodeDescriptor({
	type: "reverseSay",
	defaultLabel: "Reverse Say",
	fields: [
		{
			key: "text",
			label: "The text you want to reverse.",
			type: "cognigyText",
			defaultValue: "{{input.text}}"
		}
	],
	preview: {
		type: "text",
		key: "text"
	},

	function: async ({ cognigy, config }: IReverseSayParams) => {
		const { api } = cognigy;
		const { text } = config;

		const reversedText = text.split("").reverse().join();

		api.say(reversedText);
	}
});
```

Now comes the actual definition & implementation of your flow-node. You essentially pass in an object into `createNodeDescriptor` and it will create a full node-descriptor for you. The method will fill-up on properties you don't set with compatible default values. Let's discuss some of the properties you have to set:
- **type**: This is the `type` of your node. Every node needs to have its own type. 
- **defaultslabel**: The default label of your node is the name that is displaed in the flow by default.
- **fields**: This section defines the user interface which will get generated for your node-config. You have to add a `field definition` per key in your `config` object. You reference the `key in your config` using the `key` property in the field definition. The label is used in the UI as well. The type gives you a variety of possibilities - you can e.g. say that your field should be of type `cognigyText` or e.g. of type json or toggle.
- **preview**: *(optional)* Displays the value of one of the node's config-fields.
- **function**: This actually contains the code of your flow-node. Ensure that you add the `async` keyword. The execution engine will always `await` the execution of your node. We have full Typescript support, please e.g. check the typings of the **cognigy** object as we don't have full documentation, yet.

### createExtension
Whereas the `createNodeDescriptor` method essentially just fills-up default-values for your flow-nodes, it's the `createExtension` methods job to bundle all nodes and connection definitions into one large object which will then be passed into the Cognigy.AI system.

Make sure that you are using the `default export ` syntax for the createExtensions return-value as we need to be able to find the complete object.

It is highly recommended to always create a `module.ts` file which essentially looks like the one in `example/src/module.ts`. Please only import all nodes and connections into this file and assign them to the payload you pass into the create extension method.

```typescript
import { createExtension } from "@cognigy/extension-tools";

/* import all nodes */
import { reverseSay } from "./nodes/reverseSay";
import { executeCognigyApiRequest } from "./nodes/executeCognigyApiRequest";
//if multiple nodes are in one script, import all of them
import { randomPath, randomPathLeft, randomPathRight } from "./nodes/randomPath";
import { fullExample } from "./nodes/fullExample";

/* import all connections */
import { apiKeyConnection } from "./connections/apiKeyConnection";

export default createExtension({
    //define the nodes to be exported
	nodes: [
		reverseSay,
		executeCognigyApiRequest,

		randomPath,
		randomPathLeft,
		randomPathRight,
		fullExample
	],

    //define the nodes to be exported
	connections: [
		apiKeyConnection
	]
});
```

### Connections
In Cognigy 3 we have introduced the concept of `Secrets` which allow you to securely store configurations. Secrets do no longer exist in Cognigy 4, but were replaced with the `Connections`.

Extension now have a stringer relationship with their cocrresponding flow-nodes. They can be assigned using configuration fields in the flow node.

If you want to use a connection within a node, you have to do the following:
- add a **field** with **type: connection** to your flow-node, you can see this in 'example/src/nodes/executeCognigyApiRequest.ts'
  ```typescript
  {
      key: "connection",
      label: "The api-key connection which should be used.",
      type: "connection",
      params: {
          connectionType: "api-key" // this needs to match the connections 'type' property
      }
  }
  ```
- create a connection definition, see 'example/src/connections/'
- add the **connection** into your **createExtensions** call - if you miss it there, it will not be there.

You have to ensure that the `params.connectionType` in your flow-node field definition maps to a connection and a proper `type` of the connection. You can define multiple connections within a single extension and the `type` field is used to find the correct connections that satisfy the fields your node requires.