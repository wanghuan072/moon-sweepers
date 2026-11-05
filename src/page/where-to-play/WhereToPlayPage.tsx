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
        <div><dt><strong>Steam Deck</strong></dt>
        <dd>Valve lists the game as Playable. Check the compatibility details on Steam for any setup or control notes.</dd></div>
        <div><dt><strong>Nintendo Switch</strong></dt>
        <dd>No Switch release was found in the official sources checked on November 5, 2026.</dd></div>
      </dl>
      <p>Follow the <a href={site.news}>developer’s Steam announcements</a> for any future platform news.</p>
    </section>
    <section className={s.section}>
      <h2>Windows PC System Requirements</h2>
      <dl className={play.platforms}>
        <div><dt>Operating system</dt><dd>64-bit Windows 10</dd></div>
        <div><dt>Processor</dt><dd>Intel Core i5-8400 or AMD Ryzen 5 2600</dd></div>
        <div><dt>Memory</dt><dd>8 GB RAM</dd></div>
        <div><dt>Graphics</dt><dd>NVIDIA GeForce GTX 1650 or AMD Radeon RX 570, with DirectX 11</dd></div>
        <div><dt>Storage</dt><dd>2 GB of available space</dd></div>
        <div><dt>Network</dt><dd>Broadband internet connection listed on Steam</dd></div>
      </dl>
      <p><strong>Recommended on Steam.</strong> Windows 11, Intel Core i5-10400 or AMD Ryzen 5 3600, 16 GB RAM, NVIDIA GeForce GTX 1660 Super or AMD Radeon RX 5600 XT, DirectX 12 and 4 GB of free storage. These are Steam’s listed specifications, so check the <a href={site.steam + '#sysreqs'}>official system requirements</a> before buying for an older PC.</p>
      <p>Outside the US, check Steam while signed in to see the price in your store region. For tool, vehicle and upgrade costs after you start playing, see <a href="/prices">in-game prices</a>.</p>
    </section>
    <section className={s.section}>
      <h2>How to Buy and Install Moon Sweepers on Steam</h2>
      <ol>
        <li>Open the <a href={site.steam}>Steam listing for Moon Sweepers by DragDrop Games</a>. The store app ID is 5335510, which helps distinguish it from similarly named games.</li>
        <li>Choose the base game to buy Moon Sweepers on its own. If Steam also shows bundles, compare the included games and the final checkout price.</li>
        <li>After purchase, open your Steam Library on Windows, select Moon Sweepers and choose Install. Steam Deck owners can check Valve’s compatibility notes in the game’s Library entry.</li>
      </ol>
    </section>
    <section className={s.section}>
      <h2>What You Can Play Solo or With Friends</h2>
      <div className={play.answers}>
        <article><h3>Single-player</h3><p>Start with a toothbrush, sell your first load of lunar dust and spend the proceeds on better tools. If you enjoy gradually replacing manual work with conveyors and machines, see how the <a href="/guides/automation-guide">production loop</a> develops.</p></article>
        <article><h3>Online co-op for up to 16 players</h3><p>Steam lists online co-op. Your crew can split up to clean different areas or work together to fill the same depot. If you plan to host a shared world, bookmark the <a href="/guides/save-recovery-guide">save and backup guide</a> so you know where the host’s files are.</p></article>
      </div>
      <p>The Steam listing also shows Steam Cloud, Steam Achievements, Family Sharing and full controller support. The store’s language table separates interface text, audio and subtitles, so check the column that matters to you.</p>
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
