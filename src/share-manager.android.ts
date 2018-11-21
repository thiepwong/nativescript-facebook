import * as application from "tns-core-modules/application";
declare let com: any;
let shareCallback;
let androidApplication;
let _act: android.app.Activity; 

export function _registerShareCallback(callback: Function) {
    let onShareCallback = com.facebook.CallbackManager.Factory.create();
    shareCallback.registerCallback(onShareCallback, new com.facebook.FacebookCallback({ 
        onSuccess: function (result) {
            callback(null, {
                code:200,
                msg:'Post success shared!'
            });
        },
        onCancel: function () {
            callback({
                code:504,
                msg:'Cancel post share!'
            });
        },
        onError: function (e) {
            let errorMessage = "Error with Facebook";
            if (e.getErrorMessage) {
                errorMessage += ": " + e.getErrorMessage();
            }
            else if (e.getErrorCode) {
                errorMessage += ": Code " + e.getErrorCode();
            }
            else {
                errorMessage += ": " + e;
            }
            callback({
                code:'500',
                msg:'Facebook post share error!',
                detail: errorMessage
            });
        } 
    }));

    let onActivityResult = (args) => {
        if (onShareCallback.onActivityResult(args.requestCode, args.resultCode, args.intent)) {
            unsubscribe();
        }
    };

    let unsubscribe = () => {
        application.android.off(application.AndroidApplication.activityResultEvent, onActivityResult);
    };

    application.android.on(application.AndroidApplication.activityResultEvent, onActivityResult);
}
 
export function share(content: any,imgThumnal:any, callback: Function) { 
    _act =  application.android.foregroundActivity || application.android.startActivity;
    let builder = new com.facebook.share.model.ShareLinkContent.Builder().setContentDescription('Da set content').setContentTitle('Set tieu de').setContentUrl(android.net.Uri.parse(content)).build();
    // builder.setContentTitle('Thon gbao moi');
    // builder.setImageUrl(android.net.Uri.parse(imgThumnal))
    // builder.setContentDescription('Thong bao moi tu facebook chinh');
    // builder.setContentUrl(android.net.Uri.parse(content))
    // var result = builder.build();
    shareCallback = new com.facebook.share.widget.ShareDialog(_act);
    _registerShareCallback(callback);
    shareCallback.show(builder);
}

export function shareContent(content, params, callback) {

    // let builder =  new com.facebook.share.model.ShareContent.Builder();

    // builder.setContentUrl(content.contentUrl);
    // builder.setPeopleIds(content.peopleIds);
    // builder.setPlaceId(content.placeId);
    // builder.setPageId(content.pageId);
    // builder.setRef(content.ref);
    // builder.setShareHashtag(content.hashtag);

    // var _content = builder.build();
    // var activity = application.android.foregroundActivity || application.android.startActivity;
    // var mCallbackManager = com.facebook.CallbackManager.Factory.create();

    // application.android.on("activityResult", function(eventData) {

    //     if(com.facebook.FacebookSdk.isFacebookRequestCode(eventData.requestCode))
    //         mCallbackManager.onActivityResult(eventData.requestCode, eventData.resultCode, eventData.intent);
    //     else
    //         console.log(eventData.requestCode)
    // })

    //     var shareDialog = new com.facebook.share.widget.ShareDialog(activity);

    //   // callback(shareDialog);
    //     var shareCallback = new com.facebook.FacebookCallback({
    //         onSuccess: function (result) {
    //             // debug("###### FACEBOOK DIALOG SUCCESS")
    //             if(params && params.success)
    //                 params.success()
    //         },
    //         onCancel: function () {
    //             // debug("###### FACEBOOK DIALOG CANCEL")
    //             if(params && params.cancel)
    //                 params.cancel()
    //         },
    //         onError: function (e) {
    //             // debug("###### FACEBOOK DIALOG ERROR: " + e)
    //             if(params && params.error)
    //                 params.error(e)
    //         }
    //     })

    //     //callback(shareCallback);
    //      shareDialog.registerCallback(mCallbackManager, shareCallback);
    //     shareDialog.show(_content)        
}
