import React from 'react'
import ReactDOM from 'react-dom'
import styles from './styles.module.css'
import classnames from 'classnames'
import * as d3 from 'd3'

export class FileUploader extends React.Component {
  constructor(props, refs) {
    super(props, refs);
    this._handleChange = this._handleChange.bind(this);
    this._processFile = this._processFile.bind(this);
    this._prepareColumnDefinitions = this._prepareColumnDefinitions.bind(this);
    this._replaceColumnNameWithColumnKey = this._replaceColumnNameWithColumnKey.bind(this);
  }

  _handleChange(e) {
    const file = ReactDOM.findDOMNode(this.refs.csv).files[0];
    if(!file) {
      return;
    }

    this._processFile(file);
  }

  _processFile(file) {
    const reader = new FileReader();

    reader.onload = function(e) {
      const csv = reader.result;

      const result = d3.csvParse(csv);

      const columnDefinitions = this._prepareColumnDefinitions(result.columns);
      const data = this._replaceColumnNameWithColumnKey(result, columnDefinitions);

      this.props.handleFileUpload(data, columnDefinitions);
    }.bind(this);

    reader.readAsText(file, 'UTF-8');
  }

   _prepareColumnDefinitions(columns) {
    return columns.map((name) => {
      return {
        columnKey: name.replace(/\s/g, "").toLowerCase(),
        displayName: name,
        dataType: "dimension",
        showInTable: true
      }
    });
  }

  _replaceColumnNameWithColumnKey(data, _columnDefinitions) {
  const nameToKeyMap = {};
  for(let columnDefinition of _columnDefinitions){
    nameToKeyMap[columnDefinition.displayName] = columnDefinition.columnKey;
  }

  return data.map((row) => {
    const parsedRow = {};
    for(let columnName of Object.keys(row)) {
      const columnKey = nameToKeyMap[columnName];
      parsedRow[columnKey] = row[columnName];
    }

    return parsedRow;
  });
  }

  render() {
    return (
      <div className={classnames(styles.fileUploader)}>
        <label htmlFor="file" >
          <input type="file" id="file" accept=".csv" onChange={this._handleChange} ref="csv" />
        </label>
      </div>
    )
  }
}

FileUploader.propTypes = {
  handleFileUpload: React.PropTypes.func.isRequired
};

export default FileUploader;