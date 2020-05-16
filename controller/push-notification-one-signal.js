const OneSignal = require('onesignal-node');

const client = new OneSignal.Client('3552b3b3-6e98-417e-a5a3-e73b723a6eb6',
    'OWM1OTNjMzEtYjhiYi00ZmIzLWI0N2UtMjcyMTVkZjYwN2My');

module.exports = {
    /**
     * @api {post} /push-notification Send push notification
     * @apiName SendPushNotification
     * @apiGroup PushNotification
     *
     * @apiHeader Authorization Bearer token
     *
     * @apiParam {String} title title of the message to send
     * @apiParam {String} body content of the message to send
     *
     * @apiSuccess (Success 200) {Boolean} success If it works ot not (true)
     * @apiSuccess (Success 200) {Object} message Response message
     *
     * @apiError (Error 422) {Boolean} success If it works ot not (false)
     * @apiError (Error 422) {Object} message Response message
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 201 Created
     *     {
     *       "success": true,
     *       "message": "projects/daan-covid19-d67c8/messages/4761779955531163224"
     *     }
     */
    sendMessage(req, res) {
        let title = req.body.title;
        let body = req.body.body;

        const notification = {
            headings: {
                'en': title,
                'fr': title,
            },
            contents: {
                'en': body,
                'fr': body,
            },
            included_segments: ['Subscribed Users'],
            //small_icon: 'ic_stat_onesignal_default',
            //large_icon: 'https://www.zupimages.net/up/20/20/jyik.png',
            //android_accent_color: '04baba'
        };

        client.createNotification(notification)
            .then(response => {
                res.status(200).send({
                    success: true,
                    message: response
                });
            })
            .catch(error => {
                res.status(422).send({
                    success: false,
                    message: error
                });
            });
    },
}
