import Icon from '@/components/common/Icon';
import s from '@/style/common/listing.module.css';
export default function NotFound() { return <div className={`container ${s.page}`}><div className={s.empty}><Icon name="compass" size={55} /><span className={s.kicker}>404 / OFF THE MAPPED SURFACE</span><h1>This sector is uncharted.</h1><p>The page you’re looking for isn’t here. Return to a working route.</p><div className={s.relatedLinks}><a href="/">Back to home →</a><a href="/wiki">Explore the wiki →</a></div></div></div>; }
