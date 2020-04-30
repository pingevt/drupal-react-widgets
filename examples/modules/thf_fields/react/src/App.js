import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import Tooltip from 'rc-tooltip';
// import Slider, { Range } from 'rc-slider';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const Handle = Slider.Handle;

const handle = (props) => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={value}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.wrapperAttrs.value,
      wrapperAttrs: props.wrapperAttrs
    }
  }

  componentDidMount = () => {
    this.props.id
  }

  onSliderChange = (value) => {
    this.setState({
      value: value
    });
  }

  render() {
    let prefix;
    let suffix;
    if (this.state.wrapperAttrs.prefix) {
      prefix = <span>{this.state.wrapperAttrs.prefix}</span>;
    }

    if (this.state.wrapperAttrs.suffix) {
      suffix = <span>{this.state.wrapperAttrs.suffix}</span>;
    }

    let stepVal = 0.01;
    if (this.state.wrapperAttrs.step != 'any') {
      stepVal = this.state.wrapperAttrs.step;
    }

    return (
      <div className="slider-wrapper">

        <div className="slider-input">
          {prefix}
          <input type="number" value={this.state.value} readOnly id={this.state.wrapperAttrs.id} name={this.state.wrapperAttrs.name} />
          {suffix}
        </div>

        <div className="slider-element">
          <Slider
            min={parseFloat(this.state.wrapperAttrs.min)}
            max={parseFloat(this.state.wrapperAttrs.max)}
            defaultValue={this.state.value}
            step={stepVal}
            tipFormatter={value => `${value}%`}
            handle={handle}
            onChange={this.onSliderChange}
          />
        </div>
      </div>
    );
  }
}

export default App;
