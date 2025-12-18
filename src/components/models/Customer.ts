import { ICustomer, TPayment } from "./../../types";
import { EventEmitter } from '../base/Events';

export class Customer extends EventEmitter {
  private _payment: TPayment | null = null;
  private _address: string = "";
  private _email: string = "";
  private _phone: string = "";

  constructor() {
    super();
  }

  setCustomerInfo(data: ICustomer): void {
    this._payment = data.payment;
    this._address = data.address;
    this._email = data.email;
    this._phone = data.phone;

    this.emit("customer:changed", { customer: this.getCustomerInfo() });
  }

  set payment(value: TPayment) {
    this._payment = value;
    this.emit("customer:field-changed", {
      field: "payment",
      value,
    });
    this.emit("customer:changed", { customer: this.getCustomerInfo() });
  }

  set address(value: string) {
    this._address = value;
    this.emit("customer:field-changed", {
      field: "address",
      value,
    });
    this.emit("customer:changed", { customer: this.getCustomerInfo() });
  }

  set email(value: string) {
    this._email = value;
    this.emit("customer:field-changed", {
      field: "email",
      value,
    });
    this.emit("customer:changed", { customer: this.getCustomerInfo() });
  }

  set phone(value: string) {
    this._phone = value;
    this.emit("customer:field-changed", {
      field: "phone",
      value,
    });
    this.emit("customer:changed", { customer: this.getCustomerInfo() });
  }

  getCustomerInfo(): ICustomer {
    return {
      payment: this._payment as TPayment,
      address: this._address,
      email: this._email,
      phone: this._phone,
    };
  }

  clearCustomerInfo(): void {
    this._payment = null;
    this._address = "";
    this._email = "";
    this._phone = "";

    this.emit("customer:cleared", {});
    this.emit("customer:changed", { customer: this.getCustomerInfo() });
  }

  validateCustomerInfo(): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!this._payment) errors.payment = "Не указан способ оплаты";
    if (!this._email) errors.email = "Укажите электронную почту";
    if (!this._phone) errors.phone = "Введите номер телефона";
    if (!this._address) errors.address = "Необходим адрес доставки";

    return errors;
  }
}
