import BlocksSection from './BlocksSection';
import BuildZoneSection from './BuildZoneSection';

export default function Calculator() {
    return <div className="row">
        <div className="col-md-4">
            <BlocksSection />
        </div>
        <div className="col-md-4">
            <BuildZoneSection />
        </div>
    </div>
}