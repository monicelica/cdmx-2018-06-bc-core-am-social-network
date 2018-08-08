const registrar = () => {
  let email = document.getElementById('email').value;
  let password = document.getElementById('password').value;
  // si el usuario se regsitro de manera correcta se ejecutara la funcion verificar
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(() => verificar())
    .catch((error) => {
      // Handle Errors here.
      let errorCode = error.code;
      let errorMessage = error.message;
      alert(errorCode);
      console.log(errorMessage);
      // ...
    });
};

const loginGoogle = () => {
  let provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    let token = result.credential.accessToken;
    // The signed-in user info.
    let user = result.user;
    console.log(result);
    // ...
  }).catch((error) => {
    // Handle Errors here.
    let errorCode = error.code;
    let errorMessage = error.message;
    // The email of the user's account used.
    let email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    let credential = error.credential;
    // ...
  });
};

const loginFace = () => {
  let provider = new firebase.auth.FacebookAuthProvider();
  firebase.auth().signInWithPopup(provider).then((result) => {
    provider.addScope('public_profile');
    // This gives you a Google Access Token. You can use it to access the Google API.
    let token = result.credential.accessToken;
    // The signed-in user info.
    let user = result.user;
    console.log(result);
    // ...
  }).catch((error) => {
    // Handle Errors here.
    let errorCode = error.code;
    let errorMessage = error.message;
    // The email of the user's account used.
    let email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    let credential = error.credential;
    // ...
  });
};

const ingreso = () => {
  let emailIngreso = document.getElementById('emailIngreso').value;
  let passwordIngreso = document.getElementById('passwordIngreso').value;
  // location.href = '../views/view1.html';
  firebase.auth().signInWithEmailAndPassword(emailIngreso, passwordIngreso)
    .catch((error) => {
      // Handle Errors here.
      let errorCode = error.code;
      let errorMessage = error.message;
      console.error(errorCode, errorMessage);
      alert('Tu usuario o contraseña son incorrectos.');
    });
};

// verificar si existe un usuario y darle acceso
const observador = () => {
  // cuando un usuario ya esta registrado
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // console.log('existe usuario registrado');
      // User is signed in.
      // aparece();
      // let displayName = user.displayName;
      // let email = user.email;
      // cuando el usuario ya confirmo correo
      // console.log(user.emailVerified);
      // let emailVerified = user.emailVerified;
      // let photoURL = user.photoURL;
      // let isAnonymous = user.isAnonymous;
      // let uid = user.uid;
      // let providerData = user.providerData;
      // si no existe un usuario

      // guarda session en localStorage
      window.localStorage.setItem('session', JSON.stringify({
        token: user.G,
        email: user.email,
        photoURL: user.photoURL,
        phoneNumber: user.phoneNumber
      }));

      let homePage = './views/home.html';
      if (location.pathname.indexOf('views') > -1) {
        homePage = './home.html';
      }
      // redirecciona al timeline
      return location.href = homePage;
    } else {
      // User is signed out.
      console.log('Inicia sesión.');
    }
  });
};

observador();

// const cerrar = () => {
//   firebase.auth().signOut()
//     .then(() => {
//       console.log('Saliendo...');
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };

// verificar el correo electronico con el que se esta registrando
const verificar = () => {
  // enviara correo para verificar
  let user = firebase.auth().currentUser;
  // usuario a quien se le mandara correo
  user.sendEmailVerification()
    .then(() => {
      // si funciona se le mandara correo
      // Email sent.
      alert('Enviando correo..');
    }).catch((error) => {
      // An error happened.
      console.error('error');
    });
};

const loginMovil = () => {
  location.href = 'views/ingresar.html';
  aparece();
};

const registroMovil = () => {
  location.href = 'views/registro.html';
  aparece();
};
