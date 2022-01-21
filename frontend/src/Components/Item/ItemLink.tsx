import {Item} from "../../Api/Types";
import {Link} from "react-router-dom";

export function ItemLink({to}: { to: Item }) {
    return <Link to={`/items/${to.id}`}>{to.name}</Link>
}
