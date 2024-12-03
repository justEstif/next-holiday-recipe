/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gm88480h61lfhyl")

  collection.createRule = "@request.auth.id = author"
  collection.updateRule = "@request.auth.id = author && \n(@request.data.author:isset = false || @request.auth.id = @request.data.author)"
  collection.deleteRule = "@request.auth.id = author"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gm88480h61lfhyl")

  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
