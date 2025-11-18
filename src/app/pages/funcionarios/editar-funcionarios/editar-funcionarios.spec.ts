import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { EditarFuncionarios } from './editar-funcionarios';
import { FuncionariosService } from '../../../core/services/funcionarios.service';

describe('EditarFuncionarios', () => {
  let component: EditarFuncionarios;
  let fixture: ComponentFixture<EditarFuncionarios>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;
  let mockFuncionariosService: jasmine.SpyObj<FuncionariosService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('1')
        }
      }
    };
    mockFuncionariosService = jasmine.createSpyObj('FuncionariosService', ['buscarPorId', 'atualizar']);

    mockFuncionariosService.buscarPorId.and.returnValue(of({
      id: 1,
      nome: 'Teste',
      email: 'teste@teste.com',
      sexo: 'MASCULINO',
      dataNascimento: '1990-01-01',
      cpf: '12345678900',
      telefones: [],
      cargo: 'MEDICO',
      especialidades: [],
      identificacao: '123',
      atendimentosIds: [],
      atendimentosComplicacaoIds: []
    } as any));

    await TestBed.configureTestingModule({
      imports: [EditarFuncionarios],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: FuncionariosService, useValue: mockFuncionariosService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarFuncionarios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
