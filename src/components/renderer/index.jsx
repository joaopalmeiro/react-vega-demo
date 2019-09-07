import React from 'react';
import PropTypes from 'prop-types';

import * as vega from 'vega';
import vegaEmbed from 'vega-embed';

import {
  isDefined,
  isEqualPadding,
  isEqualData,
  isEqualSpec,
} from '../../utils';

const propTypes = {
  className: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.object),
  enableHover: PropTypes.bool,
  height: PropTypes.number,
  padding: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
  }),
  renderer: PropTypes.oneOf(['svg', 'canvas']),
  spec: PropTypes.object.isRequired,
  width: PropTypes.number,
};

const defaultProps = {
  className: '',
  data: [],
  enableHover: true,
  height: undefined,
  padding: undefined,
  renderer: 'svg',
  width: undefined,
};

class Renderer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.rendererRef = React.createRef();
  }

  componentDidMount() {
    const { spec } = this.props;

    this.createView(spec);
  }

  componentDidUpdate(prevProps) {
    const { spec } = this.props;

    this.updateView(spec, prevProps);
  }

  updateData(name, value) {
    if (value) {
      this.view.change(
        name,
        vega
          .changeset()
          .remove(() => true)
          .insert(value),
      );
    }
  }

  async createView(spec) {
    if (spec) {
      const { props } = this;
      try {
        const { view } = await vegaEmbed(
          this.rendererRef.current,
          spec,
          this.setEmbeddingOptions(),
        );

        this.view = view;

        if (spec.data && props.data.length) {
          spec.data
            .filter(d => d.name === 'table')
            .forEach(d => {
              this.updateData(d.name, props.data);
            });
        }

        view.run();
      } catch (e) {
        this.clearView();
      }
    } else {
      this.clearView();
    }

    return this;
  }

  updateView(spec, prevProps) {
    if (!isEqualSpec(spec, prevProps.spec)) {
      this.clearView();
      this.createView(spec);
    } else if (this.view) {
      const { props } = this;
      let changed = false;

      ['width', 'height', 'renderer']
        .filter(field => props[field] !== prevProps[field])
        .forEach(field => {
          if (isDefined(props[field])) {
            this.view[field](props[field]);
            changed = true;
          } else {
            this.view[field](spec[field]);
            changed = true;
          }
        });

      if (!isEqualPadding(props.padding, prevProps.padding)) {
        this.view.padding(props.padding || spec.padding);
        changed = true;
      }

      if (spec.data) {
        spec.data
          .filter(d => d.name === 'table')
          .forEach(d => {
            const oldData = prevProps.data;
            const newData = props.data;
            if (props.data.length && !isEqualData(oldData, newData)) {
              this.updateData(d.name, newData);
              changed = true;
            } else if (!props.data.length && !isEqualData(oldData, newData)) {
              this.updateData(d.name, d.values);
              changed = true;
            }
          });
      }

      if (!prevProps.enableHover && props.enableHover) {
        this.view.hover();
        changed = true;
      }

      if (changed) {
        this.view.run();
      }
    }

    return this;
  }

  clearView() {
    if (this.view) {
      this.view.finalize();
      this.view = null;
    }

    return this;
  }

  setEmbeddingOptions() {
    const { props } = this;

    return {
      hover: props.enableHover,
      downloadFileName: 'Basic Data Visualization with React and Vega',
      renderer: props.renderer,
      actions: {
        export: true,
        source: true,
        compiled: true,
        editor: true,
      },
      i18n: {
        SOURCE_ACTION: 'View Vega Spec',
      },
      ...(props.width && { width: props.width }),
      ...(props.height && { height: props.height }),
    };
  }

  render() {
    const { className } = this.props;

    return <div ref={this.rendererRef} className={className} />;
  }
}

Renderer.propTypes = propTypes;
Renderer.defaultProps = defaultProps;

export default Renderer;
