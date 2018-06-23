'use strict'

const Env = use('Env')

const Bookmarks = use('App/Models/Bookmark')
const { validateAll } = use('Validator')

const Twitch = require("twitch.tv-api")
const twitch = new Twitch({ id: Env.getOrFail('TWITCHID'), secret: Env.getOrFail('TWITCHSECRET') })
const twitch_url = 'https://www.twitch.tv/'

class BookmarkController {

  async addBookmark ({ response, auth, request }) {
    const user = await auth.getUser()
    const data = request.only(['twitch_link', 'twitch_icon', 'twitch_name'])

    const validation = await validateAll(data, {
      twitch_link: 'required',
      twitch_icon: 'required',
      twitch_name: 'required'
    })

    if (validation.fails()) {
      return response.status(503).json({
        errors: validation.messages()
      })
    }

    data.user = user.id

    const bookmark = await Bookmarks.create(data)

    return response.status(200).json({
      bookmark
    })

  }

  async removeBookmark ({ response, auth, params }) {
    const user = await auth.getUser()
    const { id } = params

    const bookmark = await Bookmarks.find(id)

    if(bookmark === null){
      return response.status(503).json({
        data: 'Error detected'
      })
    }

    if(user.$attributes.id === bookmark.$attributes.user){
      await bookmark.delete()
      return response.status(200).json({
        data: 'Bookmark deleted'
      })
    }else{
      return response.status(503).json({
        data: 'Error detected'
      })
    }

  }

  async getBookmarks ({ response, auth }) {

    const user = await auth.getUser()
    const bookmarks = await Bookmarks.query().where('user', user.id).fetch()

    const data = bookmarks.rows.map( async (row) => {
      const name = row.$attributes.twitch_name.replace(twitch_url, '')
      return {
        stream: row.$attributes, online: await this.isStreamLive(name)
      }
    })

    const lives = await Promise.all(data)
    return response.status(200).json({
      lives
    })

  }

  async isStreamLive(name) {
    const { stream } = await twitch.getUser(name)

    if(stream === null){
      return false
    }else{
      console.log(stream)

      return {
        online: true,
        game: stream.game,
        status: stream.channel.status,
        viewers: stream.viewers }
    }

  }

}

module.exports = BookmarkController
