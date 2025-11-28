import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UsuariosService} from '../../services/usuarios-service';
import {Router} from '@angular/router';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {Usuarios} from '../../model/usuarios';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {MatFormField, MatInput, MatInputModule, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-agregar-usuario-component',
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
  templateUrl: './agregar-usuario-component.html',
  styleUrl: './agregar-usuario-component.css',
})
export class AgregarUsuarioComponent {
  usuarioForm: FormGroup;
  fb = inject(FormBuilder);
  usuarioService = inject(UsuariosService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);

  constructor() {
    this.usuarioForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordsMatchValidator });
  }

  private passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.usuarioForm.invalid) {
      this.snackBar.open('Por favor completa correctamente todos los campos.', 'Cerrar', { duration: 3000 });
      return;
    }

    const usuario: Usuarios = {
      codigo: 0,
      username: this.usuarioForm.value.username,
      password: this.usuarioForm.value.password,
    };

    this.usuarioService.registrar(usuario).subscribe({
      next: () => {
        this.snackBar.open('Usuario registrado exitosamente.', 'Cerrar', { duration: 3000 });

        setTimeout(() => {
          this.router.navigate(['/usuarios']);
        }, 2000);

        this.usuarioForm.reset();
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error al registrar usuario.', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
