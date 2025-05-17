import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsVideoComponent } from './details-video.component';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { VisitAnalysisResult } from '../models/details-video.model';
import { VisitsManager } from '../services/visits.service';

describe('DetailsVideoComponent', () => {
  let component: DetailsVideoComponent;
  let fixture: ComponentFixture<DetailsVideoComponent>;
  let mockVisitsManager: jasmine.SpyObj<VisitsManager>;

  const mockActivatedRoute = {
    paramMap: of({
      get: (key: string) => key === 'id' ? '12345' : null
    })
  };

  const mockResponse: VisitAnalysisResult = {
    result: {
      analisis: ['Punto 1', 'Punto 2'],
      recomendaciones: ['Recomendación A', 'Recomendación B']
    },
    status: 'PROCESADO',
    video_id: '12345'
  };

  beforeEach(async () => {
    mockVisitsManager = jasmine.createSpyObj('VisitsManager', ['getVisitAnalysis']);

    await TestBed.configureTestingModule({
      imports: [DetailsVideoComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: VisitsManager, useValue: mockVisitsManager }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsVideoComponent);
    component = fixture.componentInstance;
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe llamar fetchAnalysis y cargar datos correctamente', () => {
    mockVisitsManager.getVisitAnalysis.and.returnValue(of(mockResponse));

    fixture.detectChanges(); // llama a ngOnInit

    expect(component.videoId).toBe('12345');
    expect(mockVisitsManager.getVisitAnalysis).toHaveBeenCalledWith('12345');
    expect(component.analysisPoints.length).toBe(2);
    expect(component.recommendations.length).toBe(2);
    expect(component.status).toBe('PROCESADO');
    expect(component.isLoading).toBeFalse();
    expect(component.hasError).toBeFalse();
  });

  it('debe manejar errores de servicio correctamente', () => {
    mockVisitsManager.getVisitAnalysis.and.returnValue(throwError(() => new Error('Error')));

    fixture.detectChanges();

    expect(component.hasError).toBeTrue();
    expect(component.isLoading).toBeFalse();
  });
});

describe('DetailsVideoComponent sin ID en la ruta', () => {
  let component: DetailsVideoComponent;
  let fixture: ComponentFixture<DetailsVideoComponent>;

  beforeEach(async () => {
    const mockVisitsManager = jasmine.createSpyObj('VisitsManager', ['getVisitAnalysis']);
    const routeWithoutId = {
      paramMap: of({
        get: () => null
      })
    };

    await TestBed.configureTestingModule({
      imports: [DetailsVideoComponent],
      providers: [
        { provide: ActivatedRoute, useValue: routeWithoutId },
        { provide: VisitsManager, useValue: mockVisitsManager }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe marcar error si no hay id en la ruta', () => {
    expect(component.hasError).toBeTrue();
    expect(component.isLoading).toBeFalse();
  });
});
