
## Проектная работа «Веб‑ларёк»


### Общая информация

**Название:** интернет‑магазин «Web‑Larёк».  
**Суть:** онлайн‑магазин товаров для веб‑разработчиков. Пользователи могут:  
* просматривать товары;  
* добавлять их в корзину;  
* оформлять заказы с выбором способа оплаты и вводом контактных данных.

**Стек технологий:** HTML, SCSS, TypeScript, Vite.

### Структура проекта

Структура проекта:

* src/ — исходные файлы проекта
* src/components/ — папка с JS компонентами
* src/components/base/ — папка с базовым кодом

**Важные файлы:**  
* index.html — главная страница;  
* src/types/index.ts — типы данных;  
* src/main.ts — точка входа;  
* src/scss/styles.scss — основные стили;  
* src/utils/constants.ts — константы;  
* src/utils/utils.ts — утилиты.

### Установка и запуск

1. Установите зависимости:  
   ```bash
   npm install
   # или
   yarn
   ```

2. Запустите разработку:  
   ```bash
   npm run start
   # или
   yarn start
   ```

3. Соберите проект:  
   ```bash
   npm run build
   # или
   yarn build
   ```

Архитектура приложения
Применён паттерн MVP (Model‑View‑Presenter):

Model — слой данных (хранение и изменение);

View — слой представления (отображение на странице);

Presenter — логика приложения (связь данных и представления).

Взаимодействие основано на событиях: модели и представления генерируют события, презентер их обрабатывает.

### Базовый код

#### Класс `Component<T>`

Базовый класс для компонентов интерфейса.

**Конструктор:**  
```ts
constructor(container: HTMLElement)
```
* `container` — корневой DOM‑элемент компонента.

**Методы:**  
* `render(data?: Partial<T>): HTMLElement` — отображает данные, возвращает DOM‑элемент;  
* `setImage(element: HTMLImageElement, src: string, alt?: string): void` — настраивает изображение.

#### Класс `Api`

Отвечает за HTTP‑запросы.

**Конструктор:**  
```ts
constructor(baseUrl: string, options: RequestInit = {})
```
* `baseUrl` — базовый URL сервера;  
* `options` — заголовки запросов.

**Методы:**  
* `get(uri: string): Promise<object>` — GET‑запрос;  
* `post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` — POST‑запрос (можно изменить метод);  
* `handleResponse(response: Response): Promise<object>` — проверяет ответ сервера.

#### Класс `EventEmitter`

Реализует паттерн «Наблюдатель» для событий.

**Методы:**  
* `on<T>(event: EventName, callback: (data: T) => void): void` — подписка на событие;  
* `emit<T>(event: string, data?: T): void` — отправка события;  
* `trigger<T>(event: string, context?: Partial<T>): (data: T) => void` — создаёт функцию для отправки события.

### Данные

#### Интерфейс `IProduct`

Описание товара:  
```ts
interface IProduct {
  id: string;          // Уникальный ID
  description: string;  // Описание
  image: string;      // Ссылка на изображение
  title: string;      // Название
  category: string;   // Категория
  price: number | null; // Цена (null, если нельзя купить)
}
```

#### Интерфейс `ICustomer`

Данные покупателя:  
```ts
interface ICustomer {
  payment: TPayment;    // Способ оплаты
  email: string;      // Email
  phone: string;      // Телефон
  address: string;    // Адрес доставки
}
```

### Модели данных

#### Класс `Product`

Работа с товарами.

**Поля:**  
* `products: IProduct[]` — все товары;  
* `selected: IProduct | null` — выбранный товар.

**Методы:**  
* `getProducts(): IProduct[]` — возвращает список товаров;  
* `getSelected(): IProduct | null` — возвращает выбранный товар;  
* `setSelected(product: IProduct): void` — сохраняет выбранный товар;  
* `setProducts(products: IProduct[]): void` — сохраняет список товаров;  
* `getProductById(id: string): IProduct | undefined` — находит товар по ID.

#### Класс `Cart`

Управление корзиной покупок.

**Поле:**  
* `items: IProduct[]` — товары в корзине.

**Методы:**  
* `getItems(): IProduct[]` — возвращает товары в корзине;  
* `hasItem(productId: string): boolean` — проверяет наличие товара;  
* `clear(): void` — очищает корзину;  
* `getCount(): number` — количество товаров;  
* `getTotal(): number` — общая стоимость;  
* `remove(productId: string): void` — удаляет товар;  
* `addItem(product: IProduct): void` — добавляет товар.

#### Класс `Customer`

Хранение и валидация данных покупателя.

**Поля:**  
* `payment: TPayment | null` — способ оплаты;  
* `address: string` — адрес;  
* `email: string` — email;  
* `phone: string` — телефон.

**Методы:**  
* `setCustomerInfo(data: ICustomer): void` — сохраняет данные покупателя;  
* `getCustomerInfo(): ICustomer` — возвращает данные;  
* `clearCustomerInfo(): void` — очищает данные;  
* `validateCustomerInfo(): boolean` — проверяет корректность данных.

### Слой коммуникации

#### Класс `ApiClient`

Взаимодействует с сервером через экземпляр `Api`.

**Конструктор:**  
```ts
constructor(api: IApi)
```
* `api` — объект, реализующий `IApi`.

**Методы:**  
1. `fetchProducts(): Promise<IProduct[]>`  
   * GET‑запрос к `/product/`;  
   * возвращает список товаров.

2. `sendOrder(orderData: IOrder): Promise<any>`  
   * POST‑запрос к `/order/`;  
   * отправляет данные заказа (покупатель + товары).