const db = connect("127.0.0.1:27017/inventoryAssetDB");
// TODO create database and with auth for app

db.createCollection("assets", { validator: assetValidator });
db.createCollection("users", { validator: userValidator });

// TODO add validation rules to properties
const assetValidator = {
  $jsonSchema: {
    bsonType: "object",
    additionalProperties: false,
    title: "asset",
    required: ["partno", "name", "vendor", "count", "location", "category"],
    properties: {
      _id: { bsonType: "objectId" },
      name: { bsonType: "string" },
      partno: { bsonType: "string" },
      vendor: { bsonType: "string" },
      count: { bsonType: "number" },
      location: { bsonType: "string" },
      sublocation: { bsonType: "string" },
      description: { bsonType: "string" },
      serialno: { bsonType: "string" },
      category: { bsonType: "string" },
      subcategory: { bsonType: "string" },
      notes: { bsonType: "string" },
    },
  },
};

// TODO add validation rules to properties
const userValidator = {
  $jsonSchema: {
    bsonType: "object",
    additionalProperties: false,
    title: "user",
    properties: {
      _id: { bsonType: "objectId" },
      username: { bsonType: "string" },
      password_hash: { bsonType: "string" },
      permissions: {
        bsonType: "object",
        properties: {
          admin: { bsonType: "boolean" },
          create: { bsonType: "boolean" },
          read: { bsonType: "boolean" },
          update: { bsonType: "boolean" },
          delete: { bsonType: "boolean" },
        },
      },
    },
  },
};

db.users.insert({
  username: "admin",
  password_hash: "$2b$14$jC97DWBMU5xdQoqFpRHhM.kcCIKnUtniZKkTplJwnW6OhV0g/8DIm",
  permissions: {
    admin: true,
    create: true,
    read: true,
    update: true,
    delete: true,
  },
});
