'use strict'

const Schema = use('Schema')

/**
  * user => id not null
  * twitch_link => string not null
  * twitch_icon => string not null
  * twitch_name => string not null
  */

class BookmarksSchema extends Schema {
  up () {
    this.create('bookmarks', (table) => {
      table.increments()

      table.integer('user', 255).notNullable()
      table.string('twitch_link', 255).notNullable()
      table.string('twitch_icon', 255).notNullable()
      table.string('twitch_name', 255).notNullable()

      table.timestamps()
    })
  }

  down () {
    this.drop('bookmarks')
  }
}

module.exports = BookmarksSchema
