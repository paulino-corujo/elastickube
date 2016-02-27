import { EventEmitter } from 'events';

function eventemitterConfiguration() {
    EventEmitter.defaultMaxListeners = 1000;
}

export default eventemitterConfiguration;
