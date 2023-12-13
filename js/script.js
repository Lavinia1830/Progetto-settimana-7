let url = "https://striveschool-api.herokuapp.com/api/product/";
const apiKey = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTc4M2JkNmMwNTgzNTAwMTg1MjMwYzEiLCJpYXQiOjE3MDIzNzg0NTQsImV4cCI6MTcwMzU4ODA1NH0.8smzxz8BbGLaTSQzH0GgQXdPjcD71aRuxapmzaaK8co";


/*Script Home page */

//spinner onclick => disappear
const hideSpinner = () => {
    document.getElementById('spinner').classList.add('d-none');
}

//Mostro i prodotti a schermo, mi prendo la reference della resposive row e ci appendo prodotto (xCard) dopo prodotto.
let displayProducts = (results) => {
    let rowReference = document.querySelector('#row');
    results.forEach(product => {
        //creo colonna
        let xCard = document.createElement('div');
        //div con classe col + margine verticale
        xCard.classList.add('col', 'my-3');
        xCard.innerHTML = //creo card 
        `<div class="card h-100 shadow">
            <div class="row align-items-center">
                <div class="col-sm-5">
                    <img src="${product.imageUrl}" class="img-fluid p-3" alt="${product.name}">
                </div>
                <div class="col-sm-7 h-100" >
                    <div class="card-body h-100">
                        <h5 class="card-title">${product.brand} ${product.name}</h5>
                        <p class="card-text text-primary">€${product.price}</p>
                        <p class="card-text text-end">
                            <a href="back-office.html?productID=${product._id}" class="btn btn-warning"><i class="bi bi-pencil-square"></i></a>
                            <a href="details.html?productID=${product._id}" class="btn btn-info"><i class="bi bi-info-circle"></i></a>
                        </p>
                    </div>
                </div>
            </div>
        </div>`
        rowReference.appendChild(xCard);
    });
}

let getProducts = async () => {
    try{
        let response = await fetch(url, {
            headers: {"Authorization": apiKey}
        })
        if(response.ok){
            console.log('Connessione avvenuta! Status code:', response.status); //se va tutto bene crea le xCard
            let results = await response.json();
            console.log('Hai ottenuto:', results);
            displayProducts(results);
        }
        else {
            alert('Errore nella gestione della chiamata');
        }
    }
    catch (error){
        console.log(error);
    }
}
getProducts();

/*Script Back-office*/
let productID = new URLSearchParams(window.location.search).get('productID');

const deleteProduct = async () => { //questa funzione anonima serve per eliminare un prodotto
                        
    let response = await fetch(url + productID, {
        method: 'DELETE',
        headers: {"Authorization": apiKey}
    })

    console.log(response);

    if (response.ok) {
        alert('Prodotto eliminato correttamente'); //ti dice che è eliminato 
        window.location.assign("../index.html"); //e ti riporta alla Home page
    } else {
        alert("Problema nell'eliminazione del prodotto"); //se no ti da un  problema 
    }
}

const products = async () => {
    try {
        let response = await fetch(url + productID, {
            headers: {"Authorization": apiKey}
        })
        if(response.ok){
            console.log('Il prodotto esiste! Status code', response.status );
            let prodotto = await response.json();
            console.log('Hai ottenuto:', prodotto); //Array dei prodotti
            document.querySelector('#name').value = prodotto.name; //il nome
            document.querySelector('#description').value = prodotto.description; //la descrizione
            document.querySelector('#brand').value = prodotto.brand; //la marca
            document.querySelector('#imageUrl').value = prodotto.imageUrl; //l'immagine 
            document.querySelector('#price').value = prodotto.price; //il prezzo
            
            let btnDelete = document.querySelector('#delete');
            btnDelete.addEventListener('click', () => { //quando vuoi eliminare fare click su delate 
                if(window.confirm('Vuoi davvero eliminare il prodotto?')){ //e ti compare quasto meaaggio premere ok 
                    deleteProduct();
                }
                else{
                    alert('Prodotto non eliminato'); //e ti compare il messaggio che è eliminato
                } 
            })
        }
        else{
            alert('Errore nella gestione della chiamata'); //se no ti compare un errore
        }
    }
    catch(error){
        console.log(error);
    }
}

if(productID){
    products();
}

const saveProduct = async function (newProduct) {
    try {

        let completeURL = productID ? url + productID : url;

        let response = await fetch(completeURL, {
            method: productID ? 'PUT' : 'POST',
            body: JSON.stringify(newProduct),
            headers: {
                "Authorization": apiKey,
                'Content-Type': 'application/json',
            },
        })
        if (response.ok) {
            if(window.confirm('Prodotto aggiunto correttamente! Desideri aggiungere altri prodotti?')){
                alert('Verrai rendirizzato alla homepage.');
                window.location.assign("../index.html");

            }
        }else {
            alert("Problema nella creazione del prodotto")
        }
    } catch (error) {
        console.log(error)
    }
}

function addProduct(){
    let formReference = document.querySelector('#form');
    formReference.addEventListener('click', (ev) => {
        ev.preventDefault()    
        let newProduct = {
            name: document.querySelector('#name').value,
            description: document.querySelector('#description').value,
            brand: document.querySelector('#brand').value,
            imageUrl: document.querySelector('#imageUrl').value,
            price: document.querySelector('#price').value
        }
        console.log('Prodotto che hai appena inserito ', newProduct);
        saveProduct(newProduct);
    });
}
    
/*Script Details.html*/
const productDetail = async () => {

    try {
        let response = await fetch(url + productID, {
            headers: {
                "Authorization": apiKey
            }
        })
        if (response.ok) {
            console.log('Connessione avvenuta!');
            let product = await response.json();
            console.log('prodotto:', product);
            console.log(product.imageUrl);
            let productImageReference = document.querySelector('#productImage');
            let productImage = document.createElement('img');
            productImage.setAttribute('src', product.imageUrl);
            productImage.classList.add('w-100');
            productImageReference.appendChild(productImage);
            let productInfoReference = document.querySelector('#productInfo');
            productInfoReference.innerHTML = `
            <h2>${product.brand} - ${product.name}</h2>
            <p>${product.description}</p>
            <p>Price: €${product.price}</p>
            <p>Image Url: <br> ${product.imageUrl}</p>
            <p>SERVER GENERATED: </p>
            <ul>
                <li>createdAt: ${product.createdAt}</li>
                <li>updatedAt: ${product.updatedAt}</li>
                <li>userId: ${product.userId}</li>
                <li>_v: ${product.__v}</li>
                <li>_id: ${product._id}</li>
            </ul>`
        }
        else {
            return new Error('Errore nella gestione della chiamata');
        }
    }
    catch (error) {
        console.log(error);
    }

}

productDetail();