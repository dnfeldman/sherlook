import React, { PropTypes as T } from 'react'

import Header from 'components/Header/Header'
import FileUploader from 'components/FileUploader/FileUploader'
import ColumnDefinitionManager from 'components/ColumnDefinitionManager/ColumnDefinitionManager'
import FileViewer from 'components/FileViewer/FileViewer'
import Visualizer from 'components/Visualizer/Visualizer'
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import DataManager from '../../models/DataManager.js'

import styles from './styles.module.css'

class Container extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = DataManager.getState();
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onColumnSelect = this._onColumnSelect.bind(this);
    this._handleFileUpload = this._handleFileUpload.bind(this);
    this._onColumnDefinitionChange = this._onColumnDefinitionChange.bind(this);
  }
  componentWillMount() {
    DataManager.subscribe(this._onFilterChange);
  }

  componentWillUnmount() {
    DataManager.unsubscribe(this._onFilterChange);
  }

  _onFilterChange(columnKey, event) {
    if(event) {
      const filterBy = event.target.value.toString().toLowerCase();
      DataManager.setColumnFilter(columnKey, filterBy);
      this.setState(DataManager.getState());
    }
  }

  _onColumnSelect(columnKey) {
    DataManager.setSelectedColumn(columnKey);
    this.setState(DataManager.getState());
  }

  _handleFileUpload(data, columnDefinitions) {
    DataManager.setDataAndColumnDefinitions({
      data: data,
      columnDefinitions: columnDefinitions
    });

    this.setState(DataManager.getState());
  }

  _onColumnDefinitionChange(columnKey, newDefinition) {
    DataManager.updateColumnDefinition(columnKey, newDefinition);

    this.setState(DataManager.getState());
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <Header>
          <FileUploader handleFileUpload={this._handleFileUpload}/>
        </Header>
        <div className={styles.leftPanel}>
          <ColumnDefinitionManager columnDefinitions={this.state.columnDefinitions} onColumnDefinitionChange={this._onColumnDefinitionChange}/>
        </div>
        <div className={styles.content}>
          <Visualizer selectedColumn={this.state.selectedColumn} columnSummary={this.state.columnSummary} handleSelectColumnEvent={this._onColumnSelect}/>
          <FileViewer
            data={this.state.data}
            columnDefinitions={this.state.columnDefinitions}
            onFilterChange={this._onFilterChange}
            numRows={this.state.numRows}
            fileUploaded={this.state.fileUploaded}/>
        </div>
      </div>
    )
  }
}

Container.contextTypes = {
  router: T.object
};

export default DragDropContext(HTML5Backend)(Container);
