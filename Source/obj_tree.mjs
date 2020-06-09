// Top Matter

import T       from "./Utilities/transit-adapter.mjs"
import * as Cr from "./Utilities/crypto.mjs"

// Oh wait. No hash, right? The doc hash should only depend on the chain of txns

// Tree:
// [
//   b
//   next id,
//   root
// ]

function newTree( b )
{
    return [ b, Math.ceil( b / 2 ), 1, [] ];
}

function insert( tree, obj )
{
    const b       = tree[ 0 ];
    const half_b  = tree[ 1 ];
    const next_id = tree[ 2 ];
    const root    = tree[ 3 ];
    const len     = root.length;
    if( len % 3 === 0 )
    {
        root.push( 1, next_id, obj );
        if( len < 3 * b )
        {
            tree[ 2 ] += 1;
            return next_id + 1;
        }
        else
        {
            left = root.slice( half_b );
        }
    }
    if 
}
