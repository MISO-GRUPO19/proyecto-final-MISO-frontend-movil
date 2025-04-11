import { email, required } from '@rxweb/reactive-form-validators';


export class LoginRequest {

    @email({ message: 'Validations.MustBeEmail' })
    @required({ message: 'Validations.IsRequired' })
    public email: string = '';

    @required({ message: 'Validations.IsRequired' })
    public password: string = '';
}

export class LoginResponse {
    public access_token: string = '';
    public refresh_token: string = '';
    public user: UserResponse = new UserResponse();
}
export class UserResponse {
    public email: string = '';
    public id: string = '';
    public role: number = 0;
}