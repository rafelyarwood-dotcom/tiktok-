module.exports=async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
  try{
    const username=String(req.body?.username||'').trim().replace(/^@+/,'');
    const apiKey=String(req.body?.apiKey||'').trim();
    if(!username)return res.status(400).json({error:'Missing username'});
    if(!apiKey)return res.status(400).json({error:'Missing API key'});
    const url=new URL('https://api.scrapecreators.com/v1/tiktok/profile');
    url.searchParams.set('handle',username);
    url.searchParams.set('cache_max_age','1d');
    const r=await fetch(url.toString(),{headers:{'x-api-key':apiKey,'accept':'application/json'}});
    const text=await r.text();let data;try{data=JSON.parse(text)}catch{data={raw:text}}
    if(!r.ok||!data?.success)return res.status(r.status||404).json({error:data?.message||data?.error||'Profile not found'});
    const u=data.user||{};
    return res.status(200).json({username:u.uniqueId||username,nickname:u.nickname||u.uniqueId||username,avatar:u.avatarThumb||u.avatarMedium||u.avatarLarger||'',verified:!!u.verified});
  }catch(e){return res.status(500).json({error:'Search failed: '+String(e?.message||e)});}
};