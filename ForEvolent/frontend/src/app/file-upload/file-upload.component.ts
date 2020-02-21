import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ContactService } from "../contact.service";
@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  uploadForm: FormGroup;
  private router: any;
  constructor(private fb: FormBuilder, private contactservice: ContactService) {

  }

  ngOnInit() {
    this.uploadForm = this.fb.group({
      profile: ['']
    });
  }


  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.get('profile').setValue(file);
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('uploaded_image', this.uploadForm.get('profile').value);
    // console.log(formData);
    this.contactservice.upload_file(formData)
      .subscribe(data =>{
        alert("File Uploaded Successfully");
      });
  }
}
