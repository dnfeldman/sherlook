import React from 'react'
import ColumnChart from '../Charts/ColumnChart'
import styles from './styles.module.css'
import classnames from 'classnames/bind'
import { DropTarget } from 'react-dnd';


const visualizerTarget = {
  drop(props, monitor) {
    const item = monitor.getItem();
    props.handleSelectColumnEvent(item.columnKey);
  }
};

function collect(connect, monitor) {
  return {
    highlighted: monitor.canDrop(),
    isOver: monitor.isOver(),
    connectDropTarget: connect.dropTarget(),
  };
}

class Visualizer extends React.Component {

  // [{key: columnKey1, values: {count: 10, ...}}, {key: columnKey2, ....}]
  _buildChartPropsFromData(columnSummary) {
    const data = columnSummary.summary;
    const columnDefinition = columnSummary.columnDefinition;

    const parsedData = data.map((row) => {
      return {key: row.key, count: row.value.count}
    });

    return {
      data: parsedData,
      xKey: "key",
      xLabel: columnDefinition.displayName,
      yLabel: "Count",
      yKey: "count"
    }
  }

  _renderVisualizer() {
    if (this.props.selectedColumn && this.props.columnSummary) {
      const chartProps = this._buildChartPropsFromData(this.props.columnSummary);
      return <div>
        <h3>Displaying summary for {chartProps.xLabel}</h3>
        <ColumnChart {...chartProps}/>
        </div>;
    } else {
      return <div>No column selected</div>;
    }
  }

  render() {
    const { connectDropTarget, highlighted} = this.props;

    let cx = classnames.bind(styles);

    return connectDropTarget(
      <div className={cx('visualizer', {'is-drop-target': highlighted})}>
        {this._renderVisualizer()}
      </div>
    )
  }
}

Visualizer.propTypes = {
  selectedColumn: React.PropTypes.string,
  handleSelectColumnEvent: React.PropTypes.func,
  columnSummary: React.PropTypes.object
};

export default DropTarget('columnDefinition', visualizerTarget, collect)(Visualizer)