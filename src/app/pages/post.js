import App from '../components/App';

const Page = props => (
  <App>
    <h1>{props.url.query.id}</h1>
    <p>This is the blog post content.</p>
  </App>
);

export default Page