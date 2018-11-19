import App from '../components/App';
import { Link } from '../../functions/routes';

const PostLink = props => (
  <li>
    <Link route='post' params={{ id: props.id }}>
      <a>{props.title}</a>
    </Link>
  </li>
);


export default () => (
  <App>
    <h1>My Blog</h1>
    <ul>
      <li><PostLink id="hello" title="Hello" /></li>
      <li><PostLink id="learn" title="Learn" /></li>
      <li><PostLink id="deploy" title="Deploy" /></li>
    </ul>
    <p>Index Page</p>
  </App>
);