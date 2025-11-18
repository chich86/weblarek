import './scss/styles.scss';
import { Cart } from "./components/models/Cart";
import { Product } from "./components/models/Product";
import { Customer } from "./components/models/Customer";
import { ApiClient } from "./components/base/ApiClient";
import { apiProducts } from "./utils/data";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";

// --- Каталог товаров ---
const catalogModel = new Product();
catalogModel.setProducts(apiProducts.items);

console.log("Массив товаров из каталога:", catalogModel.getProducts());

// Выбор первого товара
const firstProduct = apiProducts.items[0];
if (firstProduct) {
  catalogModel.setSelected(firstProduct);
  console.log('Выбранный товар:', catalogModel.getSelected());
}

// --- Покупатель ---
const customerModel = new Customer();

customerModel.setCustomerInfo({
  payment: 'card',
  address: "Spb Vosstania 1",
  phone: "+71234567890",
  email: "test@test.ru",
});

console.log("Информация о покупателе:", customerModel.getCustomerInfo());

// --- Корзина ---
const cartModel = new Cart();
const [product1, product2] = apiProducts.items;

[product1, product2].forEach(p => p && cartModel.addItem(p));

console.log("Содержимое корзины:", cartModel.getItems());
console.log("Общее количество товаров:", cartModel.getCount());
console.log("Общая сумма корзины:", cartModel.getTotal());
console.log(`Есть ли товар "${product1?.id}"?`, cartModel.hasItem(product1?.id || ''));

// Удаление и очистка
if (product1) cartModel.removeItem(product1.id);
console.log("После удаления:", cartModel.getItems());

cartModel.clear();
console.log("После очистки корзины:", cartModel.getCount());

// --- Валидация ---
console.log("Валидация данных:", customerModel.validateCustomerInfo());

customerModel.clearCustomerInfo();
console.log("После очистки данных:", customerModel.getCustomerInfo());

// --- Работа с сервером ---
const apiClient = new ApiClient(new Api(API_URL));

apiClient.fetchProducts()
  .then(() => {
    console.log("Каталог с сервера:", catalogModel.getProducts());
  })
  .catch(error => console.error("Ошибка API:", error));
