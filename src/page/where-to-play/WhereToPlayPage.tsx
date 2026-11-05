import PageHero from '@/components/layout/PageHero';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import PageSchema from '@/seo/PageSchema';
import { routeMetadata } from '@/seo/metadata';
import { site } from '@/config/site';
import s from '@/style/common/listing.module.css';
import detail from '@/style/common/detail.module.css';
import play from './where-to-play.module.css';

export const metadata = routeMetadata('/where-to-play');

const regionalPrices = [
  ['United Kingdom', '£7.99', 'gb'],
  ['Euro area', '€8.99', 'de'],
  ['Japan', '¥1,150', 'jp'],
  ['Canada', 'CA$10.75', 'ca'],
  ['Australia', 'A$12.75', 'au'],
];

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
      <h2>Steam Prices by Region</h2>
      <p>These are standalone base-game prices from Steam in local currencies. The euro price was checked on the German store. Sign in to Steam to see what you would pay in your own store region, especially during a sale.</p>
      <div className={detail.prose}>
        <div className={detail.tableScroll}>
          <table aria-label="Regional Steam prices">
            <thead><tr><th scope="col">Region</th><th scope="col">Base game</th><th scope="col">Checked</th></tr></thead>
            <tbody>{regionalPrices.map(([region, price, country]) => <tr key={country}>
              <th scope="row"><a href={site.steam + '?cc=' + country}>{region}</a></th>
              <td>{price}</td>
              <td><time dateTime="2026-11-05">2026-11-05</time></td>
            </tr>)}</tbody>
          </table>
        </div>
      </div>
      <p>If a bundle is on offer, compare its cart total with the standalone price above. A bundle discount can look larger while still costing more if Moon Sweepers is the only game you want. The <a href="/prices">in-game price list</a> covers a different budget: the dust money you spend on tools, vehicles and upgrades after you start playing.</p>
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
      <p>On a laptop or a prebuilt desktop, look up the exact graphics chip before comparing it with the minimum GPU. The model name on the case usually tells you less than the hardware listed under Performance in Windows Task Manager. If you intend to build a large base, check the recommended configuration as well. The minimum specs are a starting point for comparing hardware, and performance can vary with your settings and what is happening in your world.</p>
    </section>
    <section className={s.section}>
      <h2>How to Buy and Install Moon Sweepers on Steam</h2>
      <ol>
        <li>Open the <a href={site.steam}>Steam listing for Moon Sweepers by DragDrop Games</a>. The store app ID is 5335510, which helps distinguish it from similarly named games.</li>
        <li>Choose the base game to buy Moon Sweepers on its own. If Steam also shows bundles, compare the included games and the final checkout price.</li>
        <li>After purchase, open your Steam Library on Windows, select Moon Sweepers and choose Install. Steam Deck owners can check Valve’s compatibility notes in the game’s Library entry.</li>
      </ol>
      <p>Buying for a friend? Check what they plan to play on before sending a gift. A friend with a PlayStation or Xbox controller can use supported controls on PC, but the Steam purchase is for the Windows game. If you are all buying for one co-op evening, agree who will host and have everyone install any pending Steam updates before you meet.</p>
      <p>Once it is installed, open the game and check whether the camera sensitivity and key bindings feel comfortable. You can get a sense of both on a short trip from the depot. Sweep enough dust for a delivery and return to sell it. That first loop is also a better introduction to the game than trying to plan an entire factory before you know what slows you down.</p>
    </section>
    <section className={s.section}>
      <h2>What You Can Play Solo or With Friends</h2>
      <p>In its <a href="/updates#update-1-1-preview">October 30 developer announcement</a>, DragDrop Games reported 600,000 players and a peak of around 70,000 playing at once during the first week. These figures describe launch-week activity.</p>
      <div className={play.answers}>
        <article><h3>Single-player</h3><p>Start with a toothbrush, sell your first load of lunar dust and spend the proceeds on better tools. If you enjoy gradually replacing manual work with conveyors and machines, see how the <a href="/guides/automation-guide">production loop</a> develops.</p></article>
        <article><h3>Online co-op for up to 16 players</h3><p>Steam lists online co-op. Your crew can split up to clean different areas or work together to fill the same depot. If you plan to host a shared world, bookmark the <a href="/guides/save-recovery-guide">save and backup guide</a> so you know where the host’s files are.</p></article>
      </div>
      <p>The Steam listing also shows Steam Cloud, Steam Achievements, Family Sharing and full controller support. The store’s language table separates interface text, audio and subtitles, so check the column that matters to you.</p>
      <p>If you are deciding whether to start solo, try a short route close to the depot. You get a feel for how quickly a small tool fills up and how much time you spend walking back to unload. When friends join, those same jobs give everyone something useful to do. One player can keep sweeping while another handles deliveries, and you can work out together whether to spend on more capacity or a vehicle.</p>
      <p>For a group that plans to return to the same Moon, agree on who keeps the shared world and what you want to buy next. A player who spends most of the session hauling dust may have a different upgrade in mind from someone cleaning a wide area by hand. Compare those bottlenecks before spending the crew’s earnings, especially if you are saving for a machine.</p>
    </section>
    <section className={s.section}>
      <h2>Platform FAQ</h2><div className={play.answers}>
      <article><h3>Is Moon Sweepers on PS5?</h3>
      <p>There is no confirmed PS5 release in the sources checked. Steam lists PlayStation controller support for the PC game.</p></article>
      <article><h3>Is Moon Sweepers on Xbox?</h3>
      <p>There is no confirmed Xbox console release in the sources checked. You can use a supported Xbox controller with the Windows Steam version.</p></article>
      <article><h3>Can you play Moon Sweepers on Mac?</h3>
      <p>There is no native Mac version listed on Steam. Check the game’s system requirements before buying for a Mac.</p></article>
      <article><h3>Is Moon Sweepers on Nintendo Switch?</h3>
      <p>No Nintendo Switch release was found in the official sources checked on November 5, 2026. Follow the <a href={site.news}>developer’s announcements</a> for platform updates.</p></article>
      <article><h3>Can you play Moon Sweepers on Steam Deck?</h3>
      <p>Valve rates Moon Sweepers Playable on Steam Deck. Start with the stable Proton version selected by Steam, as the compatibility record recommends stable Proton without naming a specific release. Valve’s test says the default Deck controls cover all game functions and show Deck button prompts, though some in-game text is small. The <a href="/updates#patch-1-0-4">1.0.4 patch notes</a> also document a startup fix for older Proton versions.</p></article></div>
    </section>
    <section className={s.section}>
      <h2>Before Your First Session</h2>
      <p>Start with the beginner guide if you want help making your first sale. If you have already watched someone play and are deciding whether the game suits you, look at what happens between upgrades. Early on you repeat short cleaning and delivery runs. Later, vehicles and production equipment shift some of the work toward planning routes, moving resources and keeping machines supplied.</p>
      <p>On a handheld, use the first run to check whether you can comfortably read the menus and purchase screens at your usual viewing distance. Try opening the upgrade screen as well as moving and sweeping. Being able to steer with the default controls is useful, but you will spend time comparing costs and reading prompts as your setup grows.</p>
      <div className={s.relatedLinks}>
        <a href="/guides/beginners-guide">Make your first dust delivery →</a>
        <a href="/updates">Read released patches and future plans →</a>
        <a href="https://steamcommunity.com/app/5335510/reviews/" target="_blank" rel="noopener noreferrer">Read Steam player reviews ↗</a>
      </div>
    </section>
  </div>;
}
