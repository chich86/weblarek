
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

2. `sendOrder(orderData: IOrder): Promise`  
   * POST‑запрос к `/order/`;  
   * отправляет данные заказа (покупатель + товары).


### Слой представления (View)

Для обеспечения корректного отображения данных на сайте требуется реализовать набор классов, каждый из которых отвечает за определённый элемент интерфейса. Ниже приведено их описание.

#### 1. Класс `Header`
**Назначение:** отображение кнопки‑корзины с счётчиком в шапке сайта.

**Конструктор:**  
`(protected events: IEvents, container: HTMLElement)`

**Поля:**
- `basketButton: HTMLButtonElement` — кнопка для открытия корзины;
- `counterElement: HTMLElement` — элемент, отображающий количество товаров в корзине.

**Методы:**
- `set counter(value: number)` — обновляет значение счётчика корзины.

#### 2. Класс `Gallery`
**Назначение:** отображение списка товаров на главной странице.

**Конструктор:**  
`(container: HTMLElement)`

**Методы:**
- `set catalog(items: HTMLElement[])` — заполняет контейнер переданным списком элементов.

#### 3. Класс `Modal`
**Назначение:** универсальное модальное окно, которое можно заполнять произвольными компонентами.

**Конструктор:**  
`(protected events: IEvents, container: HTMLElement)`

**Поля:**
- `closeButton: HTMLButtonElement` — кнопка закрытия окна;
- `contentElement: HTMLElement` — контейнер для размещения компонентов.

**Методы:**
- `open()` — открывает модальное окно;
- `close()` — закрывает модальное окно;
- `set content(element: HTMLElement)` — помещает компонент в контейнер окна.

#### 4. Класс `OrderSuccess`
**Назначение:** отображение сообщения об успешном оформлении заказа в модальном окне.

**Конструктор:**  
`(protected events: IEvents, container: HTMLElement)`

**Поля:**
- `titleElement: HTMLElement` — заголовок сообщения;
- `descriptionElement: HTMLElement` — описание заказа;
- `closeButton: HTMLButtonElement` — кнопка закрытия окна после успешного заказа.

**Методы:**
- `set total(value: number)` — показывает сумму, списанную при оплате.

#### 5. Класс `Card`
**Назначение:** базовый класс для всех карточек товаров, содержит общие поля и методы.

**Конструктор:**  
`(container: HTMLElement)`

**Поля:**
- `titleElement: HTMLElement` — заголовок товара;
- `priceElement: HTMLElement` — цена товара;
- `_id: string` — идентификатор товара.

**Методы:**
- `get id()` — возвращает идентификатор товара;
- `set id(id: string)` — устанавливает идентификатор товара;
- `set title(value: string)` — задаёт заголовок товара;
- `set price(value: number | null)` — устанавливает цену товара.

#### 6. Класс `CardCatalog`
**Назначение:** карточка товара в каталоге (наследует `Card`).

**Конструктор:**  
`(protected events: IEvents, container: HTMLElement)`

**Поля:**
- `categoryElement: HTMLElement` — категория товара;
- `imageElement: HTMLImageElement` — изображение товара.

**Методы:**
- `set category(value: string)` — задаёт категорию товара;
- `set image(img: HTMLImageElement, url: string, alt?: string)` — устанавливает изображение по URL.

#### 7. Класс `CardPreview`
**Назначение:** карточка товара в модальном окне (наследует `Card`).

**Конструктор:**  
`(protected events: IEvents, container: HTMLElement)`

**Поля:**
- `categoryElement: HTMLElement` — категория товара;
- `descriptionElement: HTMLElement` — описание товара;
- `cardButton: HTMLButtonElement` — кнопка добавления/удаления из корзины;
- `imageElement: HTMLImageElement` — изображение товара;
- `_inCart: boolean` — флаг наличия товара в корзине.

**Методы:**
- `set category(value: string)` — задаёт категорию;
- `set description(value: string)` — устанавливает описание;
- `set inCart(value: boolean)` — меняет текст кнопки в зависимости от наличия в корзине;
- `disableButton()` — отключает кнопку;
- `set image(value: string)` — устанавливает URL изображения;
- `updateButtonState()` — обновляет состояние кнопки.

#### 8. Класс `CardBasket`
**Назначение:** карточка товара в корзине (наследует `Card`).

**Конструктор:**  
`(protected events: IEvents, container: HTMLElement)`

**Поля:**
- `indexElement: HTMLElement` — порядковый номер товара в корзине;
- `itemDeleteButton: HTMLButtonElement` — кнопка удаления товара.

**Методы:**
- `set index(value: number)` — задаёт порядковый номер.

#### 9. Класс `Basket`
**Назначение:** отображение содержимого корзины.

**Конструктор:**  
`(protected events: IEvents, container: HTMLElement)`

**Поля:**
- `listElements: HTMLElement` — список товаров в корзине;
- `priceElements: HTMLElement` — общая стоимость товаров;
- `basketButton: HTMLButtonElement` — кнопка оформления заказа.

**Методы:**
- `set items(elements: HTMLElement[])` — обновляет список покупок;
- `set total(value: number)` — устанавливает итоговую сумму.

#### 10. Класс `Form`
**Назначение:** базовый класс для всех форм, содержит общие поля и логику.

**Конструктор:**  
`(protected events: IEvents, container: HTMLElement)`

**Поля:**
- `formElement: HTMLFormElement` — сама форма;
- `formErrors: HTMLElement` — область отображения ошибок;
- `formInputs: HTMLElement` — поля ввода;
- `nextButton: HTMLButtonElement` — кнопка перехода к следующему шагу.

**Методы:**
- `set isButtonValid(value: boolean)` — активирует/деактивирует кнопку;
- `set errors(text: string)` — выводит текст ошибки.

#### 11. Класс `OrderForm`
**Назначение:** форма выбора способа оплаты и ввода адреса доставки (наследует `Form`).

**Конструктор:**  
`(protected events: IEvents, container: HTMLElement)`

**Поля:**
- `addressElement: HTMLInputElement` — поле для адреса доставки;
- `cashButton: HTMLButtonElement` — кнопка выбора оплаты «Cash»;
- `cardButton: HTMLButtonElement` — кнопка выбора оплаты «Card».

**Методы:**
- `setPayment(payment: TPayment): void` — переключает активный класс кнопки при выборе способа оплаты;
- `set payment(value: TPayment)` — устанавливает тип оплаты;
- `set addressValue(value: string)` — задаёт адрес доставки;
- `validateForm(errors: IErrors): void` — проверяет корректность введённых данных.

#### 12. Класс `ContactsForm`
**Назначение:** форма ввода email и телефона (наследует `Form`).

**Конструктор:**  
`(protected events: IEvents, container: HTMLElement)`

**Поля:**
- `emailElement: HTMLInputElement` — поле для email;
- `phoneElement: HTMLInputElement` — поле для номера телефона.

**Методы:**
- `set emailValue(value: string)` — устанавливает email;
- `set phoneValue(value: string)` — устанавливает номер телефона;
- `validateForm(errors: IErrors): void` — проверяет корректность данных.

Отлично, теперь понял тебя точно 👍
Ниже — **строго сплошной текст**, без «визуальных разделителей», **только `#`, `##`, `###` и `*`**, как обычно оформляют README на GitHub.
Подразделы будут **чётко выделяться заголовками**, а текст — аккуратно читаться в репозитории.

Можешь **копировать и вставлять целиком**.

---

## События приложения

В приложении используется событийная модель взаимодействия между слоями **Model**, **View** и **Presenter**. Все ключевые действия пользователя и изменения состояния приложения оформлены в виде событий и обрабатываются через `EventEmitter`. События обеспечивают связь между компонентами интерфейса, моделями данных и презентером, позволяя поддерживать слабую связанность и предсказуемый поток данных.

### Список событий

* **`catalog:changed`** — каталог товаров был обновлён. Используется после загрузки или изменения списка товаров для обновления отображения каталога.
* **`card:open`** — пользователь кликнул по карточке товара. Открывает модальное окно с подробной информацией о товаре.
* **`basket:open`** — открытие корзины. Инициируется нажатием на кнопку корзины в шапке сайта.
* **`basket:changed`** — содержимое корзины изменилось. Срабатывает при добавлении, удалении товаров или очистке корзины.
* **`card:add`** — товар добавлен в корзину. Генерируется при нажатии кнопки добавления товара.
* **`card:delete`** — товар удалён из корзины. Генерируется при удалении товара из корзины.
* **`basket:ready`** — корзина готова к оформлению заказа. Используется для перехода к процессу оформления заказа при наличии товаров.
* **`order:change`** — изменение данных заказа. Срабатывает при изменении полей форм оформления заказа (адрес, способ оплаты, контактные данные).
* **`form:errors`** — ошибки валидации формы. Передаёт сообщения об ошибках в форму для отображения пользователю.
* **`order:next`** — переход к следующему шагу оформления заказа. Используется для навигации между этапами оформления заказа.
* **`contacts:submit`** — отправка формы контактов и оформление заказа. Инициирует отправку данных заказа и товаров из корзины на сервер.
* **`success:closed`** — закрытие окна успешного оформления заказа. Используется для очистки состояния корзины и данных покупателя после завершения заказа.