import {execSync} from 'child_process';
try{
  const out=execSync(`python3 ${process.env.HOME}/.claude/skills/website-seo-fix/scripts/verify_seo.py http://127.0.0.1:3001/ --gbp-name "Zen Ramen & Sushi" --area "Midtown Manhattan" --keywords "ramen,sushi,midtown,happy hour,lunch special" 2>&1`,{encoding:'utf8',timeout:120000});
  console.log(out);
  const failCount=(out.match(/FAIL/g)||[]).length;
  console.log(failCount===0?'VERIFY PASS':'VERIFY HAS '+failCount+' FAIL');
}catch(e){console.log('VERIFY ERROR',e.message.slice(0,300));}
