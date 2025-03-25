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
  createWithFiles: {
    operation: {
      resource: 'record',
      operation: 'createWithFiles',
      description: 'Create a new record with file uploads in a PocketBase collection',
      parameters: {
        collection: {
          type: 'string',
          required: true,
          description: 'The name of the PocketBase collection',
        },
        fieldsData: {
          type: 'collection',
          required: false,
          description: 'Regular field data for the record',
          properties: {
            fieldName: {
              type: 'string',
              required: true,
              description: 'The name of the field',
            },
            fieldValue: {
              type: 'string',
              required: true,
              description: 'The value of the field',
            },
          },
        },
        binaryPropertyName: {
          type: 'string',
          required: true,
          default: 'data',
          description: 'Name of the binary property that contains files to upload',
        },
        fileFieldNames: {
          type: 'string',
          required: true,
          description: 'Comma-separated list of field names that will receive the uploaded files',
        },
      },
      returns: {
        type: 'record',
        description: 'The created record with file information',
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
  updateWithFiles: {
    operation: {
      resource: 'record',
      operation: 'updateWithFiles',
      description: 'Update a record with file uploads in a PocketBase collection',
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
        fieldsData: {
          type: 'collection',
          required: false,
          description: 'Regular field data for the record',
          properties: {
            fieldName: {
              type: 'string',
              required: true,
              description: 'The name of the field',
            },
            fieldValue: {
              type: 'string',
              required: true,
              description: 'The value of the field',
            },
          },
        },
        binaryPropertyName: {
          type: 'string',
          required: true,
          default: 'data',
          description: 'Name of the binary property that contains files to upload',
        },
        fileFieldNames: {
          type: 'string',
          required: true,
          description: 'Comma-separated list of field names that will receive the uploaded files',
        },
        appendFiles: {
          type: 'boolean',
          required: false,
          default: false,
          description: 'Whether to append files to existing ones instead of replacing them',
        },
      },
      returns: {
        type: 'record',
        description: 'The updated record with file information',
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
    name: 'Create a record with file upload',
    input: {
      resource: 'record',
      operation: 'createWithFiles',
      collection: 'documents',
      fieldsData: {
        field: [
          {
            fieldName: 'title',
            fieldValue: 'My Document',
          },
          {
            fieldName: 'description',
            fieldValue: 'This is a test document',
          },
        ],
      },
      binaryPropertyName: 'data',
      fileFieldNames: 'document',
    },
    output: {
      json: {
        id: 'doc123',
        title: 'My Document',
        description: 'This is a test document',
        document: 'document_a1b2c3.pdf',
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
    name: 'Update a record with file upload',
    input: {
      resource: 'record',
      operation: 'updateWithFiles',
      collection: 'documents',
      recordId: 'doc123',
      fieldsData: {
        field: [
          {
            fieldName: 'title',
            fieldValue: 'Updated Document',
          },
        ],
      },
      binaryPropertyName: 'data',
      fileFieldNames: 'document',
      appendFiles: true,
    },
    output: {
      json: {
        id: 'doc123',
        title: 'Updated Document',
        description: 'This is a test document',
        document: ['document_a1b2c3.pdf', 'document_d4e5f6.pdf'],
        created: '2023-01-01T00:00:00.000Z',
        updated: '2023-01-01T10:00:00.000Z',
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
