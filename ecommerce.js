let contenedorCompra = document.getElementById("contenedor-compra");
let botonComprar = document.getElementById("comprar");
const tablaCarrito = document.querySelector('.tablaCarrito'); 
const clave_changuito = "claveChanguito" //localStorage

//En este contenedor voy a agregar mis productos en stock
const contenedorProductos = document.getElementById('contenedor-productos');

//En este contenedor voy a agregar los datos de mi ultima compra almacenados en localStorage
const ultimaCompra = document.getElementById('ultimaCompra');

//Genero un stock de mis productos en venta donde facilmente podréactualizar precios y agregar items
let stockProductos = [
    {id: 1, nombre: "Aromatizadores", precio: 700, img: './images/aromatizador.png'},
    {id: 2, nombre: "Jabon Liquido", precio: 500, img: './images/jabon.png'},
    {id: 3, nombre: "Perfuminas", precio: 650, img: './images/spray.png'},
    {id: 4, nombre: "Esencias Aromaticas", precio: 350, img: './images/esencia.png'},
]

//Vuelco mi stock de productos en el HTML (Cree un contenedor especifico para esto)
stockProductos.forEach((producto) => {
    const div = document.createElement("div");
    div.innerHTML =`
    <img src=${producto.img} alt="">
    <h3>${producto.nombre}</h3>
    <p class="precioProducto">Precio:$ ${producto.precio}</p>
    <button id="agregar${producto.id}" class="boton-agregar">Agregar</button>
    `
    contenedorProductos.appendChild(div)

//Escucho cada click en los botones "Agregar"
    const boton = document.getElementById(`agregar${producto.id}`)
    boton.addEventListener('click', () => {
        const productoID = producto.id;
        const productoNombre = producto.nombre;
        const productoPrecio = producto.precio;
        const productoImg = producto.img;
//Creo una Funcion con los parametros para agregar cada producto clickeado al chango
        agregaProductoCarrito(productoID, productoNombre, productoPrecio, productoImg);
    })
});


function agregaProductoCarrito(productoID, productoNombre, productoPrecio, productoImg){

    const itemID = tablaCarrito.getElementsByClassName('itemID');      
      for (let i = 0; i < itemID.length; i++) {
        if (itemID[i].innerText == productoID) {
            let cantidadItems = itemID[i].parentElement.parentElement.parentElement.querySelector('.cantidadProducto');
            cantidadItems.value++;
            actualizarTotalCarrito();
            return;
        }
      }

    const filaTabla = document.createElement('div');
    const carritoContenido = `
    <div class="row changuitoItem">
        <div class="col-2">
            <div class="shopping-cart-price d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                <p class="item-price mb-0 itemID">${productoID}</p>
            </div>
        </div>
        <div class="col-4">
            <div class="shopping-cart-item d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                <img src=${productoImg} class="imgCarrito">
                <h6 class="shopping-cart-item-title productoNombre text-truncate ml-3 mb-0">${productoNombre}</h6>
            </div>
        </div>
        <div class="col-2">
            <div class="shopping-cart-price d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                <p class="item-price mb-0 precio">${productoPrecio}</p>
            </div>
        </div>
        <div class="col-2">
            <div
                class="shopping-cart-quantity d-flex justify-content-between align-items-center h-100 border-bottom pb-2 pt-3">
                <input class="changuitoInput cantidadProducto" type="number"
                value="1">
                <button class="btn btn-danger borrarLinea" type="button">X</button>
            </div>
        </div>
    </div>`;

//pusheo el contenido al html
    filaTabla.innerHTML = carritoContenido;
    tablaCarrito.append(filaTabla);


//Escucho el evento click en los botones "X" de eliminar item 
    filaTabla.querySelector('.borrarLinea')
    .addEventListener('click', borrarElemento);

//Escucho el evento de cambio en el input de cantidad de productos
    filaTabla.querySelector('.cantidadProducto')
    .addEventListener('change', cantidadCambiada);


//Actualizo el importe total del carrito cada vez que se hace click en "Agregar"
    actualizarTotalCarrito()

}    

function actualizarTotalCarrito() {
  let total = 0;

  const totalCarrito = document.querySelector('.totalCarrito');
  const carritoFilas = document.querySelectorAll('.changuitoItem');

  carritoFilas.forEach((changuitoItem) => {
    const precioProducto = changuitoItem.querySelector('.precio');
    const cantidadProducto = changuitoItem.querySelector('.cantidadProducto');
    const precioProductoItem = Number(precioProducto.textContent)  //converti texto a numero
    const cantidadProductoItem = Number(cantidadProducto.value) //converti texto a numero
    total = total + precioProductoItem * cantidadProductoItem;
  });

  totalCarrito.innerHTML = ("$ "+`${total.toFixed(2)}`);  //El "toFixed" es para redondear el importe en caso de tener decimales
}

function borrarElemento(event) {
    const botonAccion = event.target;
    botonAccion.closest('.changuitoItem').remove();
//una vez que elimino el producto del changuito actualizo el precio total
    actualizarTotalCarrito()
}

function cantidadCambiada(event) {
    const input = event.target;
    input.value <= 0 ? (input.value = 1) : null;
    actualizarTotalCarrito();
}

// Escucho el click del boton "Comprar"
    botonComprar.addEventListener('click', () => {
    const totalCarrito = document.querySelector('.totalCarrito')
    const total = Number(totalCarrito.textContent.replace('$', ''))
    if (total === 0){
        alert("No hay productos Agregados para comprar");
    }
    else{
        alert("Gracias por tu Compra! Gastaste: $"+total);
    }

//Reseteo el localStorage; borro cualquier info que tenga
    localStorage.clear();

//Voy a guardar en el localStorage el ultimo changuito comprado
    const itemID = tablaCarrito.getElementsByClassName('itemID');
    const changuito = [];
    for (let i = 0; i < itemID.length; i++) {
        let cantidadItems = itemID[i].parentElement.parentElement.parentElement.querySelector('.cantidadProducto');
        let productoNombre = itemID[i].parentElement.parentElement.parentElement.querySelector('.productoNombre')
        changuito.push(" Producto: "+productoNombre.textContent+", Cantidad: "+cantidadItems.value);
      }

// Guardo info en localStorage
    localStorage.setItem(clave_changuito,changuito);

//Borro el Carrito de Compra y el div del detalle de "ultima Compra realizada" porque ahora hay una nueva compra.
    tablaCarrito.innerHTML = '';
    ultimaCompra.innerHTML = '';
    actualizarTotalCarrito();
    
});


// Escucho el click del boton "Ver Ultima Compra"
botonUltimaCompra.addEventListener('click', () => {
    let almacenados = JSON.stringify(localStorage.getItem(clave_changuito))
    const div = document.createElement("div");
    div.innerHTML =`
    <h3>Tu Ultima Compra Realizada fue:</h3>
    <p>${almacenados}</p>
    `
    ultimaCompra.appendChild(div)
});

    









