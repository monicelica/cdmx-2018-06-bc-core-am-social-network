// evlua si existe session iniciada en firebase, de lo contrario regresa a la pantalla de ingreso/registro de usuario
if (!window.localStorage.hasOwnProperty('session')) {
  location.href = '../index.html';
}

firebase.initializeApp({
  apiKey: 'AIzaSyC3-Ko-NLEwcZEnIRY0sOiR1H-fa3bE1fk',
  authDomain: 'red-social-867d8.firebaseapp.com',
  projectId: 'red-social-867d8',
});

// funcion para guardar el comentario en la base de datos usando firestone cloud
window.guardar = (comentario) => {
  let user = window.localStorage.getItem('session');
  user = JSON.parse(user);
  // console.log(user);

  db.collection('users').add({
    like: 0,
    dislike: 0,
    email: user.email,
    comentario: comentario,
    fecha: new Date().getTime()
  }).then((docRef) => { // se agrego correctamente lo anterior aparecera el mensaje del docRef.id
    console.log('Document written with ID: ', docRef.id);
    // limpiar campos al enviar ya un comentario
    document.getElementById('comentario').value = '';
  }).catch(error => {
    console.error('Error adding document: ', error);
  });
};

// funcion para eliminar el comentario en la base de datos usando el ID del comentario
window.eliminar = (id) => {
  db.collection('users').doc(id).delete().then(() => {
    console.log('Document successfully deleted!');
  }).catch(error => {
    console.error('Error removing document: ', error);
  });
};

// funcion para editar el comentario en la base de datos usando el ID del comentario
window.editar = (id, comentario) => {
  document.getElementById('comentario').value = comentario;
  document.getElementById('publicarEditado').setAttribute('commentid', id);
};

window.like = (id, numeroLikes) => {
  // Actualiza el documento en base al id y le suma 1 al numero total de likes
  db.collection('users').doc(id).update({
    like: numeroLikes + 1
  }).then(() => {
    console.log('like aplicado con éxito')
  }).catch((error) => {
    console.error(error);
    alert('Ocurrió un error para dar like');
  });
};

window.dislike = (id, numeroDislike) => {
  // Actualiza el documento en base al id y le suma 1 al numero total de dislikes
  db.collection('users').doc(id).update({
    dislike: numeroDislike + 1
  }).then(() => {
    console.log('dislike aplicado con éxito')
  }).catch((error) => {
    console.error(error);
    alert('Ocurrió un error para dar dislike');
  });
};

// funcion logout para terminar la session del usuairo borrando la data de localStorage
const logout = () => {
  firebase.auth().signOut().then(() => {
    window.localStorage.removeItem('session');
    return location.href = '../index.html';
  }).catch((error) => {
    alert('Ocurrió un error al cerrar la sesión.');
    console.error(error);
  });
};

// Se agregan los siguientes campos como registro
// DB Initialize Cloud Firestore through Firebase
const db = firebase.firestore();

// para poder leer y pintar los datos
// let paint = document.getElementById('getcomentario').value;

// LLAMA DB (INICIACION DE FIRESTORE) EN NUESTRO CASO LA COLECCIÓN ES USUARIO
// se susutituye .get para que este mostrando los datos en tiempo real
db.collection('users').onSnapshot((querySnapshot) => {
  getcomentario.innerHTML = '';
  //  FOR EACHE SE REPIETIRA EN CADA DOCUMENTO DE USER
  querySnapshot.forEach((doc) => {
    // SE PINTARA EL ID Y LO QUE CONTIENE
    // console.log(`${doc.id} => ${doc.data().comment}`);
    // TODO: agregar estilos para mostrar el email, comentario y fecha
    getcomentario.innerHTML += `
      <div class="comentario-publicado">
        <div class="comentario">
          <p class="autor">Publicado por: ${doc.data().email}</p>
          <p class="texto">${doc.data().comentario}</p>
          <p class="fecha">${new Date(doc.data().fecha).toUTCString()}</p>
        </div>
        <!--BOTONES-->
        <!--Por cada boton que se crea contiene los datos-->
        <div class="all-botones">
          <button type="button" class="btn boton-comentario" onclick="editar('${doc.id}', '${doc.data().comentario}')">
            <img src="../images/editar2.png" class="img-comentario" alt="editar">
            <span>Editar</span>
          </button>
          <button type="button" class="btn boton-comentario" onclick="eliminar('${doc.id}')">
            <img src="../images/cubo-de-la-basura.png" class="img-comentario" alt="editar">
            <span>Borrar</span>
          </button>
          <button type="button" class="btn boton-comentario" onclick="like('${doc.id}', ${doc.data().like})">
            <img src="../images/corazon-en-boceto.png" class="img-comentario" alt="editar">
            <span>Like (${doc.data().like})</span>
          </button>
          <button type="button" class="btn boton-comentario" onclick="dislike('${doc.id}', ${doc.data().dislike})">
            <img src="../images/corazon.png" class="img-comentario" alt="editar">
            <span>Dislike (${doc.data().dislike})</span>
          </button>
        </div>
      </div>`;
  });
});

// escucha cuando se da submit en el formulario de agregar comentario
document.getElementById('formularioPublicar').addEventListener('submit', (event) => {
  // previene que se refresque la pagina, propio de un submit en un formulario
  event.preventDefault();
  // detiene la propagacion del evento submit en los demas componentes hijos del formulario
  event.stopPropagation();
  // obtiene el valor del input cuando le dan click al boton de publicar
  let comentario = document.getElementById('comentario').value;
  // ejecuta la funcion para guardar el comentario en la base de datos y le pasa el valor del comentario
  window.guardar(comentario);
});

document.getElementById('publicarEditado').addEventListener('click', (event) => {
  let user = window.localStorage.getItem('session');
  user = JSON.parse(user);
  // console.log(user);
  // obtiene el valor editado del input#comentario
  const comentario = document.getElementById('comentario').value;
  // obtiene el Id del comentario para poder actualizarlo
  const commentId = event.target.getAttribute('commentid');
  // actualiza el comentario con la funcion de firestone cloud
  db.collection('users').doc(commentId).update({
    comentario: comentario,
    fecha: new Date().getTime()
  }).then(fuction => {
    console.log('Document successfully updated!');
    // boton.innerHTML = 'Editar';
    document.getElementById('comentario').value = '';
  }).catch(error => {
    // The document probably doesn't exist.
    console.error('Error updating document: ', error);
  });
});
