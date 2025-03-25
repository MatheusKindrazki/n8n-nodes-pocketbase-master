# PocketBase Node - AI Agent Guide

## 🤖 Integration Overview

This node provides AI agents with the ability to interact with PocketBase databases through n8n workflows. PocketBase is a lightweight backend solution that handles database operations, authentication, and file storage.

## Available Operations

AI agents can use the following operations:

| Operation | Description | Use Case |
|-----------|-------------|----------|
| Create | Add new records to collections | Creating users, products, or any database record |
| Create with Files | Add new records with file uploads | Creating records that contain documents, images, or other files |
| Get | Retrieve a single record by ID | Looking up specific information |
| Get Many | Query multiple records with filters | Searching for records matching criteria |
| Update | Modify existing records | Updating statuses, information or properties |
| Update with Files | Modify existing records with file uploads | Updating records while adding or replacing document files, images, etc. |
| Delete | Remove records | Cleaning up or removing unwanted data |
| Multi-Table Query | Query across multiple tables at once | Comprehensive data retrieval across related collections |

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

### 4. Working with File Uploads

The node supports file uploads using two special operations:

#### Create with Files
Use this when you need to create a new record that includes file attachments:

```javascript
// Example: Creating a product with image
{
  "resource": "record",
  "operation": "createWithFiles",
  "collection": "products",
  "fieldsData": {
    "field": [
      {
        "fieldName": "name",
        "fieldValue": "Product Name"
      },
      {
        "fieldName": "price",
        "fieldValue": "99.99"
      }
    ]
  },
  "binaryPropertyName": "data",
  "fileFieldNames": "image"
}
```

#### Update with Files
Use this when you need to update an existing record with new files:

```javascript
// Example: Updating a document with a new file version
{
  "resource": "record",
  "operation": "updateWithFiles",
  "collection": "documents",
  "recordId": "RECORD_ID",
  "fieldsData": {
    "field": [
      {
        "fieldName": "title",
        "fieldValue": "Updated Document"
      }
    ]
  },
  "binaryPropertyName": "data",
  "fileFieldNames": "attachment",
  "appendFiles": true  // Set to true to add files alongside existing ones
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

4. **File Upload Errors**:
   ```
   "error": "Failed to upload file: The maximum allowed file size is X MB"
   ```
   ↪ Suggest optimizing file size or using a different approach

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

For file upload operations, use the fieldsData structure instead of data:

```javascript
// Good example - fieldsData for structured form fields
"fieldsData": {
  "field": [
    {
      "fieldName": "title",
      "fieldValue": "Document Title"
    }
  ]
}
```

## Response Processing Tips

Responses will match PocketBase's API format:

1. Single record operations return the record object
2. List operations return a pagination object with `items` array
3. Multi-table operations return either merged results or a nested object
4. File upload operations will include file information in the response

---

*This document is designed for AI agents to better understand and utilize the PocketBase node in n8n workflows.* 
