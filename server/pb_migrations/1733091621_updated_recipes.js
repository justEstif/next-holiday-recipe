/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gm88480h61lfhyl")

  // remove
  collection.schema.removeField("oquhckt2")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qrqkiaoq",
    "name": "steps",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gm88480h61lfhyl")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "oquhckt2",
    "name": "steps",
    "type": "editor",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "convertUrls": false
    }
  }))

  // remove
  collection.schema.removeField("qrqkiaoq")

  return dao.saveCollection(collection)
})
