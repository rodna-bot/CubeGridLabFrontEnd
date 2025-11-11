import {Component, inject} from '@angular/core';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField, MatInput, MatInputModule, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {UsuariosService} from '../../services/usuarios-service';
import {ActivatedRoute, Router} from '@angular/router';
import {Usuarios} from '../../model/usuarios';

@Component({
  selector: 'app-editar-usuario-component',
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatInputModule,
    MatButton,
    MatSnackBarModule
  ],
  templateUrl: './editar-usuario-component.html',
  styleUrl: './editar-usuario-component.css',
})
export class EditarUsuarioComponent {
  usuarioForm: FormGroup;
  fb = inject(FormBuilder);
  usuarioService = inject(UsuariosService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);
  route = inject(ActivatedRoute);
  usuarioCodigo: number;

  constructor() {
    this.usuarioForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordsMatchValidator });
  }

  ngOnInit(): void {
    // Capturar el parámetro 'codigo' del route
    this.route.paramMap.subscribe(params => {
      const codigoParam = params.get('codigo');
      if (codigoParam) {
        this.usuarioCodigo = +codigoParam;
        this.cargarUsuario(this.usuarioCodigo);
      }
    });
  }

  private passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  private cargarUsuario(codigo: number) {
    this.usuarioService.listar().subscribe({
      next: usuarios => {
        const usuario = usuarios.find(u => u.codigo === codigo);
        if (usuario) {
          this.usuarioForm.patchValue({
            username: usuario.username,
            password: usuario.password,
            confirmPassword: usuario.password
          });
        }
      },
      error: err => console.error('Error al cargar usuario:', err)
    });
  }

  onSubmit(): void {
    if (this.usuarioForm.invalid) {
      this.snackBar.open('Por favor completa correctamente todos los campos.', 'Cerrar', { duration: 3000 });
      return;
    }

    const usuario: Usuarios = {
      codigo: this.usuarioCodigo,
      username: this.usuarioForm.value.username,
      password: this.usuarioForm.value.password,
    };

    this.usuarioService.actualizar(usuario).subscribe({
      next: () => {
        this.snackBar.open('Usuario actualizado exitosamente.', 'Cerrar', { duration: 3000 });
        setTimeout(() => this.router.navigate(['/usuarios']), 2000);
        this.usuarioForm.reset();
      },
      error: err => {
        console.error(err);
        this.snackBar.open('Error al actualizar usuario.', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
