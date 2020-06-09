// Top Matter

import T from "transit-js";

// The transit-js Map constructor does not follow the ECMA standard.
// This is a simple adapter from ECMA to transit-js
T.mapP = function( pairs )
{
    const busted = []
    for( const [ k, v ] of pairs )
    {
        busted.push( k );
        busted.push( v );
    }
    return T.map( busted );
}

export default T;

console.log( "Loaded transit-adapter.mjs" );
