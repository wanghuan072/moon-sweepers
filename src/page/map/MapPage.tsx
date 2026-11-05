import PageHero from '@/components/layout/PageHero';
import PageSchema from '@/seo/PageSchema';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import {markers} from '@/lib/map/markers';
import {routeMetadata} from '@/seo/metadata';
import InteractiveMap from './InteractiveMap';
import s from '@/style/page/map/map.module.css';
export const metadata = routeMetadata('/map');
const locationGroups = ['Flags', 'Lunar sites', 'Stations'] as const;
export default function MapPage(){return <div className={`container ${s.page}`}><PageSchema path="/map"/><Breadcrumb items={[{title:'Interactive map'}]}/><PageHero eyebrow={<>EXPLORE · DISCOVER · CLEAN</>} title={<>Moon Sweepers Interactive Map</>} description={<>Looking for a flag or planning a trip to a lunar site? Find 195 flags, 26 lunar sites and four stations on the interactive map. Search a name or coordinate, check the reward and mark places you have visited.</>}></PageHero><InteractiveMap markers={markers} textured={process.env.NODE_ENV === "development"}/><section className={s.sources}><h2>How to find flags and lunar sites on the map</h2><p>Drag the globe in any direction and scroll to zoom, or switch to the flat map. Select a marker or list entry for its coordinates and discovery reward. Mark visited locations to track your route in this browser; progress does not sync with your game save.</p><p>Coordinates use whole-degree latitude and longitude, north up and 0° longitude at the flat map centre. Polar stations are placed at longitude 0° for display; longitude is immaterial at the poles. Nearby markers can overlap: zoom or select them from the list.</p><p>Location data: <a href="https://wikily.gg/moon-sweepers/interactive-map" target="_blank" rel="noopener noreferrer">Wikily Interactive Map ↗</a>.</p><a href="/wiki/vehicles">Choose a vehicle for your next trip →</a></section>
    <section className={s.sources} aria-labelledby="location-directory">
      <h2 id="location-directory">Moon Sweepers Location Directory</h2>
      <p>Look up coordinates for flags, lunar sites and stations, then use the map to plan your route.</p>
      {locationGroups.map(kind => <details key={kind}>
        <summary>{kind} ({markers.filter(marker => marker.kind === kind).length})</summary>
        <ul>{markers.filter(marker => marker.kind === kind).map(marker => <li key={marker.id}>
          <strong>{marker.name}</strong> · {marker.coordinate}{marker.reward > 0 && <> · ${marker.reward} discovery reward</>}
        </li>)}</ul>
      </details>)}
    </section>
  </div>;
}
