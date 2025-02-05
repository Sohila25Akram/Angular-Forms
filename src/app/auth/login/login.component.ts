import {
  afterNextRender,
  Component,
  DestroyRef,
  inject,
  viewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime, of } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  // private form = viewChild<NgForm>('form');
  // private destroyRef = inject(DestroyRef);

  // constructor() {
  //   afterNextRender(() => {
  //     const savedData = localStorage.getItem('saved-login-values');
  //     if (savedData) {
  //       const loadedFormData = JSON.parse(savedData);
  //       const savedEmail = loadedFormData.email;
  //       setTimeout(() => {
  //         this.form()?.controls['email'].setValue(savedEmail);
  //       }, 1);
  //     }
  //     const subscription = this.form()
  //       ?.valueChanges?.pipe(debounceTime(500))
  //       .subscribe({
  //         next: (value) =>
  //           window.localStorage.setItem(
  //             'saved-login-values',
  //             JSON.stringify({ email: value.email })
  //           ),
  //       });
  //     this.destroyRef.onDestroy(() => subscription);
  //   });
  // }
  // onSubmit(formD: NgForm) {
  //   // const enteredEmail = formD.form.value.email;
  //   // const enteredPassword = formD.form.value.password;

  //   const enteredEmail = formD.form.controls['email'].value;
  //   const enteredPassword = formD.form.controls['password'].value;

  //   if (formD.invalid) {
  //     return;
  //   }

  //   console.log('Email: ' + enteredEmail);
  //   console.log('Password: ' + enteredPassword);
  //   formD.form.reset();
  // }

  // ==================================================================
  // Reactive Form

  private destroyRef = inject(DestroyRef);

  passwordContainsQuestionMark(control: AbstractControl) {
    if (control.value?.includes('?')) {
      return null;
    }
    return { doesNotContainQuestionMArk: true };
  }

  emailIsUnique(control: AbstractControl) {
    if (control.value !== 'test@example.com') {
      return of(null);
    }
    return of({ notUnique: true });
  }

  constructor() {
    afterNextRender(() => {
      const savedData = localStorage.getItem('saved-login-values');
      if (savedData) {
        const loadedFormData = JSON.parse(savedData);
        this.form.patchValue({ email: loadedFormData.email });
        // const savedEmail = loadedFormData.email;
        // setTimeout(() => {
        //   this.form()?.controls['email'].setValue(savedEmail);
        // }, 1);
      }
      const subscription = this.form?.valueChanges
        ?.pipe(debounceTime(500))
        .subscribe({
          next: (value) =>
            window.localStorage.setItem(
              'saved-login-values',
              JSON.stringify({ email: value.email })
            ),
        });
      this.destroyRef.onDestroy(() => subscription);
    });
  }

  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      asyncValidators: [this.emailIsUnique],
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(6),
        this.passwordContainsQuestionMark,
      ],
    }),
  });

  get passwordIsInvalid() {
    return (
      this.form.controls.password.touched &&
      this.form.controls.password.dirty &&
      this.form.controls.password.invalid
    );
  }

  onSubmit() {
    const enteredEmail = this.form.value.email;
    const enteredPassword = this.form.value.password;

    console.log('Email: ' + enteredEmail);
    console.log('Password: ' + enteredPassword);
  }
}
