import { email, required } from '@rxweb/reactive-form-validators';


export class LoginRequest {

    @email({ message: 'Validations.MustBeEmail' })
    @required({ message: 'Validations.IsRequired' })
    public email: string = '';

    @required({ message: 'Validations.IsRequired' })
    public password: string = '';
}

