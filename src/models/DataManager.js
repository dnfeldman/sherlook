import React from 'react';
import { EventEmitter } from 'events';
import * as d3 from 'd3';

const emitter = new EventEmitter();

// Define variables that will 'hold' current scope
let data = [];
let columnDefinitions = [];
let _columnKeys = [];
let selectedColumn = null;
let size = data.length;
let visibleData = data.concat();
let fileUploaded = false;

const filters = {};

function _summarizeByColumnKey(columnKey) {
  let summaryData = [];
  const columnDefinition = _getColumnDefinition(columnKey);

  if(_isDimension(columnKey)) {
    summaryData = d3.nest()
      .key((row) => row[columnKey])
      .rollup((group) => {
        return {
          count: group.length,
        }
      })
      .entries(visibleData);

  } else if (_isMetric(columnKey)) {

    const values = visibleData.map((row) => parseFloat(row[columnKey]));
    const histogram = d3.histogram();

    const result = histogram(values).map((bin) => {
      const summary = { count: bin.length };
      return {
        key: bin.x0 + "-" + bin.x1,
        value: summary
      };
    });

    summaryData = result;
  }

  return {columnDefinition: columnDefinition, summary: summaryData};
}

function _getColumnDefinition(columnKey) {
  return columnDefinitions.find((def) => def.columnKey === columnKey);
}

function _isDimension(columnKey) {
  const columnDefinition = _getColumnDefinition(columnKey);

  if(columnDefinition) {
    return columnDefinition.dataType === "dimension";
  } else {
    return false;
  }
}

function _isMetric(columnKey) {
  const columnDefinition = columnDefinitions.find((def) => def.columnKey === columnKey);

  if(columnDefinition) {
    return columnDefinition.dataType === "metric";
  } else {
    return false;
  }
}

function _shouldKeepRow(row) {
  let keepRow = true;
  for (var columnKey of _columnKeys) {
    const filterBy = filters[columnKey];
    if(filterBy && _doesNotMatchFilter(row[columnKey], filterBy)) {
      keepRow = false;
    }
  }
  return keepRow;
}

function _doesNotMatchFilter(dataVal, filterBy) {
  return dataVal.toString().toLowerCase().indexOf(filterBy) === -1
}

function _regenerateVisibleData() {
  const newVisibleData = data.filter((row) => {
    return _shouldKeepRow(row);
  });

  visibleData = newVisibleData;
  size = newVisibleData.length;
}

function _updateColumnDefinition(columnKey, newDefinition) {
  const definitionIndex = columnDefinitions.map((def) => def.columnKey).indexOf(columnKey);
  const currentDefinition = columnDefinitions[definitionIndex];

  columnDefinitions[definitionIndex] = Object.assign({}, currentDefinition, newDefinition)
}

export default {
  subscribe(callback) {
    emitter.on('update', callback);
  },
  unsubscribe(callback) {
    emitter.off('update', callback);
  },

  setColumnFilter(columnKey, filterBy) {
    filters[columnKey] = filterBy.toString();
    _regenerateVisibleData();
    emitter.emit('update');
  },
  setSelectedColumn(columnKey) {
    selectedColumn = columnKey;
    emitter.emit('update');
  },
  updateColumnDefinition(columnKey, columnDefinition) {
    _updateColumnDefinition(columnKey, columnDefinition);
    emitter.emit('update');
  },
  setDataAndColumnDefinitions(dataObject) {
    data = dataObject.data;
    columnDefinitions = dataObject.columnDefinitions;
    fileUploaded = true;
    _columnKeys = columnDefinitions.map((columnDefinition) => columnDefinition.columnKey);
    _regenerateVisibleData();

    emitter.emit('update');
  },


  getState() {
    return {
      data: visibleData,
      numRows: size,
      columnDefinitions: columnDefinitions,
      selectedColumn: selectedColumn,
      columnSummary: _summarizeByColumnKey(selectedColumn),
      fileUploaded: fileUploaded,
    }
  }
}