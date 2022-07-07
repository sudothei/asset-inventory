// TODO create database and with auth for app

db.createCollection("assets", { validator: assetValidator });
db.createCollection("users", { validator: userValidator });

// TODO create userValidator
// TODO double check assetValidator when less tired

const assetValidator = {
  $jsonSchema: {
    bsonType: "object",
    additionalProperties: false,
    title: "part",
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

db.users.insert({
  username: "admin",
  password: "admin",
  permissions: {
    admin: true,
    create: true,
    read: true,
    update: true,
    delete: true,
  },
});
