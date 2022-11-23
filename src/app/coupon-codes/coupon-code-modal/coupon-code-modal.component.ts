import { Component, Inject, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/_services/DatabaseService';

import { DialogComponent } from 'src/app/dialog/dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-coupon-code-modal',
    templateUrl: './coupon-code-modal.component.html'
})
export class CouponCodeModalComponent implements OnInit {
    Couponform:any ={};
    userId:any;
    target:any ={};
    couponData:any ={}
    
    // public dialog: DialogComponent, @Inject(MAT_DIALOG_DATA) public data: any
    constructor(public db: DatabaseService, public dialog: DialogComponent, @Inject(MAT_DIALOG_DATA) public data:any, public alrt:MatDialog,public dialogRef: MatDialogRef<CouponCodeModalComponent>) { 
        this.target= data;
        this.couponData = data.data;
        console.log( this.target.target);
        this.userId= db.datauser.id;
        console.log(this.userId);
    }
    
    ngOnInit()
    {  
        
    }
    
    saveCoupon(){
        this.Couponform;
        if(this.Couponform.qr_code == undefined){
            this.dialog.warning('Coupon codes are required');
            return;
        }
        else if (this.Couponform.dealer_name == undefined){
            this.dialog.warning('Dealer name is required');
            return;
        }
        else if (this.Couponform.dealer_address == undefined){
            this.dialog.warning('Address is required');
            return;
        }
        
        this.db.insert_rqst( {'login_id':this.userId, 'qr_code':this.Couponform.qr_code, 'dealer_name':this.Couponform.dealer_name, 'dealer_address':this.Couponform.dealer_address   }, 'offer/companyCoupon')
        .subscribe( d => {
            console.log(d);
            
            if(d.status == "SUCCESS"){
                this.dialog.success('Bar code has been successfully scanned.');
                this.dialogRef.close();
            }
            
        });
    }
    
    
    
    close(){
        if(this.Couponform.qr_code || this.Couponform.dealer_name || this.Couponform.dealer_address){
            this.dialog.close('Karigar')
            .then((result) => {
                if(result)
                {
                    this.dialogRef.close();
                }
            });
        }

        else if(!this.Couponform.qr_code || !this.Couponform.dealer_name || !this.Couponform.dealer_address){
            this.dialogRef.close();
        }
        else{
           
        }
    }
    
}
