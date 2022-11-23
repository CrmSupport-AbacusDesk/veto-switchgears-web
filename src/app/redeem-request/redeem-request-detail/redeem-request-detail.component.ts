import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';
import {SessionStorage} from '../../_services/SessionService';
import {ChangeStatusRedeemComponent} from '../../redeem-request/change-status-redeem/change-status-redeem.component';
import { ProductImageModuleComponent } from '../../master//product-image-module/product-image-module.component';



@Component({
  selector: 'app-redeem-request-detail',
  templateUrl: './redeem-request-detail.component.html',
})
export class RedeemRequestDetailComponent implements OnInit {
  
  redeem_id;
  loading_list = false;
  
  last_page: number ;
  current_page = 1;
  search: any = '';
  filter:any = {};
  filtering : any = false;
  logs:any=[];
  giftImg:any='';
  uploadUrl:any;
  discriptions:any;
  shipped_type:any;
  
  constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router, public ses: SessionStorage,
    public matDialog: MatDialog,  public dialog: DialogComponent,  public alrt:MatDialog) {
      this.uploadUrl = db.uploadUrl
    }
    
    ngOnInit() {
      
      this.route.params.subscribe(params => {
        this.redeem_id = params['redeem_id'];
        
        if (this.redeem_id) {
          this.getReedamDetails();
          this.getRedeemList();
        }
      });
    }
    getData:any = {};
    coupan:any=[];
    getReedamDetails() {
      this.loading_list = true;
      this.db.post_rqst(  {'redeem_id':this.redeem_id}, 'offer/redeemDetail')
      .subscribe(d => {
        this.loading_list = false;
        console.log(d);
        this.getData = d.redeem;
        this.giftImg = d.redeem.gift_images;
        this.logs=d['redeem']['logs'];
        this.shipped_type = d['shipped_type']
        this.discriptions = d['redeem']['shipping_information']
        console.log("dis -======>",this.discriptions);
        
        console.log(this.logs);
        console.log('-------------------------- Gift Images --------------------');
        console.log(this.getData);
        console.log('------------------------------------------------------------');
        this.coupan = d.coupon;
      });
    }
    RedeemSatus() {
      this.db.post_rqst({ 'gift_status' : this.getData.gift_status, 'redeem_id' : this.getData.id, 'karigar_id':this.getData.karigar_id , 'coupon_points':this.getData.coupon_points , 'return_balance':this.getData.return_balance }, 'offer/redeemStatusChange')
      .subscribe(d => {
        console.log(d);
        this.getReedamDetails();
      });
    }

    redeem_coupon:any=[];
    getRedeemList() 
    {
      // this.loading_list = true;
      this.filter.date = this.filter.date  ? this.db.pickerFormat(this.filter.date) : '';
      this.filter.scan_date = this.filter.scan_date  ? this.db.pickerFormat(this.filter.scan_date) : '';
      this.filter.end_date = this.filter.end_date  ? this.db.pickerFormat(this.filter.end_date) : '';
      this.filter.redeem_date = this.filter.redeem_date  ? this.db.pickerFormat(this.filter.redeem_date) : '';
      if( this.filter.date  || this.filter.scan_date || this.filter.end_date)this.filtering = true;
      
      this.filter.redeem_id = this.redeem_id;
      this.db.post_rqst(  {  'filter': this.filter}, 'offer/couponRedeemList')
      .subscribe( d => {
        // this.loading_list = false;
        console.log(d);
        this.redeem_coupon = d.redeem_coupon.data;
      });
    }
    // scanned_coupon:any=[];
    // getScannedList() 
    //   {
    //     this.loading_list = false;
    //     this.filter.date = this.filter.date  ? this.db.pickerFormat(this.filter.date) : '';
    //     this.filter.used_date = this.filter.used_date  ? this.db.pickerFormat(this.filter.used_date) : '';
    //     this.filter.end_date = this.filter.end_date  ? this.db.pickerFormat(this.filter.end_date) : '';
    //     if( this.filter.date || this.filter.location_id || this.filter.used_date || this.filter.end_date)this.filtering = true;
    
    //     this.filter.redeem_id = this.redeem_id;
    //     this.db.post_rqst(  {  'filter': this.filter}, 'offer/couponScannedList')
    //       .subscribe( d => {
    //         console.log(d);
    
    //         this.current_page = d.scanned_coupon.current_page;
    //         this.last_page = d.scanned_coupon.last_page;
    //         this.scanned_coupon = d.scanned_coupon.data;
    
    //         // this.coupan_available = d.coupan_available;
    //         // this.coupon_scanned = d.coupon_scanned;
    //         // this.coupon_redeem = d.coupon_redeem;
    //         this.loading_list = true;
    
    //         console.log( this.scanned_coupon );
    //         console.log(d);
    
    
    //       });
    
    
    //   }
    
    
    
    // openDialog() {
    //   const dialogRef = this.dialog.open( GiftRedeemModuleComponent,
    
    //     {
    //       width: '724px',
    //       height:'400px',
    //       data: {}
    //     }
    //     );
    
    //     dialogRef.afterClosed().subscribe(result => {
    //       console.log(`Dialog result: ${result}`);
    //     });
    
    //   }
    
    
    //   openDialogs() {
    //     const dialogRef = this.dialog.open( TransferCodeComponent,
    
    //       {
    //         width: '400px',
    
    //         data: {}
    //       }
    //       );
    
    //       dialogRef.afterClosed().subscribe(result => {
    //         console.log(`Dialog result: ${result}`);
    //       });
    
    //     }
    step = 0;
    setStep(index: number) {
      this.step = index;
    }
    nextStep() {
      this.step++;
    }
    prevStep() {
      this.step--;
    }

    changeStatus(id)
        {
          const dialogRef = this.alrt.open(ChangeStatusRedeemComponent,
            {
              width: '500px',
              height:'500px',
            
            data: {
              'id' : id,
              'karigar_id':this.getData.karigar_id,
              'gift_status':this.getData.gift_status,
              'receive_status':this.getData.receive_status,
              'reason':this.getData.reject_reason,
              }
            });
            dialogRef.afterClosed().subscribe(result => {
              if( result )this.getReedamDetails();

            });

          }

          openDialog(reedem_id ,string) {
            // console.log(reedem_id);
            const dialogRef = this.alrt.open(ProductImageModuleComponent,
              {
                // width: '500px',
                // height:'500px',
                data: {
                  'reedem_id' : reedem_id,
                  'mode' : string,
                }
              });
              dialogRef.afterClosed().subscribe(result => {
                console.log(`Dialog result: ${result}`);
              });
            }

            openDialogImage(offer_gift_id ,string ) {
              const dialogRef = this.alrt.open(ProductImageModuleComponent,
                {
                  // width: '500px',
                  // height:'500px',
                  data: {
                    'id' : offer_gift_id,
                    'mode' : string,
                  }
                });
                dialogRef.afterClosed().subscribe(result => {
                  console.log(`Dialog result: ${result}`);
                });
              }
      
  }
  