/**
 * Created by heweiguang on 2019-01-19.
 */

import React, { Fragment, Component } from 'react';
import JSZip  from 'jszip';
import 'file-saver';
import Clipboard from 'react-clipboard.js';
import './style.scss';

const { saveAs } = window;

const zip = new JSZip();

class Product extends Component {
  state = {
    isConfirming: false
  }

  handlePreview = (url) => {
    const newTab = window.open();
    newTab.document.body.innerHTML = `<img src="${url}" alt="" />`;
  }

  handleDownload = () => {
    const { products } = this.props;

    const name = `imageCreator${new Date().toISOString()}.zip`;

    const root = zip.folder(name);

    products.forEach(product => {
      const isDifferentColor = isArray(product);

      const {
        width,
        height,
        isHighDpi,
        isValid
      } = isDifferentColor ? product[0] : product;

      if (!isValid) return;

      const folder = root.folder(`${width}X${height}-${isDifferentColor ? 'DIFFERENT' : 'SAME'}${isHighDpi ? '-HD' : ''}`);

      if (isDifferentColor) {
        product.forEach((pro, index) => {
          const { dataUrl } = pro;

          folder.file(`${width}X${height}.${index}.jpg`, dataUrl.split(',')[1], { base64: true });
        });
      } else {
        const { dataUrl, count } = product;

        for (let i = 0; i < count; i++) {
          folder.file(`${width}X${height}.${i}.jpg`, dataUrl.split(',')[1], { base64: true });
        }
      }
    });

    zip.generateAsync({ type: "blob" })
    .then(function(content) {
      saveAs(content, name);
    });
  }

  handleRestart = () => {
    this.setState({
      isConfirming: true
    });
  }

  handleConfirm = () => {
    Object.keys(zip.files).forEach(key => {
      zip.remove(key);
    });

    console.log(zip);

    this.props.handleRestart();
  }

  handleCancel = () => {
    this.setState({
      isConfirming: false
    });
  }

  render () {
    const { products } = this.props;
    const { isConfirming } = this.state;

    return (
      <div className="nes-container with-title product">
        <h2 className="title">Product</h2>

        <p>Success! I have created:</p>
        {renderListDetails(products)}
        <p>for you.</p>

        {renderTotal(products)}

        <p>Here are the list:</p>

        {
          products.map((pro, i) => {
            if (isArray(pro)) {
              const {
                width,
                height,
                count
              } = pro[0];

              return (
                <div key={i}>
                  <label htmlFor="inline_field">{width} X {height} ({count})</label>
                  {
                    pro.map((p, index) => {
                      const {
                        dataUrl,
                        isValid,
                        color
                      } = p;

                      return (
                        <div className="nes-field is-inline" key={index}>
                          <div className="color" style={{ background: color }}/>
                          <label>
                            {color}
                          </label>
                          <input
                            type="text"
                            className="nes-input is-success"
                            value={isValid ? dataUrl : 'Invalid file size'}
                            readOnly
                          />
                          {
                            isValid ?
                              <button
                                type="button"
                                className="nes-btn is-primary"
                                onClick={
                                  () => {
                                    this.handlePreview(dataUrl);
                                  }
                                }
                              >Preview</button> :
                              <button type="button" className="nes-btn is-disabled">Preview</button>
                          }
                          {
                            isValid ?
                              <Clipboard data-clipboard-text={dataUrl} className="nes-btn is-success">
                                Copy
                              </Clipboard> :
                              <button type="button" className="nes-btn is-disabled">Copy</button>
                          }
                        </div>
                      )
                    })
                  }
                </div>
              )
            }

            const {
              width,
              height,
              dataUrl,
              isValid,
              color,
              count
            } = pro;

            return (
              <div key={i}>
                <label htmlFor="inline_field">{width} X {height} ({count})</label>
                <div className="nes-field is-inline">
                  <div className="color" style={{ background: color }}/>
                  <label>
                    {color}
                  </label>
                  <input
                    type="text"
                    className="nes-input is-success"
                    value={isValid ? dataUrl : 'Invalid file size'}
                    readOnly
                  />
                  {
                    isValid ?
                      <button
                        type="button"
                        className="nes-btn is-primary"
                        onClick={
                          () => {
                            this.handlePreview(dataUrl);
                          }
                        }
                      >Preview</button> :
                      <button type="button" className="nes-btn is-disabled">Preview</button>
                  }
                  {
                    isValid ?
                      <Clipboard data-clipboard-text={dataUrl} className="nes-btn is-success">
                        Copy
                      </Clipboard> :
                      <button type="button" className="nes-btn is-disabled">Copy</button>
                  }
                </div>
              </div>
            )
          })
        }

        <div className="product-button">
          <button
            type="button"
            className="nes-btn is-success"
            onClick={this.handleDownload}
          >
            Download ZIP
          </button>
          {
            isConfirming ? (
              <Fragment>
                Are you sure ?
                <button
                  type="button"
                  className="nes-btn is-primary"
                  onClick={this.handleConfirm}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className="nes-btn is-error"
                  onClick={this.handleCancel}
                >
                  No
                </button>
              </Fragment>
            ) : (
              <button
                type="button"
                className="nes-btn is-warning"
                onClick={this.handleRestart}
              >
                Restart
              </button>
            )
          }
        </div>
      </div>
    )
  }
}

function isArray (object) {
  return Object.prototype.toString.call(object) === "[object Array]"
}

function renderListDetails (products) {

  return (
    <ul className="nes-list is-circle">
      {
        products.map((pro, index) => {
          const isDifferent = isArray(pro) && pro[0]['count'] > 1;
          const { width, height, isHighDpi, count, color, isValid } = isDifferent ? pro[0] : pro;

          return isValid ? (
            <li key={index}>{renderHighlight(color, count)} images of {renderHighlight(color, width)}X{renderHighlight(color, height)} that have {renderHighlight(color, isDifferent ? 'different' : 'same')} background color{renderHighlight(color, isHighDpi ? ' for high dpi screen' : '')}.</li>
          ) : (
            <li key={index}>{renderHighlight(color, count)} images of {renderHighlight(color, width)}X{renderHighlight(color, height)} have invalid size.</li>
          )
        })
      }
    </ul>
  );
}

function renderHighlight (color, string) {
  return <span style={{ color }}>{string}</span>
}

function renderTotal (products) {
  const { total, invalid } = products.reduce((prev, current) => {
    const {
      count,
      isValid
    } = isArray(current) ? current[0] : current;

    prev.total += count;

    if (!isValid) {
      prev.invalid += count;
    }

    return prev;
  }, { total: 0, invalid: 0 });

  return (
    <p>Total: {total} images{invalid > 0 ? ` including ${invalid} of invalid sizes` : ''}.</p>
  )
}

export default Product;
