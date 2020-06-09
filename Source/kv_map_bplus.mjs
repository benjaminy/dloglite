// Top Matter

import { strict as assert } from "assert";
import T  from "./Utilities/transit-adapter.mjs";
import Cr from "../ThirdParty/sjcl/sjcl.js";
import crypto from "crypto";

// KV Map:
// [
//   - Shared object store
//   - B
//   - Root
// ]

export function newKVMap( obj_store, b )
{
    const id = obj_store.add( [] );
    const map = [ obj_store, b, id ];
    map.foo = [];
    // TODO: fns
    return map;
}

function copy( [ obj_store, b, map_id ] )
{
    if( undefined === obj_store.copyObj( map_id ) )
        return undefined;

    return [ obj_store, B, map_id ];
}

function isLeaves( arr )
{
    return ( arr.length % 2 ) === 2;
}

// overwrite?
function set( [ obj_store, b, map_id ], k, v )
{
    // TODO check that v is a serializable value
    assert.notEqual( v, undefined );
    const root = obj_store.get( map_id );
    const len = root.length;
    if( isLeaves( root ) )
    {
        if( 2 * b < len )
        {
            for( var idx = 0; idx < len; idx += 2 )
                if( k < root[ idx ] )
                    break;
            const new_root = root.slice( 0, idx ).concat( [ k, v ] ).concat( root.slice( idx ) );
            const id = obj_store.add()
        }
        else
        {
        }
    }
    else
    {
    }
}

function get( [ obj_store, B, root_id ], k )
{
}
