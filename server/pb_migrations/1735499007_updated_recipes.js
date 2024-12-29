/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gm88480h61lfhyl")

  collection.viewRule = null

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gm88480h61lfhyl")

  collection.viewRule = "(@request.auth.id != author && published = true) || @request.auth.id = author"

  return dao.saveCollection(collection)
})
