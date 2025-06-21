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
        bsonType: "string",
        maxLength: 255,
        description:
          "Ex: building 3, rack 2, U 5. Must be a string up to 255 characters",
      },
      description: {
        bsonType: "string",
        maxLength: 255,
        description:
          "Ex: blue case, 30 inch depth. Must be a string up to 255 characters.",
      },
      serialno: {
        bsonType: "string",
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
        bsonType: "string",
        maxLength: 255,
        description: "Ex: SSD Drives. Must be a string up to 255 characters.",
      },
      notes: {
        bsonType: "string",
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
    required: ["firstname", "lastname", "email", "status", "admin", "write"],
    properties: {
      _id: {
        bsonType: "objectId",
        description: "Automatically generated ObjectId",
      },
      firstname: {
        bsonType: "string",
        minLength: 1,
        maxLength: 35,
        description: "Must be a string between 1 and 35 characters, required.",
      },
      lastname: {
        bsonType: "string",
        minLength: 1,
        maxLength: 35,
        description: "Must be a string between 1 and 35 characters, required.",
      },
      email: {
        bsonType: "string",
        minLength: 5,
        maxLength: 70,
        description: "Must be a string between 5 and 70 characters, required.",
      },
      password_hash: {
        bsonType: "string",
        minLength: 12,
        maxLength: 255,
        description: "Must be a string between 12 and 255 characters.",
      },
      status: {
        bsonType: "string",
        enum: ["Pending", "Active"],
        description:
          "Must be Active or Pending, used for account creation process, required.",
      },
      security_token: {
        bsonType: "object",
        required: ["token", "expires"],
        additionalProperties: false,
        properties: {
          token: {
            bsonType: "string",
            minLength: 32,
            maxLength: 32,
            description:
              "A 32 char hex string for account creation and password reset emails.",
          },
          expires: {
            bsonType: "number",
            description:
              "A 13 digit Unix epoch timestamp for when the token is no longer valid.",
          },
        },
      },
      admin: {
        bsonType: "bool",
        description: "Allows management of user accounts.",
      },
      write: {
        bsonType: "bool",
        description: "Allows creation of new assets.",
      },
    },
  },
};

/*
 * Create the collections
 */
db.createCollection("assets", { validator: assetValidator });
db.createCollection("users", { validator: userValidator });
