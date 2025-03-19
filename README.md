![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

# n8n-nodes-pocketbase-master

This is an n8n community node for integrating with [PocketBase](https://pocketbase.io). It provides powerful operations to interact with your PocketBase collections.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Resources](#resources)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

This node provides operations to interact with PocketBase collections.

### Record

* **Create** - Create a new record in a collection
* **Delete** - Delete a record from a collection
* **Get** - Retrieve a single record by ID
* **Get Many** - Retrieve multiple records with filtering options
* **Multi-Table Query** - Query multiple collections at once with merging options
* **Update** - Update an existing record

## Features

### Multi-Table Query

The Multi-Table Query operation allows you to search for data across multiple collections (tables) in a single workflow step. This is particularly useful when you need to:

- Check if data exists in multiple collections
- Collect related data from different collections
- Merge results from multiple collections based on a common field

#### How to Use Multi-Table Query

1. Add tables to query by clicking on "Add Table"
2. For each table, specify:
   - Collection Name: The PocketBase collection to query
   - Filter: Optional filter criteria (using PocketBase filter syntax)
   - Fields: Optional comma-separated list of fields to return
   - Limit: Maximum number of records to return per collection
   
3. Options:
   - Merge Results: Combine results from different tables
   - Merge Field: The field to use for merging (typically an ID or unique identifier)
   - Remove Duplicates: Remove duplicate entries when merging results

## Credentials

To use the PocketBase node, you need to provide your PocketBase credentials:

- **URL**: The URL of your PocketBase instance (e.g., https://your-pocketbase.com)
- **Email** (optional): Admin email for authentication
- **Password** (optional): Admin password for authentication
- **API Token** (optional): Admin API token (alternatively to email/password)

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [PocketBase documentation](https://pocketbase.io/docs/)
* [PocketBase JS SDK](https://github.com/pocketbase/js-sdk)

## License

MIT
