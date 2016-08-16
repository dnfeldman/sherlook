# Sherlook


### Description
From a user's perspective, I think the point of a data inspection tool is to provide an interactive environment 
where one could quickly get a feel for the data to see if further investigation is necessary.

From implementation standpoint, the tool should take great care at ensuring displayed data are consistent 
and accurate across the whole application. Otherwise, one might draw wrong conclusions from what's presented, 
which is usually leads to undesired consequences. It should also be general enough to support different
types of data, yet flexible enough to allow one to adapt it to one's needs.

Given those requirements, my primary goal was to create a somewhat usable demo on top of a modular structure 
that would be easy to reason about and extend/modify without sacrificing interactivity. I thought `React` 
would be best suited for this sort of task since it provides a natural way of splitting the application into 
components and encourages functional/stateless design. 
 
### Usage ([Demo](https://hriundel.github.io/sherlook/))

1) Upload a file
2) Set correct data type for each column. `dimension` assumes values in the column are nominal. 
   `metric` assumes values are numeric and computes a histogram based on that information
2) Drag a column from sidebar to visualizer panel to get its visual summary. Drag another one to update the view
3) Show/Hide columns from table view 
4) Filter by column value. Resulting changes will be reflected in the summary chart

To run locally, clone this directory, `cd` into it, and run `npm start`. Application should be available
on http://localhost:3000/

### Structure
`Container` is top level view. It's responsible for passing data down to individual components 
as well as interacting with a data store (`src/Models/DataManager`). This decouples the state of the 
application from its display logic, meaning that the behavior of each element is completely deterministic. 

On the other side of the equation, `DataManager` provides an abstraction layer over providing the application 
with necessary data as well as processing and responding to user interactions. Currently, it does all 
the data munging from the uploaded file by itself (on the client side), but it should be pretty 
straightforward to hook it up a remote data store. 

All individual components that make up the frontend are located in `src/components` directory. 

`ColumnDefinitionManager` is responsible for displaying column information (such as name) but also 
providing the user with controls to set column's proper data type, show/hide it from the table, as well 
as drag it to the visualizer panel to view the summary.
 
`FileViewer` is responsible for displaying raw data. The actual table rendering is handled by [fixed-data-table-2](https://github.com/schrodinger/fixed-data-table-2),
but `FileViewer` provides filtering capability.
 
`Visualizer` is responsible for displaying whatever data is currently visible given filters applied
to `FileViewer` and the column selected in `ColumnDefinitionManager`. Currently, it only shows a `ColumnChart`
(which is under `src/components/Charts` directory), but can be easily extends to display more. Charts 
are rendered using [recharts](http://recharts.org/) library. As a side note, at first I was going to 
use `d3` for graphing, but it took me so long to make `d3` and `React` work together to get a basic
bar chart to display, that I abandoned that plan and went for an open source charting library.
 
`FileUploader` handles file uploading and parsing of data from csv to json. 

### TODO 
(These are features/necessities that were originally planned for but didn't make it in time)

- Add component tests
- Button to clear visualizer area
- Display more information than just `count`s (`mean`, `median`, `quantile`, etc)
- Add support for exporting data
- Add support for plotting columns against other columns
- Add support for different types of charts (bar, line, etc)
- Reduce unnecessary calculations by memoizing data in `DataManager`
