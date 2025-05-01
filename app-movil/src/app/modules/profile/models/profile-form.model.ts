
import { AbstractControl } from '@angular/forms';
import { compare, email, maxLength, prop, required } from '@rxweb/reactive-form-validators';

export class ProfileForm {

    @required({ message: 'Este campo es requerido' })
    public name: string = '';

    @required({ message: 'Este campo es requerido' })
    public lastName: string = '';

    @required({ message: 'Este campo es requerido' })
    public telphone: number = 0;

    @required({ message: 'Este campo es requerido' })
    public address: string = '';

    @required({ message: 'Este campo es requerido' })
    public country: string = '';
}
