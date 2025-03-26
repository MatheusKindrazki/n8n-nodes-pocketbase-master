import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

// Definindo a interface para o PocketBaseClient
interface PocketBaseClient {
	collection: (name: string) => {
		create: (data: IDataObject | typeof FormData) => Promise<IDataObject>;
		delete: (id: string) => Promise<void>;
		getOne: (id: string) => Promise<IDataObject>;
		getList: (page: number, perPage: number, options?: IDataObject) => Promise<{
			items: IDataObject[];
			page: number;
			perPage: number;
			totalItems: number;
			totalPages: number;
		}>;
		update: (id: string, data: IDataObject | typeof FormData) => Promise<IDataObject>;
	};
	admins: {
		authWithPassword: (email: string, password: string) => Promise<IDataObject>;
	};
	authStore: {
		save: (token: string, model: IDataObject | null) => void;
		token: string | null;
	};
}

// For FormData handling
declare const FormData: any;
declare const Blob: any;
declare const File: any;

class PocketBaseCustom implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'PocketBase Custom',
		name: 'pocketBaseCustom',
		icon: 'file:pocketbase.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Work with PocketBase records',
		defaults: {
			name: 'PocketBase Custom',
		},
		inputs: ['main'] as any,
		outputs: ['main'] as any,
		credentials: [
			{
				name: 'pocketBaseCustomApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Record',
						value: 'record',
					},
				],
				default: 'record',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['record'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a record',
						action: 'Create a record',
					},
					{
						name: 'Create with Files',
						value: 'createWithFiles',
						description: 'Create a record with file uploads',
						action: 'Create a record with file uploads',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a record',
						action: 'Delete a record',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a record',
						action: 'Get a record',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many records',
						action: 'Get many records',
					},
					{
						name: 'Multi-Table Query',
						value: 'multiTableQuery',
						description: 'Query records across multiple tables',
						action: 'Query records across multiple tables',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a record',
						action: 'Update a record',
					},
					{
						name: 'Update with Files',
						value: 'updateWithFiles',
						description: 'Update a record with file uploads',
						action: 'Update a record with file uploads',
					},
				],
				default: 'get',
			},

			// ----------------------------------
			//         record:create
			// ----------------------------------
			{
				displayName: 'Collection',
				name: 'collection',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['record'],
						operation: ['create', 'createWithFiles', 'delete', 'get', 'getMany', 'update', 'updateWithFiles'],
					},
				},
				description: 'The name of the PocketBase collection',
			},
			{
				displayName: 'Data',
				name: 'data',
				type: 'json',
				required: true,
				default: '{}',
				displayOptions: {
					show: {
						resource: ['record'],
						operation: ['create', 'update'],
					},
				},
				description: 'Record data to send as JSON',
			},

			// ----------------------------------
			//        record:createWithFiles and updateWithFiles
			// ----------------------------------
			{
				displayName: 'Fields Data',
				name: 'fieldsData',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						resource: ['record'],
						operation: ['createWithFiles', 'updateWithFiles'],
					},
				},
				default: {},
				placeholder: 'Add Field',
				options: [
					{
						displayName: 'Field',
						name: 'field',
						values: [
							{
								displayName: 'Field Name',
								name: 'fieldName',
								type: 'string',
								default: '',
								description: 'The name of the field',
							},
							{
								displayName: 'Field Value',
								name: 'fieldValue',
								type: 'string',
								default: '',
								description: 'The value of the field',
							},
						],
					},
				],
				description: 'Regular field data for the record',
			},
			{
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'data',
				required: true,
				displayOptions: {
					show: {
						resource: ['record'],
						operation: ['createWithFiles', 'updateWithFiles'],
					},
				},
				placeholder: '',
				description: 'Name of the binary property that contains files to upload',
			},
			{
				displayName: 'File Field Names',
				name: 'fileFieldNames',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['record'],
						operation: ['createWithFiles', 'updateWithFiles'],
					},
				},
				placeholder: 'e.g. documents,avatar',
				description: 'Comma-separated list of field names that will receive the uploaded files',
			},
			{
				displayName: 'Append Files',
				name: 'appendFiles',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						resource: ['record'],
						operation: ['updateWithFiles'],
					},
				},
				description: 'Whether to append files to existing ones instead of replacing them',
			},

			// ----------------------------------
			//        record:get, delete, update
			// ----------------------------------
			{
				displayName: 'Record ID',
				name: 'recordId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['record'],
						operation: ['delete', 'get', 'update', 'updateWithFiles'],
					},
				},
				description: 'ID of the record',
			},

			// ----------------------------------
			//         record:getMany
			// ----------------------------------
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['record'],
						operation: ['getMany'],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['record'],
						operation: ['getMany'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Filter',
				name: 'filter',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['record'],
						operation: ['getMany'],
					},
				},
				default: '',
				placeholder: 'e.g. status = "active" && created > "2022-01-01"',
				description: 'Filter the results. Check the PocketBase API documentation for supported syntax.',
			},
			{
				displayName: 'Sort',
				name: 'sort',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['record'],
						operation: ['getMany'],
					},
				},
				default: '',
				placeholder: 'e.g. -created,name',
				description: 'Specify the sorting parameter using the format: -created,name',
			},

			// ----------------------------------
			//     record:multiTableQuery
			// ----------------------------------
			{
				displayName: 'Tables',
				name: 'tables',
				placeholder: 'Add Table',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
					sortable: true,
				},
				default: {},
				displayOptions: {
					show: {
						resource: ['record'],
						operation: ['multiTableQuery'],
					},
				},
				options: [
					{
						name: 'tableValues',
						displayName: 'Table',
						values: [
							{
								displayName: 'Collection Name',
								name: 'collection',
								type: 'string',
								default: '',
								description: 'Name of the collection/table to query',
							},
							{
								displayName: 'Filter',
								name: 'filter',
								type: 'string',
								default: '',
								placeholder: 'e.g. email = "test@example.com"',
								description: 'Filter criteria for this table',
							},
							{
								displayName: 'Fields',
								name: 'fields',
								type: 'string',
								default: '',
								placeholder: 'e.g. id,name,email',
								description: 'Comma-separated list of fields to return (leave empty for all fields)',
							},
							{
								displayName: 'Limit',
								name: 'limit',
								type: 'number',
								typeOptions: {
									minValue: 1,
								},
								default: 50,
								description: 'Max number of results to return',
							},
						],
					},
				],
				description: 'Define multiple tables to query',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['record'],
						operation: ['multiTableQuery'],
					},
				},
				options: [
					{
						displayName: 'Merge Results',
						name: 'mergeResults',
						type: 'boolean',
						default: false,
						description: 'Whether to merge results based on a common field',
					},
					{
						displayName: 'Merge Field',
						name: 'mergeField',
						type: 'string',
						default: 'id',
						description: 'Field to use for merging results (typically a unique identifier)',
						displayOptions: {
							show: {
								mergeResults: [true],
							},
						},
					},
					{
						displayName: 'Remove Duplicates',
						name: 'removeDuplicates',
						type: 'boolean',
						default: true,
						description: 'Whether to remove duplicate entries when merging',
						displayOptions: {
							show: {
								mergeResults: [true],
							},
						},
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		// Get credentials
		const credentials = await this.getCredentials('pocketBaseCustomApi');
		if (!credentials) {
			throw new NodeOperationError(this.getNode(), 'No credentials provided');
		}

		// Dynamic import of PocketBase
		const PocketBase = await import('pocketbase').then((module) => module.default);
		const client = new PocketBase(credentials.url as string) as unknown as PocketBaseClient;

		// Authenticate if email and password are provided
		if (credentials.email && credentials.password) {
			try {
				const authData = await client.admins.authWithPassword(
					credentials.email as string,
					credentials.password as string,
				);

				if (!authData || !client.authStore.token) {
					// eslint-disable-next-line n8n-nodes-base/node-execute-block-wrong-error-thrown
					throw new Error('Authentication failed - No token received');
				}

			} catch (error) {
				throw new NodeOperationError(
					this.getNode(),
					`PocketBase authentication failed: ${error.message}. Please verify your credentials.`,
				);
			}
		}
		// Use token if provided
		else if (credentials.apiToken) {
			try {
				client.authStore.save(credentials.apiToken as string, null);

				if (!client.authStore.token) {
					// eslint-disable-next-line n8n-nodes-base/node-execute-block-wrong-error-thrown
					throw new Error('Token authentication failed - Token not saved properly');
				}

			} catch (error) {
				throw new NodeOperationError(
					this.getNode(),
					`PocketBase token authentication failed: ${(error as Error).message}. Please verify your API token.`,
				);
			}
		} else {
			throw new NodeOperationError(
				this.getNode(),
				'Either email/password or API token must be provided',
			);
		}

		// Verify authentication before proceeding
		if (!client.authStore.token) {
			throw new NodeOperationError(
				this.getNode(),
				'Authentication failed - No valid token available',
			);
		}

		// Loop through items and process each one
		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'record') {
					// *********************************************************************
					//                              record
					// *********************************************************************

					if (operation === 'create') {
						// ----------------------------------
						//          record:create
						// ----------------------------------
						const collection = this.getNodeParameter('collection', i) as string;
						const data = this.getNodeParameter('data', i) as string;
						const parsedData = JSON.parse(data);

						// Send the request to create a record
						const response = await client.collection(collection).create(parsedData);

						returnData.push({
							json: response,
							pairedItem: { item: i },
						});
					} else if (operation === 'createWithFiles') {
						// ----------------------------------
						//     record:createWithFiles
						// ----------------------------------
						const collection = this.getNodeParameter('collection', i) as string;
						const fieldsData = this.getNodeParameter('fieldsData.field', i, []) as IDataObject[];
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
						const fileFieldNames = (this.getNodeParameter('fileFieldNames', i) as string).split(',').map(f => f.trim());

						// FormData is required for file uploads
						const formData = new FormData();

						// Add all the regular fields
						for (const field of fieldsData) {
							if (field.fieldName && field.fieldValue) {
								formData.append(field.fieldName as string, field.fieldValue as string);
							}
						}

						// Check if the binary data exists
						const binaryData = items[i].binary?.[binaryPropertyName];
						if (binaryData) {

							// If it's a single file
							if (!Array.isArray(binaryData)) {
								const fileFieldName = fileFieldNames[0] || 'file';
								const fileBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
								const fileName = binaryData.fileName || 'file';

								// Create a blob from the buffer
								const blob = new Blob([fileBuffer]);
								const file = new File([blob], fileName);

								formData.append(fileFieldName, file);
							}
							// If it's multiple files in an array
							else if (Array.isArray(binaryData)) {
								binaryData.forEach(async (data, index) => {
									const fileFieldName = fileFieldNames[index] || fileFieldNames[0] || 'files';
									const fileBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
									const fileName = data.fileName || `file${index}`;

									// Create a blob from the buffer
									const blob = new Blob([fileBuffer]);
									const file = new File([blob], fileName);

									formData.append(fileFieldName, file);
								});
							}
						}

						// Send the request with FormData
						const response = await client.collection(collection).create(formData);

						returnData.push({
							json: response,
							pairedItem: { item: i },
						});
					} else if (operation === 'delete') {
						// ----------------------------------
						//          record:delete
						// ----------------------------------
						const collection = this.getNodeParameter('collection', i) as string;
						const recordId = this.getNodeParameter('recordId', i) as string;

						// Send the request to delete the record
						await client.collection(collection).delete(recordId);

						returnData.push({
							json: { success: true, id: recordId },
							pairedItem: { item: i },
						});
					} else if (operation === 'get') {
						// ----------------------------------
						//          record:get
						// ----------------------------------
						const collection = this.getNodeParameter('collection', i) as string;
						const recordId = this.getNodeParameter('recordId', i) as string;

						// Send the request to get the record
						const response = await client.collection(collection).getOne(recordId);

						returnData.push({
							json: response,
							pairedItem: { item: i },
						});
					} else if (operation === 'getMany') {
						// ----------------------------------
						//          record:getMany
						// ----------------------------------
						const collection = this.getNodeParameter('collection', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						const options: IDataObject = {};

						// Apply filters and sorting if specified
						const filter = this.getNodeParameter('filter', i, '') as string;
						if (filter) {
							options.filter = filter;
						}

						const sort = this.getNodeParameter('sort', i, '') as string;
						if (sort) {
							options.sort = sort;
						}

						// Handle pagination
						if (!returnAll) {
							const limit = this.getNodeParameter('limit', i, 50) as number;
							options.perPage = limit;
						}

						// Send the request to get many records
						const response = await client.collection(collection).getList(1, options.perPage as number, options);

						const records = response.items;

						returnData.push({
							json: {
								total: response.totalItems,
								page: response.page,
								perPage: response.perPage,
								totalPages: response.totalPages,
								items: records,
							},
							pairedItem: { item: i },
						});
					} else if (operation === 'update') {
						// ----------------------------------
						//          record:update
						// ----------------------------------
						const collection = this.getNodeParameter('collection', i) as string;
						const recordId = this.getNodeParameter('recordId', i) as string;
						const data = this.getNodeParameter('data', i) as string;
						const parsedData = JSON.parse(data);

						// Send the request to update the record
						const response = await client.collection(collection).update(recordId, parsedData);

						returnData.push({
							json: response,
							pairedItem: { item: i },
						});
					} else if (operation === 'updateWithFiles') {
						// ----------------------------------
						//     record:updateWithFiles
						// ----------------------------------
						const collection = this.getNodeParameter('collection', i) as string;
						const recordId = this.getNodeParameter('recordId', i) as string;
						const fieldsData = this.getNodeParameter('fieldsData.field', i, []) as IDataObject[];
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
						const fileFieldNames = (this.getNodeParameter('fileFieldNames', i) as string).split(',').map(f => f.trim());
						const appendFiles = this.getNodeParameter('appendFiles', i, false) as boolean;

						// FormData is required for file uploads
						const formData = new FormData();

						// Add all the regular fields
						for (const field of fieldsData) {
							if (field.fieldName && field.fieldValue) {
								formData.append(field.fieldName as string, field.fieldValue as string);
							}
						}

						// Check if the binary data exists
						const binaryData = items[i].binary?.[binaryPropertyName];
						if (binaryData) {

							// If it's a single file
							if (!Array.isArray(binaryData)) {
								// Determine the field name, with '+' suffix if appending
								const fileFieldName = appendFiles
									? `${fileFieldNames[0] || 'file'}+`
									: fileFieldNames[0] || 'file';

								const fileBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
								const fileName = binaryData.fileName || 'file';

								// Create a blob from the buffer
								const blob = new Blob([fileBuffer]);
								const file = new File([blob], fileName);

								formData.append(fileFieldName, file);
							}
							// If it's multiple files in an array
							else if (Array.isArray(binaryData)) {
								binaryData.forEach(async (data, index) => {
									// Determine the field name, with '+' suffix if appending
									const fileFieldName = appendFiles
										? `${fileFieldNames[index] || fileFieldNames[0] || 'files'}+`
										: fileFieldNames[index] || fileFieldNames[0] || 'files';

									const fileBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
									const fileName = data.fileName || `file${index}`;

									// Create a blob from the buffer
									const blob = new Blob([fileBuffer]);
									const file = new File([blob], fileName);

									formData.append(fileFieldName, file);
								});
							}
						}

						// Send the request with FormData
						const response = await client.collection(collection).update(recordId, formData);

						returnData.push({
							json: response,
							pairedItem: { item: i },
						});
					} else if (operation === 'multiTableQuery') {
						// ----------------------------------
						//      record:multiTableQuery
						// ----------------------------------
						const tablesData = this.getNodeParameter('tables.tableValues', i, []) as IDataObject[];
						const options = this.getNodeParameter('options', i, {}) as IDataObject;

						// Store all the results from different tables
						const allResults: IDataObject = {};

						// Loop through each table and execute the query
						for (const tableData of tablesData) {
							const collection = tableData.collection as string;
							const filter = tableData.filter as string;
							const fields = tableData.fields as string;
							const limit = tableData.limit as number || 50;

							// Construct query options
							const queryOptions: IDataObject = {
								filter,
								fields: fields ? fields.split(',').map(f => f.trim()) : undefined,
								perPage: limit,
							};

							// Execute the query for this table
							const response = await client.collection(collection).getList(1, limit, queryOptions);

							// Store the results
							allResults[collection] = response.items;
						}

						// Handle result merging if configured
						if (options.mergeResults === true) {
							const mergeField = options.mergeField as string || 'id';
							const removeDuplicates = options.removeDuplicates !== false;

							let mergedResults: IDataObject[] = [];
							const uniqueValues = new Set();

							// Merge all results from different tables
							for (const tableName in allResults) {
								const tableResults = allResults[tableName] as IDataObject[];

								for (const result of tableResults) {
									const fieldValue = result[mergeField] as string;

									// Skip duplicates if configured to do so
									if (removeDuplicates && fieldValue && uniqueValues.has(fieldValue)) {
										continue;
									}

									if (fieldValue) {
										uniqueValues.add(fieldValue);
									}

									// Add table name to identify the source
									result.sourceTables = [tableName];
									mergedResults.push(result);
								}
							}

							returnData.push({
								json: {
									merged: true,
									mergeField,
									count: mergedResults.length,
									results: mergedResults
								},
								pairedItem: { item: i },
							});
						} else {
							// Return separate results per table
							returnData.push({
								json: {
									merged: false,
									tables: Object.keys(allResults),
									results: allResults
								},
								pairedItem: { item: i },
							});
						}
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}

export = { PocketBaseCustom };
