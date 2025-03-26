/**
 * Integration for PocketBase with n8n
 *
 * This module is designed to be AI-agent friendly and provides comprehensive
 * integration with PocketBase databases through n8n workflows.
 */

'use strict';

// Main module export
module.exports = require('./dist/nodes/PocketBase/PocketBaseCustom.node');

// AI metadata exports
module.exports.aiMetadata = {
  name: 'PocketBase Custom',
  description: 'Work with PocketBase records through a user-friendly interface',
  version: '0.1.1',
  capabilities: [
    'create-record',
    'read-record',
    'update-record',
    'delete-record',
    'query-records',
    'multi-table-query'
  ],
  documentationUrl: 'https://github.com/matheuskindrazki/n8n-nodes-pocketbase-master/blob/main/nodes/PocketBase/README.md'
};
