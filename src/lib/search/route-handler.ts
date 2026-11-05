import {searchContent} from './full-search';
export function GET(request:Request){const q=new URL(request.url).searchParams.get('q')||'';return Response.json(searchContent(q,7),{headers:{'Cache-Control':'no-store','X-Robots-Tag':'noindex'}});}
