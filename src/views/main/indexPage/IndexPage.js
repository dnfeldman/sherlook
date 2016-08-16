import React, { PropTypes as T } from 'react';
import {Link} from 'react-router';

import styles from './styles.module.css';

export class IndexPage extends React.Component {
  render() {
    return (
      <div className={styles.content}>
        <h1>Hello from generated content</h1>
        <p>
          <Link to="about">About</Link>
        </p>
      </div>
    )
  }
}

export default IndexPage;
