
import { AbstractControl } from '@angular/forms';
import { compare, email, maxLength, prop, required } from '@rxweb/reactive-form-validators';

export class ProfileForm {

    @required({ message: 'Validations.IsRequired' })
    public name: string = '';

    @required({ message: 'Validations.IsRequired' })
    public lastName: string = '';

    @required({ message: 'Validations.IsRequired' })
    public telphone: string = '';

    @required({ message: 'Validations.IsRequired' })
    public address: string = '';

    @required({ message: 'Validations.IsRequired' })
    public country: string = '';
}
