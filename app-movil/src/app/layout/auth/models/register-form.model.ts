
import { AbstractControl } from '@angular/forms';
import { compare, email, maxLength, prop, required } from '@rxweb/reactive-form-validators';

export class RegisterForm {

    @email({ message: 'Validations.MustBeEmail' })
    @required({ message: 'Validations.IsRequired' })
    public email: string = '';

    // @compare({ fieldName: 'confirmpassword', message: 'Validations.ThePasswordsAreNotEquals' })
    @required({ message: 'Validations.IsRequired' })
    public password: string = '';

    // @compare({ fieldName: 'password', message: 'Validations.ThePasswordsAreNotEquals' })
    @required({ message: 'Validations.IsRequired' })
    public confirmPassword: string = '';
}
