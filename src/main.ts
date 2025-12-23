import './scss/styles.scss';

import { Product } from './components/models/Product';
import { Cart } from './components/models/Cart';
import { Customer } from './components/models/Customer';
import { ApiClient } from './components/models/ApiClient';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';

import { Gallery } from './components/views/Gallery';
import { Header } from './components/views/Header';
import { Modal } from './components/views/Modal';
import { Basket } from './components/views/Basket';
import { OrderForm } from './components/views/OrderForm';
import { ContactsForm } from './components/views/ContactsForm';
import { OrderSuccess } from './components/views/OrderSuccess';
import { CardCatalog } from './components/views/CardCatalog';
import { CardPreview } from './components/views/CardPreview';
import { CardBasket } from './components/views/CardBasket';

import { ensureElement, cloneTemplate } from './utils/utils';
import { API_URL } from './utils/constants';
import { IOrderRequest } from './types';
import { IProduct } from "./types/index";
import { TPayment } from './types';

/* ======================
   Инициализация
====================== */

const events = new EventEmitter();
const api = new ApiClient(new Api(API_URL));

const catalog = new Product();
const cart = new Cart();
const customer = new Customer();

/* ======================
   Представления и шаблоны
====================== */

const header = new Header(events, ensureElement('.header'));
const gallery = new Gallery(ensureElement('.gallery'));
const modal = new Modal(events, ensureElement('.modal'));

const templates = {
  catalog: ensureElement<HTMLTemplateElement>('#card-catalog'),
  preview: ensureElement<HTMLTemplateElement>('#card-preview'),
  basketCard: ensureElement<HTMLTemplateElement>('#card-basket'),
  basket: ensureElement<HTMLTemplateElement>('#basket'),
  order: ensureElement<HTMLTemplateElement>('#order'),
  contacts: ensureElement<HTMLTemplateElement>('#contacts'),
  success: ensureElement<HTMLTemplateElement>('#success'),
};

const basketView = new Basket(events, cloneTemplate(templates.basket));
const orderForm = new OrderForm(events, cloneTemplate(templates.order));
const contactsForm = new ContactsForm(events, cloneTemplate(templates.contacts));
const successView = new OrderSuccess(events, cloneTemplate(templates.success));

/* ======================
   Каталог
====================== */

function drawCatalog() {
  const cards = catalog.getProducts().map((product) => {
    const card = new CardCatalog(events, cloneTemplate(templates.catalog));
    return card.render(product);
  });

  gallery.render({ catalog: cards });
}

catalog.on('product:list-changed', drawCatalog);

/* ======================
   Превью товара
====================== */

catalog.on(
  'product:selected',
  ({ product }: { product: IProduct }) => {
    const preview = new CardPreview(events, cloneTemplate(templates.preview));

    const element = preview.render({
      id: product.id,
      title: product.title,
      price: product.price,
      category: product.category,
      image: product.image,
      description: product.description,
      inCart: cart.hasItem(product.id),
    });

    modal.content = element;
    modal.open();
  }
);


events.on('card:open', ({ card }: { card: string }) => {
  const product = catalog.getProductById(card);
  if (product) {
    catalog.setSelected(product);
  }
});

/* ======================
   Корзина
====================== */

function drawBasket() {
  const items = cart.getItems().map((item, index) => {
    const card = new CardBasket(events, cloneTemplate(templates.basketCard));
    card.index = index + 1;
    return card.render(item);
  });

  basketView.items = items;
  basketView.total = cart.getTotal();
}

cart.on('cart:changed', () => {
  header.counter = cart.getCount();
  drawBasket();
});

events.on('card:add', ({ card }: { card: string }) => {
  const product = catalog.getProductById(card);
  if (product && product.price !== null) {
    cart.addItem(product);
  }
});

events.on('card:delete', ({ card }: { card: string }) => {
  cart.removeItem(card);
});

events.on('basket:open', () => {
  drawBasket();
  modal.content = basketView.render();
  modal.open();
});

/* ======================
   Оформление заказа
====================== */

events.on('basket:order', () => {
  if (!cart.getCount()) return;

  const data = customer.getCustomerInfo();
  orderForm.payment = data.payment;
  orderForm.addressValue = data.address;

  modal.content = orderForm.render();
  modal.open();
});

customer.on('customer:changed', () => {
  const errors = customer.validateCustomerInfo();
  orderForm.validateForm(errors);
  contactsForm.validateForm(errors);
});

events.on(
  'order:change',
  ({ field, value }: { field: string; value: string }) => {
    if (field === 'payment' && (value === 'cash' || value === 'card')) {
      customer.payment = value as TPayment;
      return;
    }

    if (field === 'address') customer.address = value;
    if (field === 'email') customer.email = value;
    if (field === 'phone') customer.phone = value;
  }
);


events.on('order:next', () => {
  const data = customer.getCustomerInfo();
  contactsForm.emailValue = data.email;
  contactsForm.phoneValue = data.phone;

  modal.content = contactsForm.render();
});

events.on('contacts:submit', () => {
  const order: IOrderRequest = customer.getCustomerInfo();

  api.sendOrder(order)
    .then((response) => {
      cart.clear();
      customer.clearCustomerInfo();

      successView.total = response.total;
      modal.content = successView.render();
    })
    .catch(console.error);
});

events.on('success:closed', () => {
  modal.close();
});

/* ======================
   Загрузка данных
====================== */

api.fetchProducts()
  .then((products) => catalog.setProducts(products))
  .catch(console.error);
