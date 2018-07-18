function cerrar() {
  firebase.auth().signOut()
    .then(function () {
      return location.href = location.href.replace(/views\/home.html/g, 'index.html');
    })
    .catch(function (error) {
      console.log(eror)
    })
};
