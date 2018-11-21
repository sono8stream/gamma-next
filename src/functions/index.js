const functions = require('firebase-functions');
const next = require("next");
const routes = require('./routes');
const admin = require('firebase-admin');
admin.initializeApp();

var dev = process.env.NODE_ENV !== "production";
var app = next({ dev, conf: { distDir: "next" } });
var handle = routes.getRequestHandler(app);

exports.next = functions.https.onRequest((req, res) => {
  console.log("File: " + req.originalUrl);
  return app.prepare().then(() => handle(req, res));
});

exports.generateNotification = functions.database.ref('/blogs/{pushId}')
  .onWrite((change, context) => {
    let val = change.after.val();
    let beforeVal = change.before.val();
    if (!val || val.accessibility !== '公開'
      /*|| (beforeVal && val.accessibility === beforeVal.accessibility))*/) {
      console.log('interrupt');
      return null;
    }
    let pushId = context.params.pushId;

    return new Promise((resolve, reject) => {
      let url =
        `https://gamma-creators.firebaseapp.com/blogs/show/${pushId}`;
      admin.database().ref(`/notifications/blogs/${pushId}`)
        .set({ url: url, state: val.accessibility })
        .then(() => {
          admin.database().ref('update').set(true)
            .then(resolve).catch(reject);
        }).catch(reject);
    });
  });

exports.removeNotification = functions.database.ref('/update')
  .onUpdate((change, context) => {
    let val = change.after.val();
    if (val) {
      return null;
    }
    else {
      return new Promise((resolve, reject) => {
        admin.database().ref('/notifications').set(null)
          .then(resolve).catch(reject);
      });
    }
  });