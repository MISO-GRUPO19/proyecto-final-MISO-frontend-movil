import { email, required } from '@rxweb/reactive-form-validators';


export class LoginRequest {

    @email({ message: 'Debe ser un correo electrónico' })
    @required({ message: 'Este campo es requerido' })
    public email: string = '';

    @required({ message: 'Este campo es requerido' })
    public password: string = '';
}

export class LoginResponse {
    public access_token: string = '';
    public refresh_token: string = '';
    public isCustomer: boolean = false;
    public user: UserResponse = new UserResponse();
}
export class UserResponse {
    public email: string = '';
    public id: string = '';
    public role: number = 0;

}