import { Component, OnInit, Renderer2  } from '@angular/core';
import {SessionStorage} from '../_services/SessionService';
import {Router} from '@angular/router';
import {DatabaseService} from './../_services/DatabaseService';
import {DialogComponent} from './../dialog/dialog.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
    
    current_page : number = 1;
    unread_feedback : number = 0;
    filter: any = {};
    start:any = 0;
    pagelimit:any = 100;


    constructor(private renderer: Renderer2, private router: Router, public ses: SessionStorage, public db: DatabaseService , public dialog: DialogComponent) { }
    
    ngOnInit() {
        this.get_abacus_con();   
        this.updateUnreadFeeds();     
    }
    
    status:boolean = false;
    toggleHeader() {
        this.status = !this.status;
        if(this.status) {
            this.renderer.addClass(document.body, 'active');
        }
        else {
            this.renderer.removeClass(document.body, 'active');
        }
    }
    
    task_cn:any=0;
    get_abacus_con()
    {
        this.db.post_rqst( {}, 'abacusConnect')
        .subscribe(resp=> {
            console.log(resp);
            this.task_cn = resp.result.task_count;
        });
    }
    logout(): void {
        this.ses.logoutSession();
        this.router.navigate(['/']);
    }
    
    gotoAbacusConnect()
    {
        window.open("http://crmsupport.abacusdesk.com/projecttaskdetail/djBmSjN1bUZQT0hpOXZnZjB5Q2pPUT09","_blank");
    }
    
    updateUnreadFeeds = () => {
        this.filter.msg_status = 'Unread';
        this.filter.date = '';
        this.db.post_rqst({'filter': this.filter},'offer/feedback_list?page=' + this.current_page)
        .subscribe( resp => {
            console.log('----------------- Feedback Count --------------------');
            console.log(resp);
            console.log('------------------------------------------------------')
            this.unread_feedback =resp.unread_cn;
        });
    };
    // show_actions:any={};
}
