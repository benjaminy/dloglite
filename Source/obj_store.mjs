// Top Matter

import T       from "./Utilities/transit-adapter.mjs"

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

function isLeaves( thing )
{
    return ( thing.length % 3 ) === 0;
}

function insert( tree, obj )
{
    const b       = tree[ 0 ];
    const half_b  = tree[ 1 ];
    const next_id = tree[ 2 ];
    const root    = tree[ 3 ];
    const len     = root.length;
    tree[ 2 ] += 1;
    if( isLeaves( root ) )
    {
        root.push( 1, next_id, obj );
        if( len >= 3 * b )
        {
            left  = root.slice( ( 3 * half_b ) - 1 );
            right = root.slice( 3 * half_b, 3 * b );
            tree[ 3 ] = [ left, right ];
        }
    }
    else
    {
    }
    if 
        return next_id + 1;
}
