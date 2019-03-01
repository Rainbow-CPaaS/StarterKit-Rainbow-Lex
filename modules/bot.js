const logger = require('./logger')(__filename);

const EventEmitter = require('events');
const Lex = require( './lex');

class Bot {
    
    constructor( lexOptions ) {       
        this.emitter = new EventEmitter();
        this.lex = new Lex( lexOptions );
    }

    sendIM( user, message ) {
        this.emitter.emit( 'sendIM', {
            user: user, 
            message: message
        });
    }
    // Calls Lex on the message,
    // and display the message returned by lex if any
    async handleMessage(msg) {
        const { message, user } = msg;

        if( !user || !message ) {
            return;
        }

        logger.debug('running handleMessage %o', msg);

        try {
            const response = await this.lex.handleMessage( message, user );
            const intent = response.intentName;
            const entities = response.entities;
            
            logger.debug('handleMessage: %o %o %o %o', message, intent, entities, response.message );                   
            if( response.message ) {
                this.sendIM( user, response.message );
            }
        }
        catch( error ) {
            logger.error('error from lex.handleMessage: ', error);
            this.sendIM( user, "Sorry, I couldn't understand your request." );
        }

    }
}

module.exports = Bot;

