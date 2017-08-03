/* eslint-disable import/no-dynamic-require, react/no-danger */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import hljs from 'highlight.js/lib/highlight';
import Ansi from 'ansi-to-html';
import classNames from 'classnames/bind';
import styles from './test.css';

const ansi = new Ansi();
const cx = classNames.bind(styles);

class CodeSnippet extends Component {
  static displayName = 'CodeSnippet';

  static propTypes = {
    className: PropTypes.string,
    code: PropTypes.string,
    lang: PropTypes.string,
    highlight: PropTypes.bool,
    label: PropTypes.string,
    showLabel: PropTypes.bool
  };

  static defaultProps = {
    lang: 'bash',
    highlight: true,
    showLabel: false
  };

  componentDidMount() {
    if (this.props.lang !== 'bash') {
      this.highlightCode();
    }
  }

  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }

  highlightCode() {
    const { code, highlight } = this.props;
    if (highlight && code) {
      hljs.highlightBlock(this.node);
    }
  }

  render() {
    const { className, code, lang, highlight, label, showLabel } = this.props;
    let codeHtml = code || '';

    // Add - expected + actual to top of diffs
    if (lang === 'diff') {
      const expected = `<span class='${cx('code-diff-expected')}'>+ expected</span>`;
      const actual = `<span class='${cx('code-diff-actual')}'>- actual</span>`;
      codeHtml = `${expected}&nbsp;&nbsp;${actual}\n\n${code}`;
    } else if (lang === 'bash') {
      codeHtml = ansi.toHtml(
        codeHtml
          .replace(/✔/g, '\u001b[32m✔\u001b[0m')
          .replace(/✖/g, '\u001b[31m✖\u001b[0m')
      );
    }

    const cxName = cx(className, lang, { hljs: !highlight });

    return !!code && (
      <pre className={ cxName } ref={ node => (this.node = node) }>
        <code dangerouslySetInnerHTML={ { __html: codeHtml } } />
        { !!label && showLabel && <span className={ cx('code-label') }>{ label }</span> }
      </pre>
    );
  }
}

export default CodeSnippet;
