// Top Matter

import { strict as assert } from "assert";
import T from "./Utilities/transit-adapter.mjs";

// Object store:
// [
//   - Next available object ID
//   - Objet map
// ]

// Object tuple:
// [
//   - The object itself
//   - Reference count
//   - [optional] Set of IDs of referred-to objects
// ]

const NEXT_ID = Symbol( "next available object ID" );
const OBJ_MAP = Symbol( "object map" );

function objPtr( id )
{
    this.id = id;
}

function isObjPtr( thing )
{
    return thing instanceof objPtr;
}

export function newObjStore()
{
    this[ NEXT_ID ] = 1;
    this[ OBJ_MAP ] = T.map();
}

newObjStore.prototype.add        = add;
newObjStore.prototype.has        = has;
newObjStore.prototype.get        = get;
newObjStore.prototype.set        = set;
// newObjStore.prototype.overwrite  = overwrite;
//newObjStore.prototype.incrRefCnt = incrRefCnt;
newObjStore.prototype.decrRefCnt = decrRefCnt;
//newObjStore.prototype.dehydrate  = dehydrate;

function* objPtrIter( obj )
{
    if( obj instanceof objPtr )
    {
        yield obj.id;
    }
    else if( Array.isArray( obj ) || T.isSet( obj ) )
    {
        for( const thing of obj )
        {
            yield* objPtrIter( thing );
        }
    }
    else if( T.isMap( obj ) )
    {
        for( const [ k, v ] of obj )
        {
            yield* objPtrIter( k );
            yield* objPtrIter( v );
        }
    }
    else
    {
        console.log( "BLARG", obj );
    }
}

function objPtrSet( obj, cached )
{
    if( cached )
        return cached;
    const ptrs = new Set();
    for( const thing of objPtrIter( obj ) )
    {
        ptrs.add( thing );
    }
    return ptrs;
}

// For now I'm going to experiment with making client code responsible for saying
// what other objects an object refers too.
// We'll see if this seems too burdensome.
function add( obj )
{
    // TODO: Improve assertion to assert that obj is an acceptable kind of thing
    assert.ok( !( obj === undefined ) );
    const next_id = this[ NEXT_ID ];
    // XXX: Where should this assertion go?
    //    assert.ok( obj_ids.every( ( p ) => obj_store.has( p ) ) );
    this[ OBJ_MAP ].set( next_id, [ obj, 1 ] );
    this[ NEXT_ID ] = next_id + 1;
    return new ObjPtr( next_id );
}

function has( obj_ptr )
{
    assert.ok( isObjPtr( obj_ptr ) );
    return this[ OBJ_MAP ].has( obj_ptr.id );
}

function get( obj_ptr )
{
    assert.ok( isObjPtr( obj_ptr ) );
    if( this.has( obj_ptr ) )
        return this[ OBJ_MAP ].get( id )[ 0 ];
    else
        return undefined;
}

// Unusual interface!  If the reference count for obj_ptr is less than 2, then
// do anin-place update.  Otherwise, decrement the reference count and add a new
// entry in the object map.  Consequently, this function returns an object
// pointer that may or may not be the same as the one passed in.
function set( obj_ptr, replacement, refs_repl_maybe )
{
    assert.ok( isObjPtr( obj_ptr ) );
    const id = obj_ptr.id;
    if( !this.has( obj_ptr ) )
    {
        assert.ok( id >= 0 );
        assert.ok( id < this[ NEXT_ID ] );
        // NOTE: This makes me nervous.  An ID was removed from the map and is
        // now being added back in.  Maybe there are legit uses.
        this[ OBJ_MAP ].set( id, [ replacement, 1 ] );
        return obj_ptr;
    }
    const [ existing, ref_count, refs_maybe ] = this[ OBJ_MAP ].get( id );
    if( ref_count > 1 )
    {
        this.decrRefCnt( obj_ptr );
        return this.add( replacement );
    }
    assert.ok( ref_count === 1 );
    // Overwriting an existing object.  Need to be careful to decrement some,
    // but not all, of the reference counts.
    const refs_existing    = objPtrSet( existing, refs_maybe );
    const refs_replacement = objPtrSet( replacement, refs_repl_maybe );
    const to_decr = difference( refs_existing, refs_replacement );
    if(  )
        

    this[ OBJ_MAP ].set( id, replacement );
    return obj_ptr;
}


// // If there is only one reference to "id", update in place.  Otherwise, add a new entry.
// // (i.e. copy-on-write)
// function updateOrAddID( obj_store, id, obj )
// {
//     const [ n, map ] = obj_store;
//     if( !map.has( id ) )
//     {
//         // Error?
//         return obj_store.add( refs, obj );
//     }
//     const old_tuple = map.get( id );
//     const [ obj_old, ref_count, refs_old ] = old_tuple;
//     assert.ok( ref_count > 0 );
//     if( ref_count == 1 )
//     {
//     // XXX old vs new refs???
//     return map.get( id )[ 0 ];
//     }
//     else
//     {
//         old_tuple[ 1 ] -= 1;
//         return obj_store.add( obj );
//     }
// }

// function updateOrAdd( obj_store, obj_ptr, obj )
// {
//     assert.ok( isObjPtr( obj_ptr ) )
//     return obj_store.updateOrAddID( obj_ptr.id, obj );
// }

function incrRefCnt( obj_ptr )
{
    assert.ok( isObjPtr( obj_ptr ) );
    const map = this[ OBJ_MAP ];
    if( map.has( id ) )
    {
        const obj_tuple = map.get( id );
        assert.ok( obj_tuple[ 1 ] > 0 );
        obj_tuple[ 1 ] += 1;
        return obj_tuple[ 0 ];
    }
    return undefined;
}

function decrRefCntID( obj_store, id )
{
    const map = obj_store[ OBJ_MAP ];
    if( !map.has( id ) )
    {
        // NOTE: Maybe this should be a harder failure?
        return undefined;
    }
    const obj_tuple = map.get( id );
    assert.ok( obj_tuple[ 1 ] > 0 );
    obj_tuple[ 1 ] -= 1;
    if( obj_tuple[ 1 ] === 0 )
    {
        for( const ref in objPtrSet( obj_tuple[ 2 ] )
        {
            const ps = [];
            ps.push( decrRefCntID( obj_store, ref ) );
            await( ps );
        }
        map.delete( id );
    }
    return obj_tuple[ 0 ];
}

function decrRefCnt( obj_ptr )
{
    assert.ok( isObjPtr( obj_ptr ) );
    return decrRefCntID( this, obj_ptr.id );
}

// async function pack( obj_store, writer )
// {
//     // based on a tiny experiment, it seems transit writes arrays with
//     // added methods as plain arrays.
//     return writer.write( obj_store );
// }

// export async function unpack( reader, obj_store_string )
// {
//     const os = reader.read( obj_store_string );
//     initMethods( os );
//     return os;
// }




// // Why on Earth are these not built-in functions????
// function union( setA, setB )
// {
//     const u = new Set( setA );
//     for( const v of setB )
//     {
//         u.add( v );
//     }
//     return u;
// }

// function intersection( setA, setB )
// {
//     const i = new Set();
//     for( const v of setB )
//     {
//         if( setA.has( v ) )
//         {
//             i.add( v );
//         }
//     }
//     return i;
// }

// function symmetricDifference( setA, setB )
// {
//     const d = new Set( setA );
//     for( const v of setB )
//     {
//         if( d.has( v ) )
//         {
//             d.delete( v );
//         }
//         else
//         {
//             d.add( v );
//         }
//     }
//     return d;
// }

function difference( setA, setB )
{
    const d = new Set( setA );
    for( const v of setB )
    {
        d.delete( v );
    }
    return d;
}

export const MicroTesting = {
    objPtr     : objPtr,
    objPtrIter : objPtrIter,
    objPtrSet  : objPtrSet
};
