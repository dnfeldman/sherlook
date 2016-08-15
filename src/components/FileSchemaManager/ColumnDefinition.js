import React from 'react'
import { DragSource } from 'react-dnd';


const Types = {
  COLUMN_DEFINITION: 'columnDefinition'
};

const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  margin: '.5rem',
  backgroundColor: 'white',
  display: 'flex',
  flexFlow:'column wrap',
  cursor: 'move'
};

/**
 * Implements the drag source contract.
 */
const columnSource = {
  beginDrag(props) {
    return {columnKey: props.columnDefinition.columnKey};
  },

  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      return;
    }
  }
};

/**
 * Specifies the props to inject into your component.
 */
function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
}

const propTypes = {
  displayName: React.PropTypes.string.isRequired,
  // Injected by React DnD:
  isDragging: React.PropTypes.bool.isRequired,
  connectDragSource: React.PropTypes.func.isRequired,
  connectDragPreview: React.PropTypes.func
};

class ColumnDefinition extends React.Component {
  constructor(props) {
    super(props);

    this._handleDataTypeChange = this._handleDataTypeChange.bind(this);
    this._handleShowInTableChange = this._handleShowInTableChange.bind(this);
  }

  _handleDataTypeChange(event) {
    const newDataType = event.target.value;

    const { onColumnDefinitionChange, columnDefinition } = this.props;

    onColumnDefinitionChange(columnDefinition.columnKey, {dataType: newDataType});
  }

  _handleShowInTableChange(event) {
    const showInTable = event.target.checked;

    const { onColumnDefinitionChange, columnDefinition } = this.props;

    onColumnDefinitionChange(columnDefinition.columnKey, {showInTable: showInTable});
  }

  render() {
    const { isDragging, connectDragSource, connectDragPreview, columnDefinition } = this.props;
    const opacity = isDragging ? 0.4 : 1;
    connectDragPreview(<div style={{ ...style, opacity }}>{this.props.columnDefinition.columnName}</div>);

    return connectDragSource(
      <div style={{ ...style, opacity }}>
        <div style={{"flex":1, "text-align":"center", "padding-bottom":3}}>{columnDefinition.displayName}</div>
        <div style={{"flex":1, "display": 'inline-block'}}>
          <label>
            Data Type
            <select value={columnDefinition.dataType} onChange={this._handleDataTypeChange}>
              <option value = "dimension">Dimension</option>
              <option value = "metric">Metric</option>
            </select>
          </label>
          <label style={{"float":"right"}}>
            Show in table
            <input type="checkbox" checked={columnDefinition.showInTable} onChange={this._handleShowInTableChange}/>
          </label>
        </div>
      </div>
    );
  }
}

export default DragSource(Types.COLUMN_DEFINITION, columnSource, collect)(ColumnDefinition);