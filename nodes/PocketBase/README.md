# PocketBase Node for n8n

This node allows AI agents and workflow automation to interact with PocketBase databases through n8n workflows.

## 🤖 For AI Agents

AI agents can use this node to perform CRUD operations on PocketBase databases.

### Capabilities

- **Create Records**: Add new records to any PocketBase collection
- **Create with File**: Create new records with file attachments in a single operation
- **Read Records**: Retrieve single records by ID or query multiple records with filtering
- **Update Records**: Modify existing records in any collection
- **Delete Records**: Remove records from collections
- **Multi-Table Query**: Query across multiple tables/collections in a single operation
- **Upload Files**: Attach files to existing records in collections with file fields

### Examples for AI Use

```javascript
// Example 1: Creating a new user
{
  "resource": "record",
  "operation": "create",
  "collection": "users",
  "data": {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "isActive": true
  }
}

// Example 2: Looking up a user by email
{
  "resource": "record",
  "operation": "getMany",
  "collection": "users",
  "filter": "email = 'jane@example.com'"
}

// Example 3: Cross-table search for user and order data
{
  "resource": "record",
  "operation": "multiTableQuery",
  "tables": {
    "tableValues": [
      {
        "collection": "users",
        "filter": "email = 'jane@example.com'",
        "fields": "id,name,email"
      },
      {
        "collection": "orders",
        "filter": "userId = '$FOUND_USER_ID'",
        "fields": "id,total,status"
      }
    ]
  },
  "options": {
    "mergeResults": true,
    "mergeField": "id"
  }
}

// Example 4: Upload a profile picture to a user record
{
  "resource": "record",
  "operation": "uploadFile",
  "collection": "users",
  "recordId": "RECORD_ID",
  "fileFieldName": "avatar",
  "binaryPropertyName": "data"
}

// Example 5: Create a new product with image in one step
{
  "resource": "record",
  "operation": "createWithFile",
  "collection": "products",
  "fileFieldName": "image",
  "binaryPropertyName": "data",
  "additionalFields": {
    "data": "{ \"name\": \"New Product\", \"price\": 29.99 }"
  }
}
```

## Schema for AI Agents

```typescript
// PocketBase Node Schema
{
  // Always 'record' for current version
  "resource": "record",
  
  // One of: 'create', 'createWithFile', 'delete', 'get', 'getMany', 'multiTableQuery', 'update', 'uploadFile'
  "operation": string,
  
  // For all operations except multiTableQuery
  "collection": string,
  
  // For create and update operations
  "data": object,
  
  // For get, delete, update, uploadFile operations
  "recordId": string,
  
  // For getMany operation
  "returnAll": boolean,
  "limit": number,
  "filter": string,
  "sort": string,
  
  // For multiTableQuery operation
  "tables": {
    "tableValues": [
      {
        "collection": string,
        "filter": string,
        "fields": string,
        "limit": number
      }
    ]
  },
  "options": {
    "mergeResults": boolean,
    "mergeField": string,
    "removeDuplicates": boolean
  },
  
  // For uploadFile and createWithFile operations
  "fileFieldName": string,
  "binaryPropertyName": string,
  
  // For createWithFile operation
  "additionalFields": {
    "data": string // JSON string of additional fields
  }
}
```

## Response Format

Responses will be in the standard n8n format, with the `json` property containing the PocketBase response data:

```json
{
  "json": {
    // PocketBase response data here
  }
}
```

## Authentication for AI Agents

When using this node, AI agents should instruct users to set up proper authentication using the PocketBase API credentials. The credentials include:

- URL of the PocketBase instance
- Authentication method (email/password or API token)

## Error Handling

Error messages are returned in standard n8n format and include detailed information from PocketBase about what went wrong:

```json
{
  "error": "PocketBase authentication failed: Invalid credentials"
}
```

AI agents should check for error responses and provide helpful troubleshooting advice to users. 
