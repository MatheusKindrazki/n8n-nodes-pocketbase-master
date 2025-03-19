import { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';
import { httpVerbFields } from './HttpVerbDescription';

export class HttpBin implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'HttpBin',
		name: 'httpBin',
		icon: 'file:httpbin.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["path"]}}',
		description: 'Makes a HTTP request to HttpBin',
		defaults: {
			name: 'HttpBin',
			// eslint-disable-next-line n8n-nodes-base/node-class-description-color-present
			color: undefined,
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'httpBinApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'GET',
						value: 'get',
					},
					{
						name: 'POST',
						value: 'post',
					},
					{
						name: 'PUT',
						value: 'put',
					},
					{
						name: 'DELETE',
						value: 'delete',
					},
					{
						name: 'PATCH',
						value: 'patch',
					},
				],
				default: 'get',
			},
			{
				displayName: 'Path',
				name: 'path',
				type: 'options',
				options: [
					{
						name: 'Simple Response',
						value: 'response',
						description: 'Returns a simple response',
					},
					{
						name: 'Status',
						value: 'status',
						description: 'Return status code',
					},
				],
				default: 'response',
				required: true,
			},
			{
				displayName: 'Status Code',
				name: 'statusCode',
				type: 'number',
				required: true,
				default: 200,
				description: 'The status code to return. Must be valid HTTP status code.',
				displayOptions: {
					show: {
						path: ['status'],
					},
				},
			},
			...httpVerbFields,
		],
	};

	// The function below is responsible for actually doing whatever this node
	// is supposed to do. In this case, we're just appending the `myString` property
	// with whatever the user has entered.
	// You can make async calls and use `await`.
	async execute() {
		// Get credentials the user provided for this node
		// const credentials = await this.getCredentials('httpBinApi');

		return [[]]; // We need to return an empty response, as this is what is expected from a test node
	}
}
