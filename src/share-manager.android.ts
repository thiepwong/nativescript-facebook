import * as application from "tns-core-modules/application";
declare let com: any;
let shareCallback;
let androidApplication;
let _act: android.app.Activity; 


export function _registerShareCallback(callback: Function) {
    let onShareCallback = com.facebook.CallbackManager.Factory.create();
    _act = androidApplication.startActivity || androidApplication.foregroundActivity;
    shareCallback.registerCallback(onShareCallback, new com.facebook.FacebookCallback({

        onSuccess: function (result) {
            callback(null, result);
        },
        onCancel: function () {
            callback(new Error('canceled'));

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
            callback(new Error(errorMessage));
        }

    }));

    let onActivityResult = (args) => {
        if (onShareCallback.onActivityResult(args.requestCode, args.resultCode, args.intent)) {
            unsubscribe();
        }
    };

    let unsubscribe = () => {
        androidApplication.off(application.AndroidApplication.activityResultEvent, onActivityResult);
    };

    androidApplication.on(application.AndroidApplication.activityResultEvent, onActivityResult);
}


export function share(content: any, callback: Function) {
    let builder = new com.facebook.share.model.ShareLinkContent.Builder()
    builder.setContentTitle('Thon gbao moi');
    builder.setContentDescription('Thong bao moi tu facebook chinh');
    builder.setContentUrl(android.net.Uri.parse(content))
    var result = builder.build();

    var activity = application.android.foregroundActivity || application.android.startActivity;
    var shareDialog = new com.facebook.share.widget.ShareDialog(activity);
    _registerShareCallback(callback);
    shareDialog.show(result);

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
