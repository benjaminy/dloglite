// Top Matter

import Cr from "../ThirdParty/sjcl/sjcl.js";
import crypto from "crypto";

function hashBits( text )
{
    const hasher_obj = new Cr.hash.sha256();
    hasher_obj.update( text );
    return hasher_obj.finalize();
}

function hashStr( text )
{
    return Cr.codec.base64url.fromBits( hashBits( text ) );
}

function init()
{
    const NUM_BYTES = 1024 / 8;
    const buf1 = crypto.randomBytes( NUM_BYTES );
    const buf2 = new Uint32Array( new Uint8Array( buf1 ).buffer );
    Cr.random.addEntropy( buf2, 1024, "crypto.randomBytes" );
}

function dsaKeyPair()
{
}
