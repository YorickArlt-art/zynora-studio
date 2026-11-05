// OAuth is delegated to Supabase. Client secrets and bot tokens never belong here.
export async function discordAuthorization(client,{redirectTo,authOrigin}){
 const {data,error}=await client.auth.signInWithOAuth({provider:'discord',options:{redirectTo,scopes:'identify email',skipBrowserRedirect:true}});
 if(error)throw error;
 const url=new URL(data?.url||'');
 if(url.origin!==authOrigin||url.pathname!=='/auth/v1/authorize'||url.searchParams.get('provider')!=='discord')throw Error('Invalid OAuth destination');
 return url.href;
}
