const cards = document.getElementById('cards');
const items = document.getElementById('items');
const footer = document.getElementById('footer');
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment();
let carrito = {}

document.addEventListener('DOMContentLoaded', () => {
    loadTennis();
    if(localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})

cards.addEventListener('click', e => {
    addCarrito(e);
})

items.addEventListener('click', e => {
    btnAccion(e);
})

const loadTennis = async () =>  {
    try{
        const response = await fetch('api.json');
        const data = await response.json();
        showCards(data);
    }catch(error) {
        console.log(error)
    }
}

const showCards = (data) => {
    data.forEach(product => {
        templateCard.querySelector('h5').textContent = product.title;
        templateCard.querySelector('p').textContent = product.price;
        templateCard.querySelector('img').setAttribute('src', product.image)
        //Add the id to the button
        templateCard.querySelector('.btn-dark').dataset.id = product.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    });
    cards.appendChild(fragment)
}

const addCarrito = e => {
    if(e.target.classList.contains('btn-dark')) {
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation();
}

const setCarrito = object => {
    //console.log(object);
    const product = {
        id: object.querySelector('.btn-dark').dataset.id,
        title: object.querySelector('h5').textContent,
        price: object.querySelector('p').textContent,
        cant: 1
    }
    if(carrito.hasOwnProperty(product.id)) {
        product.cant = carrito[product.id].cant + 1
    }
    carrito[product.id] = { ...product}
    pintarCarrito()
}

const pintarCarrito = () => {
    console.log(carrito);
     items.innerHTML = '';
     Object.values(carrito).forEach(product => {
         templateCarrito.querySelector('th').textContent = product.id
         templateCarrito.querySelector('td').textContent = product.title
         templateCarrito.querySelector('.cant').textContent = product.cant
         templateCarrito.querySelector('.btn-info').dataset.id = product.id
         templateCarrito.querySelector('.btn-danger').dataset.id = product.id
         templateCarrito.querySelector('span').textContent = product.cant * product.price
         const clone = templateCarrito.cloneNode(true)
         fragment.appendChild(clone)
     })
     items.appendChild(fragment)
     pintarFooter()

     localStorage.setItem('carrito', JSON.stringify(carrito))
}

const pintarFooter = () => {
    footer.innerHTML = '';
    if(Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comienza a comprar!</th>
        `
        return
    }
    const nCant = Object.values(carrito).reduce((acc, {cant}) => acc + cant,0)
    const nPrice = Object.values(carrito).reduce((acc, {cant, price}) => acc + cant * price,0)
    
    templateFooter.querySelector('td').textContent = nCant
    templateFooter.querySelector('span').textContent = nPrice

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })
}

const btnAccion = e => {
    if(e.target.classList.contains('btn-info')) {
        const product = carrito[e.target.dataset.id]
        product.cant++
        carrito[e.target.dataset.id] = {...product}
        pintarCarrito()
    }
    if(e.target.classList.contains('btn-danger')) {
        const product = carrito[e.target.dataset.id]
        product.cant--
        if(product.cant === 0) {
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
    }
    e.stopPropagation()
}