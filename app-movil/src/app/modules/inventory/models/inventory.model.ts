
import { AbstractControl } from '@angular/forms';
import { compare, email, maxLength, prop, required } from '@rxweb/reactive-form-validators';

export class ProductsList {
    public name: string = '';
    public barcode: string = '';
    public stock: number = 0;
    public price: number = 0;
    public category: string = '';
}
export class ProductsShoppingCar extends ProductsList {
    public quantity: number = 0;
}