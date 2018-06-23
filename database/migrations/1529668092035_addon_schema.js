'use strict'

const Schema = use('Schema')

class AddonSchema extends Schema {
  up () {
    this.create('addons', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('addons')
  }
}

module.exports = AddonSchema
