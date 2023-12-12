let site = "https://striveschool-api.herokuapp.com/api/product/";
const apiKey = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTc4M2JkNmMwNTgzNTAwMTg1MjMwYzEiLCJpYXQiOjE3MDIzNzg0NTQsImV4cCI6MTcwMzU4ODA1NH0.8smzxz8BbGLaTSQzH0GgQXdPjcD71aRuxapmzaaK8co";

class Product{
    constructor(_name, _description, _brand, _imageUrl, _price){
        this.name = _name;
        this.description = _description;
        this.brand = _brand;
        this.imageUrl = _imageUrl;
        this.price = _price;
    }
}

let product1 = new Product("Nokia 3310", "Indestructible cellphone", "Nokia", "https://example.com/3310.jpg", 99);
console.log(product1);

document.addEventListener("DOMContentLoaded", () => {
    createData(product1, site);
    getData(site);
});

function getData(url){
    fetch(url, {
        method: 'GET',
        headers: {Authorization: apiKey}
    })
    .then(response => response.json())
    .then(json => console.log(json))
}

function createData(data, url) {
    fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            Authorization: apiKey,
            "Content-Type": "application/json"
        }
    })
    .catch(err => console.log(err))
}