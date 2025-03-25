// PocketBase node codex definition for AI agents

export const versionDescription = {
  pocketBase: {
    displayName: 'PocketBase',
    name: 'pocketBase',
    icon: 'file:pocketbase.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Work with PocketBase records',
    defaults: {
      name: 'PocketBase',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'pocketBaseApi',
        required: true,
      },
    ],
    requestDefaults: {
      returnFullResponse: false,
      baseURL: '={{ $credentials.url }}',
    },
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
            name: 'Create with File',
            value: 'createWithFile',
            description: 'Create a new record with file upload',
            action: 'Create a new record with file upload',
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
            name: 'Upload File',
            value: 'uploadFile',
            description: 'Upload a file to a record',
            action: 'Upload a file to a record',
          },
        ],
        default: 'get',
      },
    ],
  },
};

// This represents the node's functionality
export const functional = {
  versionsSupported: [1],
  create: {
    operation: {
      resource: 'record',
      operation: 'create',
      description: 'Create a new record in a PocketBase collection',
      parameters: {
        collection: {
          type: 'string',
          required: true,
          description: 'The name of the PocketBase collection',
        },
        data: {
          type: 'json',
          required: true,
          description: 'Record data to send as JSON',
        },
      },
      returns: {
        type: 'record',
        description: 'The created record',
      },
    },
  },
  delete: {
    operation: {
      resource: 'record',
      operation: 'delete',
      description: 'Delete a record from a PocketBase collection',
      parameters: {
        collection: {
          type: 'string',
          required: true,
          description: 'The name of the PocketBase collection',
        },
        recordId: {
          type: 'string',
          required: true,
          description: 'ID of the record to delete',
        },
      },
      returns: {
        type: 'object',
        description: 'Success response with the deleted record ID',
        properties: {
          success: { type: 'boolean' },
          id: { type: 'string' },
        },
      },
    },
  },
  get: {
    operation: {
      resource: 'record',
      operation: 'get',
      description: 'Get a single record from a PocketBase collection',
      parameters: {
        collection: {
          type: 'string',
          required: true,
          description: 'The name of the PocketBase collection',
        },
        recordId: {
          type: 'string',
          required: true,
          description: 'ID of the record to retrieve',
        },
      },
      returns: {
        type: 'record',
        description: 'The retrieved record',
      },
    },
  },
  getMany: {
    operation: {
      resource: 'record',
      operation: 'getMany',
      description: 'Get multiple records from a PocketBase collection',
      parameters: {
        collection: {
          type: 'string',
          required: true,
          description: 'The name of the PocketBase collection',
        },
        returnAll: {
          type: 'boolean',
          required: false,
          default: false,
          description: 'Whether to return all results or only up to a given limit',
        },
        limit: {
          type: 'number',
          required: false,
          default: 50,
          description: 'Max number of results to return',
        },
        filter: {
          type: 'string',
          required: false,
          description: 'Filter the results using PocketBase filter syntax',
        },
        sort: {
          type: 'string',
          required: false,
          description: 'Specify the sorting using PocketBase sort syntax',
        },
      },
      returns: {
        type: 'object',
        description: 'List of records with pagination information',
        properties: {
          total: { type: 'number' },
          page: { type: 'number' },
          perPage: { type: 'number' },
          totalPages: { type: 'number' },
          items: { type: 'array', items: { type: 'record' } },
        },
      },
    },
  },
  multiTableQuery: {
    operation: {
      resource: 'record',
      operation: 'multiTableQuery',
      description: 'Query records across multiple PocketBase tables',
      parameters: {
        tables: {
          type: 'collection',
          required: true,
          description: 'Tables to query',
          properties: {
            collection: {
              type: 'string',
              required: true,
              description: 'Name of the collection/table',
            },
            filter: {
              type: 'string',
              required: false,
              description: 'Filter criteria for this table',
            },
            fields: {
              type: 'string',
              required: false,
              description: 'Comma-separated list of fields to return',
            },
            limit: {
              type: 'number',
              required: false,
              default: 50,
              description: 'Max number of results to return',
            },
          },
        },
        options: {
          type: 'object',
          required: false,
          description: 'Additional options for multi-table query',
          properties: {
            mergeResults: {
              type: 'boolean',
              description: 'Whether to merge results based on a common field',
            },
            mergeField: {
              type: 'string',
              description: 'Field to use for merging results',
            },
            removeDuplicates: {
              type: 'boolean',
              description: 'Whether to remove duplicate entries when merging',
            },
          },
        },
      },
      returns: {
        type: 'object',
        description: 'Combined results from multiple tables',
        properties: {
          merged: { type: 'boolean' },
          results: { type: 'object' },
        },
      },
    },
  },
  update: {
    operation: {
      resource: 'record',
      operation: 'update',
      description: 'Update a record in a PocketBase collection',
      parameters: {
        collection: {
          type: 'string',
          required: true,
          description: 'The name of the PocketBase collection',
        },
        recordId: {
          type: 'string',
          required: true,
          description: 'ID of the record to update',
        },
        data: {
          type: 'json',
          required: true,
          description: 'Record data to update as JSON',
        },
      },
      returns: {
        type: 'record',
        description: 'The updated record',
      },
    },
  },
  uploadFile: {
    operation: {
      resource: 'record',
      operation: 'uploadFile',
      description: 'Upload a file to a PocketBase record',
      parameters: {
        collection: {
          type: 'string',
          required: true,
          description: 'The name of the PocketBase collection',
        },
        recordId: {
          type: 'string',
          required: true,
          description: 'ID of the record to update with the file',
        },
        binaryPropertyName: {
          type: 'string',
          required: true,
          default: 'data',
          description: 'Name of the binary property containing the file data',
        },
        fileFieldName: {
          type: 'string',
          required: true,
          description: 'Name of the field in the PocketBase collection that will store the file',
        },
      },
      returns: {
        type: 'record',
        description: 'The updated record with the file field',
      },
    },
  },
  createWithFile: {
    operation: {
      resource: 'record',
      operation: 'createWithFile',
      description: 'Create a new record with file upload',
      parameters: {
        collection: {
          type: 'string',
          required: true,
          description: 'The name of the PocketBase collection',
        },
        binaryPropertyName: {
          type: 'string',
          required: true,
          default: 'data',
          description: 'Name of the binary property containing the file data',
        },
        fileFieldName: {
          type: 'string',
          required: true,
          description: 'Name of the field in the PocketBase collection that will store the file',
        },
      },
      returns: {
        type: 'record',
        description: 'The newly created record with the file field',
      },
    },
  },
};

// Examples of how to use the node
export const examples = [
  {
    name: 'Create a new user record',
    input: {
      resource: 'record',
      operation: 'create',
      collection: 'users',
      data: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        isActive: true,
      }),
    },
    output: {
      json: {
        id: 'abc123',
        name: 'John Doe',
        email: 'john@example.com',
        isActive: true,
        created: '2023-01-01T00:00:00.000Z',
        updated: '2023-01-01T00:00:00.000Z',
      },
    },
  },
  {
    name: 'Get users with filter',
    input: {
      resource: 'record',
      operation: 'getMany',
      collection: 'users',
      returnAll: false,
      limit: 10,
      filter: 'isActive = true',
      sort: '-created',
    },
    output: {
      json: {
        total: 42,
        page: 1,
        perPage: 10,
        totalPages: 5,
        items: [
          {
            id: 'abc123',
            name: 'John Doe',
            email: 'john@example.com',
            isActive: true,
            created: '2023-01-01T00:00:00.000Z',
            updated: '2023-01-01T00:00:00.000Z',
          },
          // Additional items...
        ],
      },
    },
  },
  {
    name: 'Multi-table query for user data',
    input: {
      resource: 'record',
      operation: 'multiTableQuery',
      tables: {
        tableValues: [
          {
            collection: 'users',
            filter: 'email = "john@example.com"',
            fields: 'id,name,email',
            limit: 50,
          },
          {
            collection: 'orders',
            filter: 'userId = "abc123"',
            fields: 'id,total,status',
            limit: 50,
          },
        ],
      },
      options: {
        mergeResults: true,
        mergeField: 'id',
        removeDuplicates: true,
      },
    },
    output: {
      json: {
        merged: true,
        mergeField: 'id',
        count: 2,
        results: [
          {
            id: 'abc123',
            name: 'John Doe',
            email: 'john@example.com',
            sourceTables: ['users'],
          },
          {
            id: 'xyz789',
            total: 99.99,
            status: 'completed',
            sourceTables: ['orders'],
          },
        ],
      },
    },
  },
];
