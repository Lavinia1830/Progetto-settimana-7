let url = "https://striveschool-api.herokuapp.com/api/product/";
const apiKey = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTc4M2JkNmMwNTgzNTAwMTg1MjMwYzEiLCJpYXQiOjE3MDIzNzg0NTQsImV4cCI6MTcwMzU4ODA1NH0.8smzxz8BbGLaTSQzH0GgQXdPjcD71aRuxapmzaaK8co";





/*Script Home page */


let displayProducts = (results) => {
    let rowReference = document.querySelector('#row');
    results.forEach(product => {
        //creo colonna
        let xCard = document.createElement('div');
        //div con classe col + margine verticale
        xCard.classList.add('col', 'my-3');
        xCard.innerHTML =
        `<div class="card h-100 shadow">
            <div class="row align-items-center">
                <div class="col-sm-5">
                    <img src="${product.imageUrl}" class="img-fluid" alt="${product.name}">
                </div>
                <div class="col-sm-7 h-100" >
                    <div class="card-body h-100">
                        <h5 class="card-title">${product.brand} ${product.name}</h5>
                        <p class="card-text text-primary">$${product.price}</p>
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
            console.log('Connessione avvenuta! Status code:', response.status);
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

const deleteProduct = async () => {
                        
    let response = await fetch(url + productID, {
        method: 'DELETE',
        headers: {"Authorization": apiKey}
    })

    console.log(response);

    if (response.ok) {
        alert('Prodotto eliminato correttamente');
        window.location.assign("../index.html");
    } else {
        alert("Problema nell'eliminazione del prodotto");
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
            console.log('Hai ottenuto:', prodotto);
            document.querySelector('#name').value = prodotto.name;
            document.querySelector('#description').value = prodotto.description;
            document.querySelector('#brand').value = prodotto.brand;
            document.querySelector('#imageUrl').value = prodotto.imageUrl;
            document.querySelector('#price').value = prodotto.price;
            
            let btnDelete = document.querySelector('#delete');
            btnDelete.addEventListener('click', () => {
                if(window.confirm('Vuoi davvero eliminare il prodotto?')){
                    deleteProduct();
                }
                else{
                    alert('Prodotto non eliminato');
                } 
            })
        }
        else{
            alert('Errore nella gestione della chiamata');
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
            if(!window.confirm('Prodotto aggiunto correttamente! Desideri aggiungere altri prodotti?')){
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
    

