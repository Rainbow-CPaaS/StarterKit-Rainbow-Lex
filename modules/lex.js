const logger = require('./logger')(__filename);

const AWS = require('aws-sdk');

class Lex {
    constructor(lexOptions) {       
        AWS.config.region = lexOptions.awsRegion || 'eu-west-1';
        let credentials;
        if (lexOptions.awsAccessKeyId && lexOptions.awsSecretAccessKey) {
            credentials = new AWS.Credentials(lexOptions.awsAccessKeyId, lexOptions.awsSecretAccessKey);
            logger.info('using environment keys to authenticate');
        }
        else {
            credentials =  new AWS.SharedIniFileCredentials({ profile: 'default' });
            logger.info('using credentials file to authenticate');
        }
        AWS.config.credentials = credentials;
        this.botAlias = lexOptions.botAlias || 'BookTrip';
        this.botName = lexOptions.botName || 'BookTrip';    
        this.lexRuntime = new AWS.LexRuntime();    
    }

    handleMessage(message, user) {
        // LEX comes back with an object formatted like this: 
        //  { intentName: 'BookHotel',
        //   slots:
        //    { CheckInDate: null,
        //      Location: null,
        //      Nights: null,
        //      RoomType: null },
        //   sessionAttributes: {},
        //   message: 'What city will you be staying in?',
        //   messageFormat: 'PlainText',
        //   dialogState: 'ElicitSlot',
        //   slotToElicit: 'Location' }
    
        // use the rainbow jid as a "userid" for lex, but replace @ with _ 
        // as lex doesn't accept user ids with the "at" sign.
        const userId = user.replace( '@', '_');
    
        return new Promise( (resolve,reject ) => {
            const params = {
                botAlias: this.botAlias,
                botName: this.botName,
                userId:  userId, 
                sessionAttributes: {},
                inputText: message
            };
    
            this.lexRuntime.postText(params, (err, data) => {
                if (err) {
                    console.log(err, err.stack);
                    return reject( err )
                }
                if (data) {
                    console.log(data);
                    const response = {
                        intent: data.intentName,
                        entities: {...data.slots},
                        message: data.message 
                    };
                    return resolve( response );
                }
            });    
        })
    }
}

module.exports = Lex;
