import PageHero from '@/components/layout/PageHero';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import PageSchema from '@/seo/PageSchema';
import SearchableReferenceTable from '@/components/content/SearchableReferenceTable';
import upgrades from '@/data/tools/upgrade-catalog.json';
import machines from '@/data/machines/machines.json';
import equipment from '@/data/wiki/category-overviews.json';
import { structures } from '@/data/wiki/structure-prices.json';
import wiki from '@/data/wiki/entries.json';
import { routeMetadata } from '@/seo/metadata';
import s from '@/style/common/listing.module.css';

export const metadata = routeMetadata('/prices');

const money = (price: number) => `$${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
const upgradeCategories = { matrix: 'Research', container: 'Containers', tool: 'Cleaning tools', gear: 'Suit gear' };
const rows = [
  ...upgrades.flatMap(item => item.costs.map((cost, index) => [
    item.title, upgradeCategories[item.kind as keyof typeof upgradeCategories],
    item.kind === 'tool' ? 'Base purchase' : item.id === 'collector-uplink' ? 'Starting unlock' : `Level ${index + 1}`, money(cost),
  ])),
  ...equipment.vehicles.tables[0].rows.map(([name, price]) => [name, 'Vehicles', 'Base purchase', price]),
  ...wiki.filter(entry => entry.category === 'vehicles').flatMap(entry =>
    (entry.tables ?? []).filter(table => table.title === 'Prices by vehicle').flatMap(table =>
      table.rows.flatMap(([vehicle, ...values]) => values.flatMap((price, index) =>
        /^Level \d+$/i.test(table.columns[index + 1] ?? '') && /^\$[\d,.]+$/.test(price)
          ? [[`${entry.title} · ${vehicle}`, 'Vehicle upgrades', table.columns[index + 1], price]]
          : [])))),
  ...machines.flatMap(item => typeof item.cost === 'number' ? [[item.title, 'Machines', item.costUnit === 'metre' ? 'Per metre' : 'Base purchase', money(item.cost)]] : []),
  ...equipment['joonas-robots'].tables[0].rows.map(([name, price]) => [name, 'Robots', 'Base purchase', price]),
  ...structures.map(item => [item.name, 'Structures', 'Base purchase', money(item.price)]),
];

export default function PricesPage() {
  return <div className={`container ${s.page}`}>
    <PageSchema path="/prices" />
    <Breadcrumb items={[{ title: 'In-Game Prices' }]} />
    <PageHero title="Moon Sweepers In-Game Prices" description="Compare tool, vehicle, machine and upgrade costs in one searchable list. Prices use in-game currency and exclude discounts." />
    <p>Looking for the real-world cost of the game? See <a href="/where-to-play">Steam price and supported platforms</a>.</p>
    <section className={s.section}>
      <h2>Equipment and Upgrade Price List</h2>
      <p>Base prices are for version 1.0.5. Upgrade rows show the cost of one level, excluding prerequisites. Conveyor belts are priced per metre.</p>
      <SearchableReferenceTable table={{ title: 'In-game prices', columns: ['Item', 'Category', 'Purchase', 'Price'], rows }} categoryColumn={1} searchPlaceholder="Search by item or vehicle…" />
      <p>For a shopping list that includes prerequisites and eligible discounts, use the <a href="/tools/upgrade-calculator">upgrade calculator</a>.</p>
      <div className={s.relatedLinks}>
        <a href="/wiki/cleaning-tools">Cleaning tool specifications →</a>
        <a href="/wiki/vehicles#vehicle-upgrades">Garage upgrades →</a>
        <a href="/wiki/machines">Machine costs and recipes →</a>
        <a href="/wiki/buildings">Building prices and data sources →</a>
      </div>
    </section>
  </div>;
}
