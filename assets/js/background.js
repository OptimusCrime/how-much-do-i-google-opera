/*
 A JavaScript implementation of the SHA family of hashes, as
 defined in FIPS PUB 180-2 as well as the corresponding HMAC implementation
 as defined in FIPS PUB 198a

 Copyright Brian Turek 2008-2014
 Distributed under the BSD License
 See http://caligatio.github.com/jsSHA/ for more information

 Several functions taken from Paul Johnston
*/
'use strict';(function(J){function u(a,c,b){var f=0,g=[0],k="",l=null,k=b||"UTF8";if("UTF8"!==k&&"UTF16"!==k)throw"encoding must be UTF8 or UTF16";if("HEX"===c){if(0!==a.length%2)throw"srcString of HEX type must be in byte increments";l=x(a);f=l.binLen;g=l.value}else if("TEXT"===c)l=y(a,k),f=l.binLen,g=l.value;else if("B64"===c)l=z(a),f=l.binLen,g=l.value;else if("BYTES"===c)l=A(a),f=l.binLen,g=l.value;else throw"inputFormat must be HEX, TEXT, B64, or BYTES";this.getHash=function(a,c,b,k){var l=null,
e=g.slice(),n=f,m;3===arguments.length?"number"!==typeof b&&(k=b,b=1):2===arguments.length&&(b=1);if(b!==parseInt(b,10)||1>b)throw"numRounds must a integer >= 1";switch(c){case "HEX":l=B;break;case "B64":l=C;break;case "BYTES":l=D;break;default:throw"format must be HEX, B64, or BYTES";}if("SHA-384"===a)for(m=0;m<b;m+=1)e=t(e,n,a),n=384;else if("SHA-512"===a)for(m=0;m<b;m+=1)e=t(e,n,a),n=512;else throw"Chosen SHA variant is not supported";return l(e,E(k))};this.getHMAC=function(a,b,c,l,p){var e,n,
m,r,q=[],v=[];e=null;switch(l){case "HEX":l=B;break;case "B64":l=C;break;case "BYTES":l=D;break;default:throw"outputFormat must be HEX, B64, or BYTES";}if("SHA-384"===c)n=128,r=384;else if("SHA-512"===c)n=128,r=512;else throw"Chosen SHA variant is not supported";if("HEX"===b)e=x(a),m=e.binLen,e=e.value;else if("TEXT"===b)e=y(a,k),m=e.binLen,e=e.value;else if("B64"===b)e=z(a),m=e.binLen,e=e.value;else if("BYTES"===b)e=A(a),m=e.binLen,e=e.value;else throw"inputFormat must be HEX, TEXT, B64, or BYTES";
a=8*n;b=n/4-1;n<m/8?(e=t(e,m,c),e[b]&=4294967040):n>m/8&&(e[b]&=4294967040);for(n=0;n<=b;n+=1)q[n]=e[n]^909522486,v[n]=e[n]^1549556828;c=t(v.concat(t(q.concat(g),a+f,c)),a+r,c);return l(c,E(p))}}function p(a,c){this.a=a;this.b=c}function y(a,c){var b=[],f,g=[],k=0,l;if("UTF8"===c)for(l=0;l<a.length;l+=1)for(f=a.charCodeAt(l),g=[],128>f?g.push(f):2048>f?(g.push(192|f>>>6),g.push(128|f&63)):55296>f||57344<=f?g.push(224|f>>>12,128|f>>>6&63,128|f&63):(l+=1,f=65536+((f&1023)<<10|a.charCodeAt(l)&1023),
g.push(240|f>>>18,128|f>>>12&63,128|f>>>6&63,128|f&63)),f=0;f<g.length;f+=1)(k>>>2)+1>b.length&&b.push(0),b[k>>>2]|=g[f]<<24-k%4*8,k+=1;else if("UTF16"===c)for(l=0;l<a.length;l+=1)(k>>>2)+1>b.length&&b.push(0),b[k>>>2]|=a.charCodeAt(l)<<16-k%4*8,k+=2;return{value:b,binLen:8*k}}function x(a){var c=[],b=a.length,f,g;if(0!==b%2)throw"String of HEX type must be in byte increments";for(f=0;f<b;f+=2){g=parseInt(a.substr(f,2),16);if(isNaN(g))throw"String of HEX type contains invalid characters";c[f>>>3]|=
g<<24-f%8*4}return{value:c,binLen:4*b}}function A(a){var c=[],b,f;for(f=0;f<a.length;f+=1)b=a.charCodeAt(f),(f>>>2)+1>c.length&&c.push(0),c[f>>>2]|=b<<24-f%4*8;return{value:c,binLen:8*a.length}}function z(a){var c=[],b=0,f,g,k,l,p;if(-1===a.search(/^[a-zA-Z0-9=+\/]+$/))throw"Invalid character in base-64 string";f=a.indexOf("=");a=a.replace(/\=/g,"");if(-1!==f&&f<a.length)throw"Invalid '=' found in base-64 string";for(g=0;g<a.length;g+=4){p=a.substr(g,4);for(k=l=0;k<p.length;k+=1)f="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(p[k]),
l|=f<<18-6*k;for(k=0;k<p.length-1;k+=1)c[b>>2]|=(l>>>16-8*k&255)<<24-b%4*8,b+=1}return{value:c,binLen:8*b}}function B(a,c){var b="",f=4*a.length,g,k;for(g=0;g<f;g+=1)k=a[g>>>2]>>>8*(3-g%4),b+="0123456789abcdef".charAt(k>>>4&15)+"0123456789abcdef".charAt(k&15);return c.outputUpper?b.toUpperCase():b}function C(a,c){var b="",f=4*a.length,g,k,l;for(g=0;g<f;g+=3)for(l=(a[g>>>2]>>>8*(3-g%4)&255)<<16|(a[g+1>>>2]>>>8*(3-(g+1)%4)&255)<<8|a[g+2>>>2]>>>8*(3-(g+2)%4)&255,k=0;4>k;k+=1)b=8*g+6*k<=32*a.length?b+
"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(l>>>6*(3-k)&63):b+c.b64Pad;return b}function D(a){var c="",b=4*a.length,f,g;for(f=0;f<b;f+=1)g=a[f>>>2]>>>8*(3-f%4)&255,c+=String.fromCharCode(g);return c}function E(a){var c={outputUpper:!1,b64Pad:"="};try{a.hasOwnProperty("outputUpper")&&(c.outputUpper=a.outputUpper),a.hasOwnProperty("b64Pad")&&(c.b64Pad=a.b64Pad)}catch(b){}if("boolean"!==typeof c.outputUpper)throw"Invalid outputUpper formatting option";if("string"!==typeof c.b64Pad)throw"Invalid b64Pad formatting option";
return c}function q(a,c){var b=null,b=new p(a.a,a.b);return b=32>=c?new p(b.a>>>c|b.b<<32-c&4294967295,b.b>>>c|b.a<<32-c&4294967295):new p(b.b>>>c-32|b.a<<64-c&4294967295,b.a>>>c-32|b.b<<64-c&4294967295)}function F(a,c){var b=null;return b=32>=c?new p(a.a>>>c,a.b>>>c|a.a<<32-c&4294967295):new p(0,a.a>>>c-32)}function K(a,c,b){return new p(a.a&c.a^~a.a&b.a,a.b&c.b^~a.b&b.b)}function L(a,c,b){return new p(a.a&c.a^a.a&b.a^c.a&b.a,a.b&c.b^a.b&b.b^c.b&b.b)}function M(a){var c=q(a,28),b=q(a,34);a=q(a,39);
return new p(c.a^b.a^a.a,c.b^b.b^a.b)}function N(a){var c=q(a,14),b=q(a,18);a=q(a,41);return new p(c.a^b.a^a.a,c.b^b.b^a.b)}function O(a){var c=q(a,1),b=q(a,8);a=F(a,7);return new p(c.a^b.a^a.a,c.b^b.b^a.b)}function P(a){var c=q(a,19),b=q(a,61);a=F(a,6);return new p(c.a^b.a^a.a,c.b^b.b^a.b)}function Q(a,c){var b,f,g;b=(a.b&65535)+(c.b&65535);f=(a.b>>>16)+(c.b>>>16)+(b>>>16);g=(f&65535)<<16|b&65535;b=(a.a&65535)+(c.a&65535)+(f>>>16);f=(a.a>>>16)+(c.a>>>16)+(b>>>16);return new p((f&65535)<<16|b&65535,
g)}function R(a,c,b,f){var g,k,l;g=(a.b&65535)+(c.b&65535)+(b.b&65535)+(f.b&65535);k=(a.b>>>16)+(c.b>>>16)+(b.b>>>16)+(f.b>>>16)+(g>>>16);l=(k&65535)<<16|g&65535;g=(a.a&65535)+(c.a&65535)+(b.a&65535)+(f.a&65535)+(k>>>16);k=(a.a>>>16)+(c.a>>>16)+(b.a>>>16)+(f.a>>>16)+(g>>>16);return new p((k&65535)<<16|g&65535,l)}function S(a,c,b,f,g){var k,l,q;k=(a.b&65535)+(c.b&65535)+(b.b&65535)+(f.b&65535)+(g.b&65535);l=(a.b>>>16)+(c.b>>>16)+(b.b>>>16)+(f.b>>>16)+(g.b>>>16)+(k>>>16);q=(l&65535)<<16|k&65535;k=(a.a&
65535)+(c.a&65535)+(b.a&65535)+(f.a&65535)+(g.a&65535)+(l>>>16);l=(a.a>>>16)+(c.a>>>16)+(b.a>>>16)+(f.a>>>16)+(g.a>>>16)+(k>>>16);return new p((l&65535)<<16|k&65535,q)}function t(a,c,b){var f,g,k,l,q,t,u,G,x,e,n,m,r,y,v,s,z,A,B,C,D,E,F,H,d,w=[],I,h=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,
2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298];e=[3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,
3204075428];g=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225];if("SHA-384"===b||"SHA-512"===b)n=80,f=(c+128>>>10<<5)+31,y=32,v=2,d=p,s=Q,z=R,A=S,B=O,C=P,D=M,E=N,H=L,F=K,h=[new d(h[0],3609767458),new d(h[1],602891725),new d(h[2],3964484399),new d(h[3],2173295548),new d(h[4],4081628472),new d(h[5],3053834265),new d(h[6],2937671579),new d(h[7],3664609560),new d(h[8],2734883394),new d(h[9],1164996542),new d(h[10],1323610764),new d(h[11],3590304994),new d(h[12],
4068182383),new d(h[13],991336113),new d(h[14],633803317),new d(h[15],3479774868),new d(h[16],2666613458),new d(h[17],944711139),new d(h[18],2341262773),new d(h[19],2007800933),new d(h[20],1495990901),new d(h[21],1856431235),new d(h[22],3175218132),new d(h[23],2198950837),new d(h[24],3999719339),new d(h[25],766784016),new d(h[26],2566594879),new d(h[27],3203337956),new d(h[28],1034457026),new d(h[29],2466948901),new d(h[30],3758326383),new d(h[31],168717936),new d(h[32],1188179964),new d(h[33],1546045734),
new d(h[34],1522805485),new d(h[35],2643833823),new d(h[36],2343527390),new d(h[37],1014477480),new d(h[38],1206759142),new d(h[39],344077627),new d(h[40],1290863460),new d(h[41],3158454273),new d(h[42],3505952657),new d(h[43],106217008),new d(h[44],3606008344),new d(h[45],1432725776),new d(h[46],1467031594),new d(h[47],851169720),new d(h[48],3100823752),new d(h[49],1363258195),new d(h[50],3750685593),new d(h[51],3785050280),new d(h[52],3318307427),new d(h[53],3812723403),new d(h[54],2003034995),
new d(h[55],3602036899),new d(h[56],1575990012),new d(h[57],1125592928),new d(h[58],2716904306),new d(h[59],442776044),new d(h[60],593698344),new d(h[61],3733110249),new d(h[62],2999351573),new d(h[63],3815920427),new d(3391569614,3928383900),new d(3515267271,566280711),new d(3940187606,3454069534),new d(4118630271,4000239992),new d(116418474,1914138554),new d(174292421,2731055270),new d(289380356,3203993006),new d(460393269,320620315),new d(685471733,587496836),new d(852142971,1086792851),new d(1017036298,
365543100),new d(1126000580,2618297676),new d(1288033470,3409855158),new d(1501505948,4234509866),new d(1607167915,987167468),new d(1816402316,1246189591)],e="SHA-384"===b?[new d(3418070365,e[0]),new d(1654270250,e[1]),new d(2438529370,e[2]),new d(355462360,e[3]),new d(1731405415,e[4]),new d(41048885895,e[5]),new d(3675008525,e[6]),new d(1203062813,e[7])]:[new d(g[0],4089235720),new d(g[1],2227873595),new d(g[2],4271175723),new d(g[3],1595750129),new d(g[4],2917565137),new d(g[5],725511199),new d(g[6],
4215389547),new d(g[7],327033209)];else throw"Unexpected error in SHA-2 implementation";a[c>>>5]|=128<<24-c%32;a[f]=c;I=a.length;for(m=0;m<I;m+=y){c=e[0];f=e[1];g=e[2];k=e[3];l=e[4];q=e[5];t=e[6];u=e[7];for(r=0;r<n;r+=1)w[r]=16>r?new d(a[r*v+m],a[r*v+m+1]):z(C(w[r-2]),w[r-7],B(w[r-15]),w[r-16]),G=A(u,E(l),F(l,q,t),h[r],w[r]),x=s(D(c),H(c,f,g)),u=t,t=q,q=l,l=s(k,G),k=g,g=f,f=c,c=s(G,x);e[0]=s(c,e[0]);e[1]=s(f,e[1]);e[2]=s(g,e[2]);e[3]=s(k,e[3]);e[4]=s(l,e[4]);e[5]=s(q,e[5]);e[6]=s(t,e[6]);e[7]=s(u,
e[7])}if("SHA-384"===b)a=[e[0].a,e[0].b,e[1].a,e[1].b,e[2].a,e[2].b,e[3].a,e[3].b,e[4].a,e[4].b,e[5].a,e[5].b];else if("SHA-512"===b)a=[e[0].a,e[0].b,e[1].a,e[1].b,e[2].a,e[2].b,e[3].a,e[3].b,e[4].a,e[4].b,e[5].a,e[5].b,e[6].a,e[6].b,e[7].a,e[7].b];else throw"Unexpected error in SHA-2 implementation";return a}"function"===typeof define&&define.amd?define(function(){return u}):"undefined"!==typeof exports?"undefined"!==typeof module&&module.exports?module.exports=exports=u:exports=u:J.jsSHA=u})(this);

//
// Variables
//

var data = {};

//
// Everything starts here
//

function init() {
    // Get local storage data
    var local_data = localStorage.data;
    if (local_data !== undefined) {
        data = JSON.parse(local_data);
    }
    
    // Listener for navigation
    chrome.webNavigation.onBeforeNavigate.addListener(function (details) {
        analyze_request(details.url);
    });
    
    // Listener for referencefragment
    chrome.webNavigation.onReferenceFragmentUpdated.addListener(function (details) {
        analyze_request(details.url);
    });
    
    // Update the title
    update_title();
}

//
// Makes sure we only handle Google searches
//

function analyze_request(req) {
    // Remove http(s) from the url
    var req_clean = req.replace(/^(https?):\/\//, '');
    
    // Split on .
    var req_split = req_clean.split('.');
    // Check if url is Google
    if ((req_split.length > 0 && req_split[0]) == 'google' || req_split.length > 1 && req_split[1] == 'google') {
        // Google search, handle request!
        handle_request(req);
    }
}

//
// Tries to find the url fragments & / ? / # from the url
//

function get_fragments(url, sep) {
    var fragments;
    var inner_fragments = [];
    if (url.indexOf(sep) !== -1) {
        fragments = url.split(sep);
        if (fragments[1].indexOf('&') !== -1) {
            inner_fragments = fragments[1].split('&');
        }
        else {
            inner_fragments = [fragments[1]];
        }
    }
    
    return inner_fragments;
}

//
// Tries to locate the q= in the stack of fragments
//

function analyze_fragments(arr) {
    if (arr.length > 0) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].substr(0, 2) == 'q=') {
                return arr[i].substr(2);
            }
        }
    }
    
    // Nothing was found
    return null;
}

//
// Handles an incoming request
//

function handle_request(url) {
    // Some variables
    var search_query = null;
    var inner_fragments;
    
    // Tries to get fragments from the hash
    inner_fragments = get_fragments(url, '#');
    
    // Analyze the fragments
    search_query = analyze_fragments(inner_fragments);
    
    // Check if anything was returned
    if (search_query === null) {
        // Nothing was returned, check if we have any fragments in get
        inner_fragments = get_fragments(url, '?');
    }
    
    // Analyze the fragments one more time
    search_query = analyze_fragments(inner_fragments);
    
    // Check if anything was returned (again)
    if (search_query !== null) {
        // We have a search query!
        add_to_data(search_query);
    }
}

//
// Populates data, to make sure we dont fuck anything up
//

function populate_data(year, month, day) {
    // Add year if none
    if (data['y' + year] === undefined) {
        data['y' + year] = {};
    }
    
    // Add month if none
    if (data['y' + year]['m' + month] === undefined) {
        data['y' + year]['m' + month] = {};
    }
    
    // Add date if none
    if (data['y' + year]['m' + month]['d' + day] === undefined) {
        data['y' + year]['m' + month]['d' + day] = [];
    }
}

//
// Adds a search to the data
//

function add_to_data(q) {
    // Get current date
    var d = new Date();
    
    // Get year, month, day
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    
    // Populate data
    populate_data(year, month, day);
    
    // Hashing to avoid storing searches in clear text
    var shaObj = new jsSHA(q, "TEXT");
    var hmac = shaObj.getHMAC("lorem ipsum, kebab", "TEXT", "SHA-512", "HEX");
    
    // Check if already in the stack and more recent that one hour
    var day_arr = data['y' + year]['m' + month]['d' + day];
    if (day_arr.length > 0) {
        for (var i = 0; i < day_arr.length; i++) {
            if (day_arr[i].query == hmac) {
                if (day_arr[i].time > (new Date().getTime() - (60*60*1000))) {
                    // Already in stack and newer thatn one hour, abooort
                    return;
                }
            }
        }
    }
    
    // Add to data
    data['y' + year]['m' + month]['d' + day].push({query: hmac, time: new Date().getTime()});
        
    // Save
    localStorage.data = JSON.stringify(data);
    
    // Update the title
    update_title();
}

//
// Update the title
//

function update_title() {
    // Get current date
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    
    var searches_num = data['y' + year]['m' + month]['d' + day].length;
    chrome.browserAction.setTitle({title: 'How Much Do I Google? :: ' + searches_num + ' search' + ((searches_num == 1) ? '' : 'es') + ' today!'});
}

//
// Run everything!
//

init();