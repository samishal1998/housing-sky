import crypto from 'crypto'

export default function sha1(value:string) {

    const hash = crypto.createHash('sha1');

    hash.update(value);

    return hash.digest('hex');
}
