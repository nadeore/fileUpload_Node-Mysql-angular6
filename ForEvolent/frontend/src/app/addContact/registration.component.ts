import { Component, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ContactService } from "../contact.service";
import {Observable} from "rxjs";

class User{
  constructor(
    public id: string = '',
    public FirstName: string = '',
    public LastName: string = '',
    public Email: string = '',
    public PhoneNumber: string = '',
  ) {}
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  // It maintains list of Registrations
  user: User[] = [];
  // It maintains registration Model
  regModel: User;
  // It maintains registration form display status. By default it will be false.
  // user: User;
  submitted = false;
  submitType: string = 'Save';
  showNew: boolean;
  private selectedRow: number;
  constructor( private contactservice: ContactService) { }

  ngOnInit() {
    this.reloadData();
  }
  reloadData() {
    this.contactservice.getUserList().subscribe(Data => {
        this.user = Data;
      }, err => {
        console.log(err);
      });
  }

  onSave() {
    if (this.regModel.id) {
      this.contactservice.updateUser(this.regModel)
      .subscribe(data =>{
          alert("Data Updated SuccessFully");
          this.reloadData();
        });
      this.showNew = false;
    }else{
      this.contactservice.createUser(this.regModel)
        .subscribe(data =>{
          alert("Data Added SuccessFully");
          this.reloadData();
        });
      this.showNew = false;
    }

  }

  onEdit(id: number) {
    // alert(id);
    this.contactservice.getUser(id).subscribe(Data => {
      // console.log(Data);
      this.regModel = Data[0];
    }, err => {
      console.log(err);
    });
    this.submitType = 'Update';
    this.showNew = true;
  }

  onDelete(id: number) {
    // alert(id);
    const obj = {"id":id, "Status":"1"}
    this.contactservice.deleteUser(obj)
      .subscribe(
        data => {
          alert("Data Deleted SuccessFully");
          this.reloadData();
        },
        error => console.log(error));
  }

  onCancel() {
    this.showNew = false;
  }

  addNew() {
    // @ts-ignore
    this.regModel = new User();
    this.submitType = 'Save';
    this.showNew = true;
  }
}
