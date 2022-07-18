/*
 * Connect to the clean database and add a service account
 */
let db = connect("127.0.0.1:27017/admin");
db.createUser({
  user: "inventoryAssetDB",
  pwd: "changeme",
  roles: [{ role: "readWriteAnyDatabase", db: "admin" }],
});

/*
 * Add a user admin account
 */
db.createUser({
  user: "admin",
  pwd: passwordPrompt(),
  roles: [
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" },
  ],
});

/*
 * Connect to the inventoryAssetDB database to create it
 */
db = db.getSiblingDB("inventoryAssetDB");

/*
 * Create the schema validators for the collections
 */
const assetValidator = {
  $jsonSchema: {
    bsonType: "object",
    additionalProperties: false,
    title: "asset",
    required: ["assetno", "name", "vendor", "count", "location", "category"],
    properties: {
      _id: {
        bsonType: "objectId",
        description: "Automatically generated ObjectId.",
      },
      name: {
        bsonType: "string",
        minLength: 1,
        maxLength: 255,
        description: "Must be a string, between 5 and 255 characters required.",
      },
      assetno: {
        bsonType: "string",
        minLength: 1,
        maxLength: 255,
        description: "Must be a string, between 5 and 255 characters required.",
      },
      vendor: {
        bsonType: "string",
        minLength: 1,
        maxLength: 255,
        description: "Must be a string, between 5 and 255 characters required.",
      },
      count: {
        bsonType: "number",
        minimum: 0,
        description: "Must be a number, required.",
      },
      location: {
        bsonType: "string",
        minLength: 1,
        maxLength: 255,
        description:
          "Ex: Charlotte office. Must be a string between 5 and 255 characters, required.",
      },
      sublocation: {
        bsonType: ["string", "null"],
        maxLength: 255,
        description:
          "Ex: building 3, rack 2, U 5. Must be a string up to 255 characters",
      },
      description: {
        bsonType: ["string", "null"],
        maxLength: 255,
        description:
          "Ex: blue case, 30 inch depth. Must be a string up to 255 characters.",
      },
      serialno: {
        bsonType: ["string", "null"],
        maxLength: 255,
        description: "Must be a string up to 255 characters.",
      },
      category: {
        bsonType: "string",
        maxLength: 255,
        description:
          "Ex: Storage Drives. Must be a string up to 255 characters, required.",
      },
      subcategory: {
        bsonType: ["string", "null"],
        maxLength: 255,
        description: "Ex: SSD Drives. Must be a string up to 255 characters.",
      },
      notes: {
        bsonType: ["string", "null"],
        maxLength: 255,
        description:
          "Ex: Has a Sailor Moon sticker on the chassis. Must be a string up to 255 characters.",
      },
    },
  },
};

const userValidator = {
  $jsonSchema: {
    bsonType: "object",
    additionalProperties: false,
    title: "user",
    required: [
      "firstName",
      "lastName",
      "username",
      "passwordHash",
      "permissions",
    ],
    properties: {
      _id: {
        bsonType: "objectId",
        description: "Automatically generated ObjectId",
      },
      firstName: {
        bsonType: "string",
        minLength: 1,
        maxLength: 35,
        description: "Must be a string between 1 and 35 characters, required.",
      },
      lastName: {
        bsonType: "string",
        minLength: 1,
        maxLength: 35,
        description: "Must be a string between 1 and 35 characters, required.",
      },
      username: {
        bsonType: "string",
        minLength: 1,
        maxLength: 70,
        description: "Must be a string between 1 and 70 characters, required.",
      },
      passwordHash: {
        bsonType: "string",
        minLength: 12,
        maxLength: 255,
        description:
          "Must be a string between 12 and 255 characters, required.",
      },
      permissions: {
        bsonType: "object",
        required: ["admin", "create", "read", "updated", "delete"],
        additionalProperties: false,
        properties: {
          admin: {
            bsonType: "bool",
            description: "Allows management of user accounts.",
          },
          create: {
            bsonType: "bool",
            description: "Allows creation of new assets.",
          },
          read: {
            bsonType: "bool",
            description: "Allows reading of existing assets.",
          },
          update: {
            bsonType: "bool",
            description: "Allows updating existing assets.",
          },
          delete: {
            bsonType: "bool",
            description: "Allows deleting existing assets.",
          },
        },
      },
    },
  },
};

/*
 * Create the collections
 */
db.createCollection("assets", { validator: assetValidator });
db.createCollection("users", { validator: userValidator });
