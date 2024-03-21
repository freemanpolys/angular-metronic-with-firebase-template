import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalConfig, ModalComponent } from '../../_metronic/partials';
import Swal, {SweetAlertOptions} from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit{
  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };
  @ViewChild('modal') private modalComponent: ModalComponent;
  constructor() {}
  ngOnInit(): void {
    const fireUser = JSON.parse(localStorage.getItem('fire_user')!);
    const isEmailValNotif =  localStorage.getItem('email_validation_notif')
    if(!fireUser.emailVerified && isEmailValNotif != 'true') {
      Swal.fire({
        title: 'Email validation',
        text: 'Thank you for registering! To complete the registration process, please check your email inbox for a verification link. Click on the link provided to verify your email address and activate your account.',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Close'
      } as SweetAlertOptions).then((result) => {
        if (result.value) {
          //Do something here
        }
      }).finally(() => {
        localStorage.setItem('email_validation_notif','true')
      });
  }
  }

  async openModal() {
    return await this.modalComponent.open();
  }
}
