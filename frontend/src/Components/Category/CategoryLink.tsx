import {Category} from "../../Api/Types";
import {Link} from "react-router-dom";

export function CategoryLink({to}: { to: Category }) {
    return <Link to={`/categories/${to.id}`}>{to.name}</Link>
}
