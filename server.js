const http=require("http"),fs=require("fs"),path=require("path");
const root=__dirname,port=Number(process.env.PORT||3000);
const types={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json; charset=utf-8",".webmanifest":"application/manifest+json",".svg":"image/svg+xml"};
http.createServer((req,res)=>{
  let pathname;
  try{pathname=decodeURIComponent(new URL(req.url,"http://localhost").pathname)}catch{pathname="/"}
  if(pathname==="/health"){res.writeHead(200,{"content-type":"application/json"});return res.end('{"ok":true,"engine":"fold-zero"}')}
  let file=path.join(root,pathname==="/"?"/index.html":pathname);
  if(!file.startsWith(root)){res.writeHead(403);return res.end("forbidden")}
  fs.stat(file,(err,st)=>{
    if(err||!st.isFile()) file=path.join(root,"index.html");
    fs.readFile(file,(e,data)=>{
      if(e){res.writeHead(500);return res.end("engine fault")}
      res.writeHead(200,{"content-type":types[path.extname(file)]||"application/octet-stream","cache-control":path.basename(file)==="index.html"?"no-cache":"public, max-age=3600"});
      res.end(data);
    });
  });
}).listen(port,"0.0.0.0",()=>console.log("FOLD ZERO online on",port));