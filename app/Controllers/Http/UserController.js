'use strict'

const User = use('App/Models/User')
const { validateAll } = use('Validator')

class UserController {

  async register ({ response, request, auth }) {

    const data = request.only(['username', 'email', 'password', 'password_confirmation'])

    const validation = await validateAll(data, {
      username: 'required|unique:users',
      email: 'required|email|unique:users',
      password: 'required',
      password_confirmation: 'required_if:password|same:password'
    })

    if (validation.fails()) {
      return response.status(503).json({
        errors: validation.messages()
      })
    }

    delete data.password_confirmation

    const user = await User.create(data)
    const token = await auth.generate(user, true)

    return response.status(200).json({
      token
    })

  }

  async login ({ response, request, auth }) {

    const data = request.only(['email', 'password'])

    const validation = await validateAll(data, {
      email: 'required|email',
      password: 'required'
    })

    if (validation.fails()){
      return response.status(503).json({
        errors: validation.messages()
      })
    }

    const token = await auth.attempt(data.email, data.password, true)

    response.status(200).json({
      token
    })

  }

}

module.exports = UserController
