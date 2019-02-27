import ButtonBase from '@material-ui/core/ButtonBase';

import { Link } from '../../functions/routes';
import { href } from '../../functions/paths';

const LinkButtonBase = props => {
  return <Link route={props.route} params={props.params}>
    <ButtonBase href={href(props.route, props.params)} {...props}>
      {props.children}
    </ButtonBase>
  </Link>;
};

export default LinkButtonBase;