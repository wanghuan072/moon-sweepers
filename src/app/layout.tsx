import JsonLd from '@/seo/JsonLd';
import {site} from '@/config/site';
import type { ReactNode } from 'react';
import AppHeader from '@/components/layout/AppHeader';
import AppFooter from '@/components/layout/AppFooter';
import { routeMetadata } from '@/seo/metadata';
import '@/style/globals.css';
export const metadata = {
  ...routeMetadata('/'),
  verification: {
    other: { 'msvalidate.01': 'D8EF052A74B4BB3D3229205232205792' },
  },
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body><JsonLd data={{'@context':'https://schema.org','@type':'Organization','@id':site.url+'/#organization',name:site.name,url:site.url,logo:site.url+'/images/logo.svg',email:site.email,description:'Independent fan guides, equipment information and planning tools for Moon Sweepers.'}}/><JsonLd data={{'@context':'https://schema.org','@type':'WebSite','@id':site.url+'/#website',name:site.name,url:site.url,inLanguage:'en',publisher:{'@id':site.url+'/#organization'}}}/><a className="skip-link" href="#main-content">Skip to content</a><AppHeader /><main id="main-content">{children}</main><AppFooter /></body></html>;
}
