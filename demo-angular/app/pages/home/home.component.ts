import { Component, ChangeDetectorRef } from "@angular/core";
import * as Facebook from "nativescript-facebook";
import { NavigationService } from "../../services/navigation.service";
import { config } from "../../app.config";
import * as http from "tns-core-modules/http";
import * as appSettings from "tns-core-modules/application-settings";

@Component({
    selector: "home",
    moduleId: module.id,
    templateUrl: "home.component.html",
    styleUrls: ["home.component.css"]
})
export class HomeComponent {
    accessToken: string = appSettings.getString("access_token");
    userId: string;
    username: string;
    avatarUrl: string;

    constructor(private ref: ChangeDetectorRef, private navigationService: NavigationService) {
        // Get logged in user's info
        http.getJSON(config.FACEBOOK_GRAPH_API_URL + "/me?access_token=" + this.accessToken).then((res) => {
            this.username = res["name"];
            this.userId = res["id"];

            // Get logged in user's avatar
            // ref: https://github.com/NativeScript/NativeScript/issues/2176
            http.getJSON(config.FACEBOOK_GRAPH_API_URL + "/" + this.userId + "/picture?type=large&redirect=false&access_token=" + this.accessToken).then((res) => {
                this.avatarUrl = res["data"]["url"];
                this.ref.detectChanges();
            }, function (err) {
                alert("Error getting user info: " + err);
            });
        }, function (err) {
            alert("Error getting user info: " + err);
        });
    }

    onLogout(eventData: Facebook.LoginEventData) {
        if (eventData.error) {
            alert("Error during login: " + eventData.error);
        } else {
            appSettings.clear();
            this.navigationService.go(['login'], "slideRight");
        } 
    } 
    share(){
        let params = {
            success:true
        } 
     let    builder = { 
              contentUrl:'http://dantri.com/thoisu',
            peopleIds:'3453453453534535345',
        placeId:'34535345',
        pageId:'3453534534',
       ref:'http://vietnamnet.vn',
        hashtag:'#caigithe'
     }
     console.log('Da goi den ham ngoai') 

        // Facebook.shareContent( builder,params,(res)=>{ 
        //     console.log('callback o ngoai cung:->',res);
        //  });
        //100000095401346_2221464804533345?fields=full_picture,message,attachments
        Facebook.share('https://www.facebook.com/2029479200398574/posts/2208708965808929','https://scontent.fhan3-1.fna.fbcdn.net/v/t1.0-1/p160x160/943879_1141052305907939_4784385844732304607_n.jpg?_nc_cat=109&_nc_ht=scontent.fhan3-1.fna&oh=efb5dda8f4054e8be0099e42c6242986&oe=5C490BB3',(err,res)=>{
            if(err) return   console.log('Thong tin loi: ',err);
            return console.log('Thong tin thanh cong: ',res);
        })
    }

    logout() {
        Facebook.logout(() => {
            appSettings.clear();
            this.navigationService.go(['login'], "slideRight");
        });
    }

    public getCurrentAccessToken() {
        let accessToken = Facebook.getCurrentAccessToken();

        alert("Current access token: " + JSON.stringify(accessToken, null, '\t'));
    }
} 