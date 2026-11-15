// Point NODE_PATH to a directory containing @resvg/resvg-js.
const { Resvg } = require('@resvg/resvg-js');
const fs = require('node:fs');
const [src,dst,width] = process.argv.slice(2);
const opts = {font: {loadSystemFonts:true}};
if (width) opts.fitTo = {mode:'width',value:Number(width)};
fs.writeFileSync(dst,new Resvg(fs.readFileSync(src),opts).render().asPng());
