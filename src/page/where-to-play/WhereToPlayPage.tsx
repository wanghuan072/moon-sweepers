import PageHero from '@/components/layout/PageHero';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import PageSchema from '@/seo/PageSchema';
import { routeMetadata } from '@/seo/metadata';
import { site } from '@/config/site';
import s from '@/style/common/listing.module.css';
import play from './where-to-play.module.css';

export const metadata = routeMetadata('/where-to-play');

export default function WhereToPlayPage() {
  return <div className={`container ${s.page}`}>
    <PageSchema path="/where-to-play" />
    <Breadcrumb items={[{ title: 'Where to Play' }]} />
    <PageHero eyebrow="STEAM / WINDOWS PC" title="Where to Play Moon Sweepers on PC" description="Find the Moon Sweepers game by DragDrop Games on Steam. Check the price and platform support before buying." />
    <section className={play.purchase} aria-labelledby="steam-price">
      <div>
        <span className={play.label}>OFFICIAL STEAM STORE</span>
        <h2 id="steam-price">Moon Sweepers Steam Price</h2>
        <p>Base game for Windows PC. Regional prices and discounts can change.</p>
      </div>
      <div className={play.buy}>
        <strong>US$8.99</strong>
        <small>US price checked November 5, 2026</small>
        <a href={site.steam} target="_blank" rel="noopener noreferrer">View current price on Steam ↗</a>
      </div>
    </section>
    <section className={s.section}>
      <h2>Supported Platforms</h2>
      <dl className={play.platforms}>
        <div><dt><strong>Windows PC</strong></dt>
        <dd>Available on Steam. The store lists 64-bit Windows 10 as the minimum operating system.</dd></div>
        <div><dt><strong>PlayStation 5</strong></dt>
        <dd>No PS5 release was listed in the official sources checked on November 5, 2026.</dd></div>
        <div><dt><strong>Xbox</strong></dt>
        <dd>No Xbox console release was listed in the official sources checked on that date.</dd></div>
        <div><dt><strong>Mac</strong></dt>
        <dd>Steam does not list a native macOS version.</dd></div>
      </dl>
      <p>Follow the <a href={site.news}>developer’s Steam announcements</a> for any future platform news.</p>
    </section>
    <section className={s.section}>
      <h2>Platform FAQ</h2><div className={play.answers}>
      <article><h3>Is Moon Sweepers on PS5?</h3>
      <p>There is no confirmed PS5 release in the sources checked. Steam lists PlayStation controller support for the PC game.</p></article>
      <article><h3>Is Moon Sweepers on Xbox?</h3>
      <p>There is no confirmed Xbox console release in the sources checked. You can use a supported Xbox controller with the Windows Steam version.</p></article>
      <article><h3>Can you play Moon Sweepers on Mac?</h3>
      <p>There is no native Mac version listed on Steam. Check the game’s system requirements before buying for a Mac.</p></article></div>
    </section>
    <section className={s.section}>
      <h2>Before Your First Session</h2>
      <div className={s.relatedLinks}>
        <a href="/guides/beginners-guide">Make your first dust delivery →</a>
        <a href="/updates">Read released patches and future plans →</a>
        <a href="https://steamcommunity.com/app/5335510/reviews/" target="_blank" rel="noopener noreferrer">Read Steam player reviews ↗</a>
      </div>
    </section>
  </div>;
}
