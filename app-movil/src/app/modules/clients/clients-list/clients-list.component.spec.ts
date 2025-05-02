import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ClientsListComponent } from './clients-list.component';
import { ClientsManager } from '../services/clients.service';
import { ClientsList, Store } from '../models/clients.model';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('ClientsListComponent', () => {
    let component: ClientsListComponent;
    let fixture: ComponentFixture<ClientsListComponent>;
    let mockClientsManager: jasmine.SpyObj<ClientsManager>;

    const mockClients: ClientsList[] = [
        {
            firstName: 'Ana',
            lastName: 'Gómez',
            email: 'ana@example.com',
            country: 'Colombia',
            address: 'Calle 123',
            phoneNumber: '3001234567',
            stores: [
                { store_name: 'Tienda Norte', store_address: 'Calle 1' },
                { store_name: 'Tienda Sur', store_address: 'Carrera 2' }
            ],
            id: '1'
        },
        {
            firstName: 'Luis',
            lastName: 'Martínez',
            email: 'luis@example.com',
            country: 'México',
            address: 'Avenida 45',
            phoneNumber: '5559876543',
            stores: [],
            id: '2'
        }
    ];

    beforeEach(waitForAsync(() => {
        const clientsServiceSpy = jasmine.createSpyObj('ClientsManager', ['getClients']);

        TestBed.configureTestingModule({
            imports: [ClientsListComponent, CommonModule, FormsModule],
            providers: [{ provide: ClientsManager, useValue: clientsServiceSpy }]
        }).compileComponents();

        mockClientsManager = TestBed.inject(ClientsManager) as jasmine.SpyObj<ClientsManager>;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ClientsListComponent);
        component = fixture.componentInstance;
    });

    it('debería crearse correctamente', () => {
        expect(component).toBeTruthy();
    });

    it('debería cargar los clientes correctamente', () => {
        mockClientsManager.getClients.and.returnValue(of(mockClients));
        component.ngOnInit();
        expect(mockClientsManager.getClients).toHaveBeenCalled();
        expect(component.clients.length).toBe(2);
        expect(component.filteredClients.length).toBe(2);
    });

    it('debería manejar errores al cargar los clientes', () => {
        const errorResponse = { error: { mssg: 'Error de autenticación' } };
        mockClientsManager.getClients.and.returnValue(throwError(() => errorResponse));
        component.ngOnInit();
        expect(component.error).toBe('Error de autenticación');
    });

    it('debería filtrar correctamente por nombre completo', () => {
        component.clients = mockClients;
        component.search = 'ana gómez';
        component.filtrarClientes();
        expect(component.filteredClients.length).toBe(1);
        expect(component.filteredClients[0].email).toBe('ana@example.com');
    });

    it('debería filtrar correctamente por país', () => {
        component.clients = mockClients;
        component.search = 'méxico';
        component.filtrarClientes();
        expect(component.filteredClients.length).toBe(1);
        expect(component.filteredClients[0].country).toBe('México');
    });

    it('debería filtrar correctamente por teléfono', () => {
        component.clients = mockClients;
        component.search = '300';
        component.filtrarClientes();
        expect(component.filteredClients.length).toBe(1);
        expect(component.filteredClients[0].phoneNumber).toBe('3001234567');
    });

    it('debería devolver lista vacía si no hay coincidencias', () => {
        component.clients = mockClients;
        component.search = 'no existe';
        component.filtrarClientes();
        expect(component.filteredClients.length).toBe(0);
    });

    it('debería incluir tiendas asociadas al cliente', () => {
        component.clients = mockClients;
        const ana = component.clients.find(c => c.firstName === 'Ana');
        expect(ana?.stores.length).toBe(2);
        expect(ana?.stores[0].store_name).toBe('Tienda Norte');
    });
});
