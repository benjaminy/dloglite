// Top Matter

import T  from "./Utilities/transit-adapter.mjs";
import Cr from "../ThirdParty/sjcl/sjcl.js";
import crypto from "crypto";

const TW = T.writer( "json" );

export const k_prev      = T.keyword( "dloglite/prev" );
export const k_seq_num   = T.keyword( "dloglite/seq_num" );
export const k_txn       = T.keyword( "dloglite/txn" );
export const k_index     = T.keyword( "dloglite/index" );
export const k_obj_table = T.keyword( "dloglite/obj_table" );
export const k_hash      = T.keyword( "dloglite/hash" );

// Whole document:
// [
//   - hash
//   - signature
//   - public key
//   - identity
//   - object store
//   - head of txn chain
// ]

// Txn:
// [
//   - seq num
//   - hash
//   - signature
//   - public key
//   - identity
//   - prev (inline obj, pointer, ... ?)
//   - contents
//   - index (optional)
// ]

// Committer:
// {
//   - private key
//   - public key
//   - name
// }

// Object store
// [
//   - hash
//   - next id
//   - root
// ]


function newDoc( committer )
{
    const obj_store = [ 1, [] ];
    obj_store.unshift( hashStr( TW.write( obj_store ) ) );
    const root_block = [ "12345" ];
    const root_doc = [ committer.name, obj_store, root_block ];
    const signature = committer.private_key.sign(
        hashBits( TW.write( [ committer.name, obj_store[ 0 ], root_block[ 0 ] ] ) )
    );
    console.log( "sig", signature );
    const root_hash = ( new Cr.hash.sha256() ).update( "12345" ).finalize()
    return T.mapP( [
        [ k_prev, null ],
        [ k_seq_num, 0 ],
        [ k_obj_table, [] ],
        [ k_hash, Cr.codec.base64url.fromBits( root_hash ) ] ] );
}

function addTxn( doc, txn )
{
    const obj_table = doc.get( k_obj_table );
    doc.delete( k_obj_table );
    const prev_hash = doc.get( k_hash );
    // Small performance bug to keep an eye on: serializing the txn twice
    const txn_str = TW.write( txn );
    const next_hash = ( new Cr.hash.sha256() ).update( prev_hash + txn_str ).finalize();
    const block = T.mapP( [
        [ k_prev, doc ],
        [ k_txn, txn ],
        [ k_hash, Cr.codec.base64url.fromBits( next_hash ) ],
        [ k_obj_table, obj_table ] ] )
    return TW.write( block );
}

function makeAnIndex( doc )
{
    if( doc.has( k_index ) )
    {
        // already there
        return;
    }
}

function main()
{
    const key_pair = Cr.ecc.ecdsa.generateKeys( 256 );
    const alice = { name: "alice", private_key: key_pair.sec, public_key: key_pair.pub };
    // console.log( "Key-pair", key_pair );
    // console.log( "public", key_pair.pub.serialize() );
    // console.log( "secret", key_pair.sec.serialize() );
    // console.log( "alice", alice );
    const doc1 = newDoc( alice );
    console.log( "doc1:", doc1 );
    //const foo = addTxn( newDoc(), [] );
    // console.log( "YOP", foo );
}

main()

// 489C_D5DB_C708_C7E5_41DE_4D7C_D91C_E6D0_F161_3573_B7FC_5B40_D394_2CCB_9555_CF35

// > x = [
// ...   1218237915,
// ...   -955725851,
// ...   1105087868,
// ...   -652417328,
// ...   -245287565,
// ...   -1208198336,
// ...   -745263925,
// ...   -1789538507
// ... ]
