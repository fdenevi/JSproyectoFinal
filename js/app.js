// CONSTANTES Y VARIABLES
let productos = [];
let contenidoHTML = "";
const mail = () =>{
  Swal.fire({
      title: 'Suscribite al newsletter y no te pierdas nunca ninguna de nuestras ofertas!!',
      input: 'email',
      inputPlaceholder: 'Ingrese aquí su email',
      width: '40em',
      color: '#716add',
      background: '#fff',
      backdrop: 'rgba(0,0,123,0.4)',
      confirmButtonColor:'#adff2f'
    });
  }


// PRODUCTOS HTML
const retornoProductos = (prod) => {
  return `<div>
            <h3 class="titleProd">${prod.nombre}</h3>
              <div class="info">
                <img src="${prod.imagen}" class="img-fluid">
                <p class="description">${prod.descripcion}</p>
              </div>
            <p class="price">$${prod.precio}</p>
            <button class="btn btn-agregar${prod.id}" title="agregar al carrito">COMPRAR</button>
          </div>`
}


// ERROR HTML
const retornoError = () =>{
  return `<div class="cardError">
            <h2>DISCULPE LAS MOLESTIAS</h2>
            <img src="img/error.png" alt="error">
            <p>Estamos renovando la tienda.</p>
          </div>`
}


// PRINT PRODUCTOS EN HTML
const containerProductos = document.querySelector(".productos");
const printProductos = async () =>{
  await fetch('js/productos.json')
        .then((response) => response.json())
        .then((prods) => {
          productos = prods
          productos.forEach(prod => {
            contenidoHTML += retornoProductos(prod)
          });
          containerProductos.innerHTML = contenidoHTML
        })
        .catch((error) => {
          containerProductos.innerHTML = retornoError ()
        })
  mail()
  agregarProducto()
}
printProductos()


// FUNCION BOTON COMPRAR
function agregarProducto () {
  productos.forEach ((prod) => {
    document
    .querySelector(`.btn-agregar${prod.id}`)
    .addEventListener("click", () => {
      agregarAcarrito(prod)
      Toastify({
        text: "Producto añadido al carrito",
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "#adff2f",
          color: "#000000",
        },
        onClick: function(){}
      }).showToast();
    });
  });
}


// INCREMENTANDO CANTIDAD DE UN MISMO PRODUCTO EN CARRITO
function agregarAcarrito(prod) {
  let existe = carrito.some (prodSome => prodSome.id === prod.id);
  let prodFind = carrito.find(productoFind => productoFind.id === prod.id);

    existe === false ? (carrito.push(prod), prod.cantidad = 1) : (prodFind, prod.cantidad ++)
    printCarrito ()
}


// PRINT CARRITO EN HTML
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const carritoTitulos = document.querySelector(".carritoTitulos");
const containerCompras = document.querySelector(".carrito");
const valorTotal = document.querySelector(".total");
const form = document.querySelector(".formulario");
function printCarrito() {
  containerCompras.innerHTML = "";
  let total = 0;

  if (carrito.length === 0) {
    carritoTitulos.innerHTML = "";
    containerCompras.innerHTML = `<p>No tiene productos en su carrito</p>`;
    valorTotal.innerHTML = "";
    form.innerHTML= "";
  } else {
    carrito.forEach((prod) => {
      carritoTitulos.innerHTML = `<p class="col-3">PRODUCTO</p>
                                  <p class="col-3">CANTIDAD</p>
                                  <p class="col-3">TOTAL</p>
                                  <p class="col-3">BORRAR</p>`

      containerCompras.innerHTML += `<div class="carritoProductos">
                                        <p class="col-3">${prod.nombre}</p>
                                        <p class="col-3">${prod.cantidad}</p>
                                        <p class="col-3">$${prod.precio * prod.cantidad}</p>
                                        <button class="col-3 btn-borrar${prod.id}">X</button>
                                      </div>`

      valorTotal.innerHTML = `TOTAL $${total += parseInt(prod.precio) * parseInt(prod.cantidad)}`

      form.innerHTML = `<div class="form">
                            <p>NOMBRE Y APELLIDO</p>
                            <div><input type="text" name="name" id="name" placeholder="Nombre y Apellido"></div>
                          </div>
                          <div class="form">
                              <p>TELEFONO</p>
                              <div><input type="tel" name="phone" id="phone" placeholder="Celular"></div>
                          </div>
                          <div class="form">
                              <p>E-MAIL</p>
                              <div><input type="email" name="email" id="email" placeholder="E-mail"></div>
                          </div>
                          <div>
                            <button class="comprar">FINALIZAR COMPRA</button>
                          </div>`
    });
    const btnFinalizarCompra = document.querySelector(".comprar")
      btnFinalizarCompra.addEventListener("click", () => {
        if (`${document.querySelector("#name").value}`=== "" || `${document.querySelector("#phone").value}`=== "" || `${document.querySelector("#email").value}` === "") {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Debe ingresar todos sus datos',
          });
        } else {
          Swal.fire({
            title: 'Compra realizada con éxito ;) !',
            text: `Gracias por confiar en nosotrxs ${document.querySelector("#name").value}. En los próximos minutos recibirás un correo electrónico con el detalle de tu compra`,
            imageUrl: 'img/logo_bg.png',
            imageAlt: 'Custom image',
          });
          carritoTitulos.innerHTML = "";
          containerCompras.innerHTML = `<p>No tiene productos en su carrito</p>`;
          valorTotal.innerHTML = "";
          form.innerHTML= "";
          limpiarCarrito()
        }
      })
  };
  localStorage.setItem("carrito", JSON.stringify(carrito));
  borrarProducto()
}
printCarrito()


// VACIAR CARRITO UNA VEZ FINALIZADA LA COMPRA
function limpiarCarrito () {
  carrito = [];
  printCarrito();
  localStorage.clear();
}


// BORRAR PRODUCTOS CARRITO
function borrarProducto () {
  carrito.forEach ((prod) => {
    document
    .querySelector(`.btn-borrar${prod.id}`)
    .addEventListener("click", () => {
      carrito = carrito.filter((prodFilter) => prodFilter.id !== prod.id)
      printCarrito()
  });
});
}