import Button from '@material-ui/core/Button';

import { Link } from '../../functions/routes';
import { href } from '../../functions/paths';

const LinkButton = props => {
  return <Link route={props.route} params={props.params}>
    <Button href={href(props.route, props.params)} {...props}>
      {props.children}
    </Button>
  </Link>;
};

export default LinkButton;