// docker/mongodb/init-mongo.js
db = db.getSiblingDB('growtracker');

// Create application user
db.createUser({
  user: 'growtracker_user',
  pwd: 'growtracker_password',
  roles: [
    {
      role: 'readWrite',
      db: 'growtracker',
    },
  ],
});

// Create collections with validators
db.createCollection('plants', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'strain', 'status', 'growCycleType', 'startDate', 'createdAt', 'updatedAt'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'Name of the plant, required'
        },
        strain: {
          bsonType: 'string',
          description: 'Strain of the plant, required'
        },
        status: {
          enum: ['Growing', 'Harvested', 'Archived'],
          description: 'Current status of the plant, required'
        },
        growCycleType: {
          enum: ['Vegetative', 'Flowering'],
          description: 'Current grow cycle type, required'
        },
        startDate: {
          bsonType: 'date',
          description: 'Date when the plant was started, required'
        },
        harvestDate: {
          bsonType: 'date',
          description: 'Date when the plant was harvested, if applicable'
        },
        notes: {
          bsonType: 'string',
          description: 'Additional notes about the plant'
        },
        growthMetrics: {
          bsonType: 'array',
          description: 'Array of growth measurements',
          items: {
            bsonType: 'object',
            required: ['date', 'height'],
            properties: {
              date: {
                bsonType: 'date',
                description: 'Date of measurement'
              },
              height: {
                bsonType: 'number',
                description: 'Plant height in centimeters'
              },
              notes: {
                bsonType: 'string',
                description: 'Notes about this growth measurement'
              }
            }
          }
        },
        coverImageId: {
          bsonType: 'string',
          description: 'ID of the cover image'
        },
        createdAt: {
          bsonType: 'date',
          description: 'Date when the record was created, required'
        },
        updatedAt: {
          bsonType: 'date',
          description: 'Date when the record was last updated, required'
        }
      }
    }
  }
});

db.createCollection('actions', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['plantId', 'actionType', 'date', 'createdAt', 'updatedAt'],
      properties: {
        plantId: {
          bsonType: 'objectId',
          description: 'Reference to the plant, required'
        },
        actionType: {
          enum: ['Watering', 'Feeding', 'Pruning', 'Training', 'Transplanting', 'Other'],
          description: 'Type of action performed, required'
        },
        date: {
          bsonType: 'date',
          description: 'Date when the action was performed, required'
        },
        details: {
          bsonType: 'object',
          description: 'Additional details about the action'
        },
        notes: {
          bsonType: 'string',
          description: 'Notes about the action'
        },
        imageIds: {
          bsonType: 'array',
          description: 'Array of image IDs associated with this action',
          items: {
            bsonType: 'string'
          }
        },
        createdAt: {
          bsonType: 'date',
          description: 'Date when the record was created, required'
        },
        updatedAt: {
          bsonType: 'date',
          description: 'Date when the record was last updated, required'
        }
      }
    }
  }
});

db.createCollection('images', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['s3Key', 'filename', 'contentType', 'size', 'entityType', 'entityId', 'uploadDate'],
      properties: {
        s3Key: {
          bsonType: 'string',
          description: 'Storage key for the image, required'
        },
        filename: {
          bsonType: 'string',
          description: 'Original filename, required'
        },
        contentType: {
          bsonType: 'string',
          description: 'MIME type of the image, required'
        },
        size: {
          bsonType: 'number',
          description: 'Size of the image in bytes, required'
        },
        entityType: {
          enum: ['Plant', 'Action'],
          description: 'Type of entity this image is associated with, required'
        },
        entityId: {
          bsonType: 'objectId',
          description: 'ID of the associated entity, required'
        },
        uploadDate: {
          bsonType: 'date',
          description: 'Date when the image was uploaded, required'
        }
      }
    }
  }
});

// Create indexes
db.plants.createIndex({ name: 1 }, { unique: true });
db.plants.createIndex({ status: 1 });
db.plants.createIndex({ growCycleType: 1 });
db.plants.createIndex({ createdAt: -1 });

db.actions.createIndex({ plantId: 1 });
db.actions.createIndex({ actionType: 1 });
db.actions.createIndex({ date: -1 });

db.images.createIndex({ entityType: 1, entityId: 1 });
db.images.createIndex({ s3Key: 1 }, { unique: true });