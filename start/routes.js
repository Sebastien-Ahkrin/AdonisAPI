'use strict'

const Route = use('Route')
const link = 'api/v1/addon'

/* Auth Api */
Route.group(() => {

  Route.post('/login', 'UserController.login')
  Route.post('/register', 'UserController.register')

}).prefix(link + '/auth').formats(['json'])

/* Bookmarks Api */
Route.group(() => {

  Route.get('/', 'BookmarkController.getBookmarks').middleware(['auth'])
  Route.put('/add', 'BookmarkController.addBookmark').middleware(['auth'])
  Route.delete('/delete/:id', 'BookmarkController.removeBookmark').middleware(['auth'])

}).prefix(link + '/bookmarks').formats(['json'])

