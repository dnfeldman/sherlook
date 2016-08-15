import React from 'react'
import {Table, Column, Cell} from 'fixed-data-table-2'
import styles from './styles.module.css'
import classnames from 'classnames'

const TextCell = ({rowIndex, data, col, ...props}) => (
  <Cell {...props}>
    {data[rowIndex][col]}
  </Cell>
);

class FileViewer extends React.Component {
  _renderHeader(label, colKey) {
    return (
      <div>
        <span>{label}</span>
        <div>
          <br />
          <input style={{width:90+'%'}} placeholder = "Filter..." onChange={this._onFilterChange.bind(this, colKey)}/>
        </div>
      </div>);
  }

  _onFilterChange(columnKey, event) {
    this.props.onFilterChange(columnKey, event)
  }

  _renderColumns(data, columnDefinitions) {
    const visible = columnDefinitions.filter((columnDefinition) => columnDefinition.showInTable);
    return visible.map(columnDefinition => {
      return <Column
        key={columnDefinition.columnKey}
        align="center"
        header={this._renderHeader.bind(this, columnDefinition.displayName, columnDefinition.columnKey)}
        cell={<TextCell data={data} col={columnDefinition.columnKey} />}
        width={200}
      />
    });
  }

  _renderTable() {
    if(this.props.fileUploaded) {
      return (
        <Table rowHeight={50}
               headerHeight={75}
               rowsCount={this.props.numRows}
               width={1000}
               height={600}
               {...this.props}>
          {this._renderColumns(this.props.data, this.props.columnDefinitions)}
        </Table>
      )
    } else {
      return <div>No data to display</div>
    }
  }

  render() {
    return (
      <div className={styles.fileViewer}>
        {this._renderTable()}
      </div>
    )
  }
}

FileViewer.propTypes = {
  data: React.PropTypes.array,
  columnDefinitions: React.PropTypes.array,
  onFilterChange: React.PropTypes.func.isRequired,
  fileUploaded: React.PropTypes.bool
};

export default FileViewer;