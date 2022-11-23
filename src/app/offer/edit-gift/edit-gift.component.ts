import { Component,Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';

@Component({
  selector: 'app-edit-gift',
  templateUrl: './edit-gift.component.html',
})
export class EditGiftComponent implements OnInit {
  
  data: any = [];
  loading_list:any = false;
  mode:any;
  savingData = false;
  gift_id;
  offer_id;
  total_redeem:any;
  image = new FormData();
  uploadUrl:any=''
  constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router,  public dialog: DialogComponent,
    @Inject(MAT_DIALOG_DATA) public lead_data: any, public dialogRef: MatDialogRef<EditGiftComponent>) {
      
      this.data.id = lead_data.id;
      this.data.total_redeem = lead_data.total_redeem;
      this.offer.offer_id=lead_data.offer_id;
      console.log(this.data.id);
      this.total_redeem =  this.data.total_redeem;
    }
    ngOnInit() {
      this.uploadUrl = this.db.uploadUrl;
      this.giftDetail();
    }
    
    offer:any = {};
    giftDetail() {
      if(!this.data.id)return;
      this.loading_list = true;
      this.db.post_rqst(  {'id' : this.data.id } , 'offer/giftEditDetail')
      .subscribe( d => {
        this.loading_list = false;
        console.log( d );
        this.offer = d.gift;
      });
    }
    
    numeric_Number(event: any) {
      const pattern = /[0-9\+\-\ ]/;
      let inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode != 8 && !pattern.test(inputChar)) {
        event.preventDefault();
      }
    }
    
    addoffer(form:any)
    {
      this.offer.id=this.data.id;
      this.offer.created_by=this.db.datauser.id;
      console.log(this.offer.image);
      console.log(this.offer.gift_image);
      
      if( !this.offer.gift_image ){
        this.dialog.warning('Required Gift Image!');
        return;
      }
      this.savingData = true;
      this.db.post_rqst( { 'id': this.data.id , 'offer':this.offer }, 'offer/giftEdit')
      .subscribe( d => {
        if(this.data.id )
        {
          this.dialog.success('Gift Successfully Update!');
        }
        else
        {
          this.dialog.success('Gift Successfully Added!');
        }
        
        this.offer.id = d['offer_id'];
        console.log(this.offer.id);
        
        if(this.image)
        {
          this.image.append("offer_id",this.offer.id);
          this.db.fileData(this.image,"giftImage")
          .subscribe(resp=>{
            console.log(resp);
          })
        }
        
        this.savingData = false;
        this.dialogRef.close(true);
        console.log( d );
      });
    }
    
    onNoClick(): void{
      this.dialogRef.close();
    }
    
    tmpimg:any;
    onUploadChange2(data: any) {
      let files = data.target.files[0];
      if (files) 
      {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.tmpimg = e.target.result;
          this.offer.gift_image = e.target.result;
        }
        reader.readAsDataURL(files);
      }
      this.image.append("image",data.target.files[0],data.target.files[0].name);
    }
  }
  