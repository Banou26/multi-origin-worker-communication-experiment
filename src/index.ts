
if (location.origin === 'http://localhost:8080') {
  import('./parent')
} else {
  import('./child')
}
