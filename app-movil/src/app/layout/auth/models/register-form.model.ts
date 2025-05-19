
import { AbstractControl } from '@angular/forms';
import { compare, email, maxLength, prop, required } from '@rxweb/reactive-form-validators';

export class RegisterForm {

    @email({ message: 'Debe ser un correo electrónico' })
    @required({ message: 'Este campo es requerido' })
    public email: string = '';

    // @compare({ fieldName: 'confirmpassword', message: 'Validations.ThePasswordsAreNotEquals' })
    @required({ message: 'Este campo es requerido' })
    public password: string = '';

    // @compare({ fieldName: 'password', message: 'Validations.ThePasswordsAreNotEquals' })
    @required({ message: 'Este campo es requerido' })
    public confirmPassword: string = '';
}
