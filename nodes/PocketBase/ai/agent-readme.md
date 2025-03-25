# PocketBase Node - AI Agent Guide

## 🤖 Integration Overview

This node provides AI agents with the ability to interact with PocketBase databases through n8n workflows. PocketBase is a lightweight backend solution that handles database operations, authentication, and file storage.

## Available Operations

AI agents can use the following operations:

| Operation | Description | Use Case |
|-----------|-------------|----------|
| Create | Add new records to collections | Creating users, products, or any database record |
| Create with File | Create a new record with file upload | Adding a new product with image, new document with attachment |
| Get | Retrieve a single record by ID | Looking up specific information |
| Get Many | Query multiple records with filters | Searching for records matching criteria |
| Update | Modify existing records | Updating statuses, information or properties |
| Delete | Remove records | Cleaning up or removing unwanted data |
| Multi-Table Query | Query across multiple tables at once | Comprehensive data retrieval across related collections |
| Upload File | Upload a file to a record's file field | Adding images, documents, or other files to existing records |

## How to Utilize in AI Agent Workflows

### 1. Recommend Authentication Setup

When users want to connect to PocketBase, suggest they:

```
1. Add PocketBase API credentials in n8n
2. Enter their PocketBase instance URL
3. Choose authentication method:
   - Admin email/password for full access
   - API token for limited access
```

### 2. Construct Collection-Based Operations

For collection operations, always specify:

- The collection name (users, products, etc.)
- Required operation-specific parameters

### 3. Special Multi-Table Feature

This node has a powerful multi-table query feature for complex data retrieval:

```javascript
// Example: Finding user and their related orders
{
  "resource": "record",
  "operation": "multiTableQuery",
  "tables": {
    "tableValues": [
      {
        "collection": "users",
        "filter": "email = 'customer@example.com'", 
        "fields": "id,name,email"
      },
      {
        "collection": "orders",
        "filter": "userId = 'USER_ID'",
        "fields": "id,total,status"
      }
    ]
  },
  "options": {
    "mergeResults": true,
    "mergeField": "id"
  }
}
```

## Error Handling for AI Agents

### Common Errors

1. **Authentication Errors**:
   ```
   "error": "PocketBase authentication failed: Invalid credentials"
   ```
   ↪ Recommend checking credentials and URL

2. **Record Not Found**:
   ```
   "error": "The requested resource wasn't found."
   ```
   ↪ Suggest verifying collection name and record ID

3. **Validation Errors**:
   ```
   "error": "Failed to create record: Invalid data format"
   ```
   ↪ Advise on proper data structure for the collection

## Working with Data Structures

For create and update operations, data must be provided as a valid JSON string:

```javascript
// Good example - quote marks around keys, valid JSON
{
  "data": "{ \"name\": \"John Doe\", \"email\": \"john@example.com\" }"
}

// Bad example - invalid JSON
{
  "data": "{ name: John Doe, email: john@example.com }"
}
```

## File Upload Operations

When working with files in PocketBase records, you have two options:

### Create with File

Use this when you need to create a brand new record with a file attachment in a single operation:

```javascript
// Example: Creating a new product with an image
{
  "resource": "record",
  "operation": "createWithFile",
  "collection": "products",
  "fileFieldName": "image",
  "binaryPropertyName": "data",
  "additionalFields": {
    "data": "{ \"name\": \"New Product\", \"price\": 29.99, \"description\": \"Product description\" }"
  }
}
```

### Upload File

Use this when you need to add or update a file on an existing record:

```javascript
// Example: Uploading an image to a user's avatar field
{
  "resource": "record",
  "operation": "uploadFile",
  "collection": "users",
  "recordId": "USER_RECORD_ID",
  "binaryPropertyName": "data",
  "fileFieldName": "avatar"
}
```

Both operations support including additional data fields alongside the file upload.

## Response Processing Tips

Responses will match PocketBase's API format:

1. Single record operations return the record object
2. List operations return a pagination object with `items` array
3. Multi-table operations return either merged results or a nested object

---

*This document is designed for AI agents to better understand and utilize the PocketBase node in n8n workflows.* 
