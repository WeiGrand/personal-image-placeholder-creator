/**
 * Created by heweiguang on 2019-01-19.
 */

import React, { Component } from 'react';
import './style.scss';

const dpr = window.devicePixelRatio || 1;

class Config extends Component {
  state = {
    config: [{
      width: 0,
      height: 0,
      count: 0,
      isSameColor: true,
      isHighDpi: dpr > 1
    }]
  }

  handleChange = index => name => e => {
    const newConfig = this.state.config.concat();
    const { value, type } = e.target;

    if (type === 'radio') {
      newConfig[index][name] = value === 'true';
    } else {
      const parseValue = parseInt(value);

      if (parseValue || value === '') {
        newConfig[index][name] = parseValue;
      }
    }

    this.setState({
      config: newConfig
    });
  }

  handleAddItem = () => {
    const newConfig = this.state.config.concat();

    newConfig.push({
      width: 0,
      height: 0,
      count: 0,
      isSameColor: true,
      isHighDpi: dpr > 1
    });

    this.setState({
      config: newConfig
    });
  }

  handleDeleteItem = index => () => {
    const newConfig = this.state.config.concat();

    newConfig.splice(index, 1);

    this.setState({
      config: newConfig
    });
  }

  handleCreate = () => {
    this.props.handleCreate(this.state.config);
  }

  render () {
    const {
      config
    } = this.state;

    return (
      <div className="nes-container with-title">
        <h2 className="title">Config</h2>

        <div className="config-form">
          {
            config.map((c, i) => {

              return <Item
                key={i}
                data={c}
                add={i === 0}
                onChange={this.handleChange(i)}
                handleAddItem={this.handleAddItem}
                handleDeleteItem={this.handleDeleteItem(i)}
                index={i}
              />
            })
          }

          <div className="config-form-button">
            <button
              type="button"
              className="nes-btn is-primary"
              onClick={this.handleCreate}
            >
              Create!
            </button>
          </div>
        </div>
      </div>
    )
  }
}

class Item extends Component {
  render () {
    const {
      index,
      data: {
        width,
        height,
        count,
        isSameColor,
        isHighDpi
      },
      add,
      onChange,
      handleAddItem,
      handleDeleteItem
    } = this.props;

    return (
      <div className="config-form-item">
        <div className="operator-add">
          {
            add ? <button
              type="button"
              className="nes-btn is-success"
              onClick={handleAddItem}
            >
              +
            </button> : <button
              type="button"
              className="nes-btn is-error"
              onClick={handleDeleteItem}
            >
              -
            </button>
          }
        </div>

        <div className="nes-field text-field">
          <label htmlFor="name_field">Width (px)</label>
          <input
            type="text"
            className="nes-input"
            placeholder="100"
            value={width > 0 ? width : ''}
            onChange={onChange('width')}
          />
        </div>

        <div className="operator-x">
          <i className="nes-icon close is-small"/>
        </div>

        <div className="nes-field text-field">
          <label htmlFor="name_field">Height (px)</label>
          <input
            type="text"
            className="nes-input"
            placeholder="100"
            value={height > 0 ? height : ''}
            onChange={onChange('height')}
          />
        </div>

        <div className="radio-field">
          <label htmlFor="name_field">Same Color</label>
          <div className="radio">
            <label>
              <input
                type="radio"
                className="nes-radio"
                checked={isSameColor}
                name={`is-same-color.${index}`}
                value="true"
                onChange={onChange('isSameColor')}
              />
                <span>Yes</span>
            </label>
            <label>
              <input
                type="radio"
                className="nes-radio"
                checked={!isSameColor}
                name={`is-same-color.${index}`}
                value="false"
                onChange={onChange('isSameColor')}
              />
                <span>No</span>
            </label>
          </div>
        </div>

        <div className="radio-field">
          <label htmlFor="name_field">High DPI</label>
          <div className="radio">
            <label>
              <input
                type="radio"
                className="nes-radio"
                checked={isHighDpi}
                value="true"
                name={`is-high-dpi.${index}`}
                onChange={onChange('isHighDpi')}
              />
              <span>Yes</span>
            </label>
            <label>
              <input
                type="radio"
                className="nes-radio"
                checked={!isHighDpi}
                value="false"
                name={`is-high-dpi.${index}`}
                onChange={onChange('isHighDpi')}
              />
              <span>No</span>
            </label>
          </div>
        </div>

        <div className="nes-field count-field">
          <label htmlFor="name_field">Count</label>
          <input
            type="text"
            className="nes-input"
            placeholder="1"
            value={count > 0 ? count : ''}
            onChange={onChange('count')}
          />
        </div>
      </div>
    )
  }
}

export default Config;
