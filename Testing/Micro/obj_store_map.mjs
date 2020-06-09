// Top Matter

import * as S from "../../Source/obj_store_map.mjs"

function main()
{
    console.log( S.newObjStore );

    const op1 = new S.MicroTesting.objPtr( 4 );
    const op2 = new S.MicroTesting.objPtr( 5 );
    const op3 = new S.MicroTesting.objPtr( 6 );

    console.log( S.MicroTesting.objPtrSet( [ op1, op3 ] ) );
}

main();

benjaminy
