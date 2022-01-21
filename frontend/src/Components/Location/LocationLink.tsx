import {Location} from "../../Api/Types";
import {Link} from "react-router-dom";

export function LocationLink({to}: { to: Location }) {
    return <Link to={`/locations/${to.id}`}>{to.name}</Link>
}
