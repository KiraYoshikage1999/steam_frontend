import log from 'loglevel';
//Just usual logger analog for frontend
const development = process.env.NODE_ENV !== 'production';

if (development) {
    log.setLevel('debug'); // Seeing all errors
} else {
    log.setLevel('error'); // only errors
}

export default log;