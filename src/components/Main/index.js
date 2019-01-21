/**
 * Created by heweiguang on 2019-01-19.
 */

import React, { Component } from 'react';
import Config from '../Config';
// import Processing from '../Processing';
import Product from '../Product';
import { createProduct } from './utils';

class Main extends Component {
  state = {
    status: 0,
    products: []
  }

  handleCreate = (config) => {
    const imagesMap = {};

    config.forEach(cfg => {
      const { width, height, isSameColor, isHighDpi } = cfg;

      const name = `${width}x${height}.${isSameColor ? 1 : 0}.${isHighDpi ? 1 : 0}`;

      if (!imagesMap[name]) {
        imagesMap[name] = cfg;

        imagesMap[name]['count'] = imagesMap[name]['count'] || 1;
      } else {
        imagesMap[name]['count'] += (cfg['count'] || 1);
      }
    });

    console.log(imagesMap);

    const products = Object.keys(imagesMap).map(key => {
      const cfg = imagesMap[key];
      const { isSameColor, count } = cfg;

      // return array
      if (!isSameColor && count > 1) {
        const result = [];

        for (let i = 0; i < count; i++) {
          result.push(createProduct(cfg));
        }

        return result;
      }

      return createProduct(cfg);
    });

    this.setState({
      products,
      status: 1
    });
  }

  handleRestart = () => {
    this.setState({
      status: 0,
      products: []
    })
  }

  render () {
    const { status, products } = this.state;

    switch (status) {
      case 0:
        return <Config
          handleCreate={this.handleCreate}
        />
      case 1:
        return <Product
          products={products}
          handleRestart={this.handleRestart}
        />
      default:
        return null
    }
  }
}

export default Main;
