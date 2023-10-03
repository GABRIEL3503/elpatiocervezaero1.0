// function loadMenuItems() {
//   fetch('https://elpatio.onrender.com/api/menu')
//     .then(response => response.json())
//     .then(data => {
//       const container = document.querySelector('.container'); // Obtener el contenedor
//       let currentType = null; // Variable para llevar un registro del tipo actual

//       data.data.forEach(item => {
//         // Verificar si la sección del menú ya existe
//         let menuSection = document.querySelector(`.menu-section[data-type="${item.tipo}"]`);

//         // Si no existe, crearla
//         if (!menuSection) {
//           menuSection = document.createElement('div');
//           menuSection.className = 'menu-section';
//           menuSection.setAttribute('data-type', item.tipo);

//           // Crear el título de la sección si es un nuevo tipo
//           if (currentType !== item.tipo) {
//             const sectionTitle = document.createElement('h2');
//             sectionTitle.className = 'section-title';
//             sectionTitle.textContent = item.tipo.toUpperCase();
//             menuSection.appendChild(sectionTitle);
//             currentType = item.tipo;
//           }

//           container.appendChild(menuSection);  // Añadir al contenedor en lugar del body
//         }

//         const newItem = createMenuItem(item);
//         menuSection.appendChild(newItem);
//       });
//     });
// }


// function createMenuItem(item) {

//   const newItem = document.createElement('div');
//   newItem.className = 'menu-item';
//   newItem.innerHTML = `
//     <div class="item-header">
//       <h3 class="item-title">${item.nombre}</h3>
//       <span class="item-price">$${item.precio}</span>
//     </div>
//     <p class="item-description">${item.descripcion}</p>
//     <button class="edit-button">Editar</button>
//   `;
//   newItem.dataset.id = item.id;
//   return newItem;

// }

function checkAuthentication() {
  const token = localStorage.getItem('jwt');
  console.log("Token desde localStorage:", token);  // Depuración

  if (token) {
    console.log("Usuario autenticado. Mostrando botones...");  // Depuración

    // El usuario está autenticado
    document.querySelectorAll('.auth-required').forEach((elem) => {
      elem.style.display = 'inline-block';
    });
  } else {
    console.log("Usuario no autenticado. Ocultando botones...");  // Depuración
  }
}
document.addEventListener("DOMContentLoaded", function () {
  checkAuthentication();

  // Añadir un evento click al botón "Iniciar Sesión"
  document.getElementById('login-button').addEventListener('click', function () {
    Swal.fire({
      title: 'Iniciar Sesión',
      html:
        '<input id="swal-username" class="swal2-input" placeholder="Usuario">' +
        '<input id="swal-password" type="password" class="swal2-input" placeholder="Contraseña">',
      focusConfirm: false,
      preConfirm: () => {
        return {
          username: document.getElementById('swal-username').value,
          password: document.getElementById('swal-password').value
        };
      }
    }).then((result) => {  // Asegúrate de que este bloque esté dentro de la llamada a Swal.fire
      if (result.isConfirmed) {
        // Enviar estas credenciales al servidor
        fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(result.value)
        })
          .then(response => response.json())
          .then(data => {
            console.log(data);
            if (data.auth) {
              localStorage.setItem('jwt', data.token);  // 
              console.log('Token almacenado:', localStorage.getItem('jwt'));  // Verificar si el token se almacenó
              window.location.reload();  // Recargar la página

            } else {
              console.log('Credenciales inválidas');
            }
          });
      }
    });
  });

  function loadMenuItems() {
    return fetch('https://elpatio.onrender.com/api/menu') // Asegúrate de que la URL sea la correcta
      .then(response => response.json())
      .then(data => {
        const container = document.querySelector('.container');
        let currentType = null;

        data.data.forEach(item => {
          let menuSection = document.querySelector(`.menu-section[data-type="${item.tipo}"]`);

          if (!menuSection) {
            menuSection = document.createElement('div');
            menuSection.className = 'menu-section';
            menuSection.setAttribute('data-type', item.tipo);
          
            if (currentType !== item.tipo) {
              // Crear el elemento de imagen para el icono
              const icon = document.createElement('img');
              icon.className = 'section-icon';
              
              // Generar el nombre del archivo del icono
              const iconName = item.tipo.toLowerCase().replace(/ /g, '_');
              icon.src = `./img/${iconName}.png`; // Asegúrate de que la ruta sea la correcta
              icon.alt = `${item.tipo} icon`;
          
              // Crear el título de la sección
              const sectionTitle = document.createElement('h2');
              sectionTitle.className = 'section-title';
              sectionTitle.textContent = item.tipo.toUpperCase();
          
              // Añadir el icono al lado del título de la sección
              const titleWithIcon = document.createElement('div');
              titleWithIcon.className = 'title-with-icon';
              titleWithIcon.appendChild(sectionTitle);
              titleWithIcon.appendChild(icon);
          
              menuSection.appendChild(titleWithIcon);
              currentType = item.tipo;
            }
          }
          

          const newItem = createMenuItem(item);
          menuSection.appendChild(newItem);
        });
        applyOddItemClass();
        checkAuthentication();

      });


  }


  function createMenuItem(item) {
    const newItem = document.createElement('div');
    newItem.className = 'menu-item';
    newItem.innerHTML = `
    <div class="item-header">
      <h3 class="item-title">${item.nombre}</h3>
      <span class="item-price">$${item.precio}</span>
    </div>
    <p class="item-description">${item.descripcion}</p>
    <button class="edit-button auth-required">Editar</button>
  `;
    newItem.dataset.id = item.id;
    return newItem;
  }
  function applyOddItemClass() {
    // Obtener todas las secciones del menú
    const menuSections = document.querySelectorAll('.menu-section');

    // Iterar a través de cada sección y aplicar la clase 'odd-item' a las impares
    menuSections.forEach((section, index) => {
      if (index % 2 !== 0) {
        section.classList.add('odd-item');
      } else {
        section.classList.remove('odd-item'); // Asegurarse de que las secciones pares no tengan la clase
      }
    });
  }


  document.body.addEventListener('click', function (event) {
    if (event.target.classList.contains('edit-button')) {
      const itemElement = event.target.closest('.menu-item');
      const itemTitle = itemElement.querySelector('.item-title').textContent;
      const itemPrice = itemElement.querySelector('.item-price').textContent.substring(1); // Eliminar el símbolo de dólar
      const itemDescription = itemElement.querySelector('.item-description').textContent;
      const itemType = event.target.closest('.menu-section').getAttribute('data-type');

      Swal.fire({
        title: 'Editar elemento',
        html:
          '<input id="swal-input1" class="swal2-input" placeholder="Nombre" value="' + itemTitle + '">' +
          '<input id="swal-input2" class="swal2-input" placeholder="Precio" value="' + itemPrice + '">' +
          '<input id="swal-input4" class="swal2-input" placeholder="Descripción" value="' + itemDescription + '">' +
          '<select id="swal-input3" class="swal2-input">' +
          '<option value="ENTRADAS" ' + (itemType === 'ENTRADAS' ? 'selected' : '') + '>ENTRADAS</option>' +
          '<option value="PARA COMPARTIR" ' + (itemType === 'PARA COMPARTIR' ? 'selected' : '') + '>PARA COMPARTIR</option>' +
          '<option value="SANDWICHES" ' + (itemType === 'SANDWICHES' ? 'selected' : '') + '>SANDWICHES</option>' +
          '<option value="BEBIDAS" ' + (itemType === 'BEBIDAS' ? 'selected' : '') + '>BEBIDAS</option>' +
          '<option value="CERVEZAS" ' + (itemType === 'CERVEZAS' ? 'selected' : '') + '>CERVEZAS</option>' +
          '<option value="GIN" ' + (itemType === 'GIN' ? 'selected' : '') + '>GIN</option>' +
          '</select>',
        showCancelButton: true,
        confirmButtonText: 'Actualizar',
        cancelButtonText: 'Eliminar'
      }).then((result) => {
        const updatedData = {
          nombre: document.getElementById('swal-input1').value,
          precio: document.getElementById('swal-input2').value,
          descripcion: document.getElementById('swal-input4').value,
          tipo: document.getElementById('swal-input3').value
        };


        if (result.isConfirmed) {
          console.log("ID del elemento a editar:", itemElement.dataset.id);
          fetch(`/api/menu/${itemElement.dataset.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
          }).then(response => response.json())
            .then(data => {
              if (data.changes > 0) {
                // El elemento se actualizó correctamente
                console.log('Elemento actualizado');
                // Actualizar el elemento en el frontend
                itemElement.querySelector('.item-title').textContent = updatedData.nombre;
                itemElement.querySelector('.item-price').textContent = `$${updatedData.precio}`;
                itemElement.querySelector('.item-description').textContent = updatedData.descripcion;

                const oldMenuSection = event.target.closest('.menu-section');
                const newMenuSection = document.querySelector(`.menu-section[data-type="${updatedData.tipo}"]`);
                if (oldMenuSection !== newMenuSection) {
                  oldMenuSection.removeChild(itemElement);
                  newMenuSection.appendChild(itemElement);
                }
              }
            });

        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // Eliminar el elemento
          fetch(`/api/menu/${itemElement.dataset.id}`, {
            method: 'DELETE'
          }).then(response => response.json())
            .then(data => {
              if (data.deleted > 0) {
                // El elemento se eliminó correctamente
                console.log('Elemento eliminado');
                itemElement.remove();

              }
            });
        }
      });
    }
  });


  // Cargar los elementos del menú
  loadMenuItems();

  // Añadir un evento click al botón "Crear ítem"
  document.getElementById('create-item-button').addEventListener('click', function () {
    Swal.fire({
      title: 'Crear nuevo elemento',
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Nombre">' +
        '<input id="swal-input2" class="swal2-input" placeholder="Precio">' +
        '<input id="swal-input4" class="swal2-input" placeholder="Descripción">' +
        '<select id="swal-input3" class="swal2-input">' +
        '<option value="ENTRADAS">ENTRADAS</option>' +
        '<option value="PARA COMPARTIR">PARA COMPARTIR</option>' +
        '<option value="SANDWICHES">SANDWICHES</option>' +
        '<option value="BEBIDAS">BEBIDAS</option>' +
        '<option value="CERVEZAS" >CERVEZAS</option>' +
        '<option value="GIN">GIN</option>' +

        '</select>',
      focusConfirm: false,
      preConfirm: () => {
        return {
          nombre: document.getElementById('swal-input1').value,
          precio: document.getElementById('swal-input2').value,
          descripcion: document.getElementById('swal-input4').value,
          tipo: document.getElementById('swal-input3').value
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const newData = {
          nombre: document.getElementById('swal-input1').value,
          precio: document.getElementById('swal-input2').value,
          descripcion: document.getElementById('swal-input4').value,
          tipo: document.getElementById('swal-input3').value
        };

        // Crear el nuevo elemento en el servidor
        fetch('https://elpatio.onrender.com/api/menu', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newData)
        }).then(response => response.json())
          .then(data => {
            if (data.id) {
              // El elemento se creó correctamente
              console.log('Elemento creado con ID:', data.id);

              // Verificar si la sección del menú ya existe
              let menuSection = document.querySelector(`.menu-section[data-type="${newData.tipo}"]`);

              // Si no existe, crearla
              if (!menuSection) {
                menuSection = document.createElement('div');
                menuSection.className = 'menu-section';
                menuSection.setAttribute('data-type', newData.tipo);
                // Aquí puedes añadir más elementos al menuSection si es necesario
                document.body.appendChild(menuSection);  // Añadir al lugar apropiado en el DOM
              }

              const newItem = createMenuItem(newData);
              menuSection.appendChild(newItem);
            }
          })


      }
    });
  });
});
// Función para cerrar la sesión
function simpleLogout() {
  localStorage.removeItem('jwt');  // Elimina el token JWT del almacenamiento local
  window.location.reload();  // Recarga la página
}

// Vincula la función al evento click del botón "Cerrar Sesión"
document.addEventListener("DOMContentLoaded", function () {
  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {  // Comprueba si el botón existe en la página
    logoutButton.addEventListener('click', simpleLogout);
  }
});
