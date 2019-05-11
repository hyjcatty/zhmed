/**
 * Created by Huang Yuanjie on 2019/5/4.
 */
//----------------------- Here we start creating a grid. -----------------------

//Sets the value of KoolOnLoadCallFunction to the name of the JS function, gridReadyHandler, which is called when the grid is ready to be created.
var jsVars = "KoolOnLoadCallFunction=gridReadyHandler";

var gridApp, gridRoot, dataGrid, collection;
var xhchartclickcallback = null;
var layoutStr = null;
var xhchartkeys = [];
var gridData =null;
var layoutbefore='<KoolGrid><DataGrid id="dg1" selectionMode="singleRow" dragSelectable="false"><columns>';
var layoutafter='</columns> </DataGrid> </KoolGrid>';
var gridApp=null;
function createxhchart(){
    if(layoutStr === null||gridData === null) return;
    KoolGrid.create("grid1", "gridHolder", jsVars, "100%", "100%");
}
function updatexhchartcallback(clickcallback){
    xhchartclickcallback = clickcallback;
}
function updatexhchartcontent(content){
    if(content.length<=0) return;
    var layoutcenter = "";
    for(var i in content[0]){
        layoutcenter = layoutcenter+'<DataGridColumn dataField="'+i+'" textAlign="right"/>';
        xhchartkeys.push(i);
    }
    layoutStr = layoutbefore+layoutcenter+layoutafter;
    gridData = content;
    if(gridApp===null){
        createxhchart();
    }else{
        gridApp.setData(gridData);
    }
}
function xhgridresize(){
    if(gridApp===null) return;
    KoolGrid.resize();
}
function gridReadyHandler(id) {
    gridApp = document.getElementById(id);	// A div object containing a grid
    gridRoot = gridApp.getRoot();			// An object containing data and grid

    gridApp.setLayout(layoutStr);

    gridApp.setData(gridData);
    var selectionChangeHandler = function(event) {
        var rowIndex = event.rowIndex;
        var columnIndex = event.columnIndex;
        if (dataGrid.getSelectionMode() == "singleRow") {
            var rows = dataGrid.getSelectedIndices();
            console.log( gridData[rows[0]][xhchartkeys[0]]);
            if(xhchartclickcallback !== null){
                xhchartclickcallback(gridData[rows[0]][xhchartkeys[0]]);
            }
        }
        else if (dataGrid.getSelectionMode() == "multipleRows") {
            var rows = dataGrid.getSelectedIndices();
            for (var i = 0; i < rows.length; i++) {
                console.log( rows[i]);
            }
        } else {
            var cells = dataGrid.getSelectedCells();
            for (var i = 0; i < cells.length; i++) {
                console.log( cells[i].rowIndex + ":"+ cells[i].columnIndex);
            }
        }
    }
    var menuItemSelectedHandler = function(event) {
        contextMenuHandler(event.getMenuItemCaption());
    }

    var dataCompleteHandler = function(event) {
        dataGrid = gridRoot.getDataGrid();
        dataGrid.addEventListener("change", selectionChangeHandler);
        dataGrid.addEventListener("gridMenuItemSelect", menuItemSelectedHandler);
        collection = gridRoot.getCollection();
    }

    gridRoot.addEventListener("dataComplete", dataCompleteHandler);
}

/*

var layoutStr =
    '<KoolGrid>\
        <DataGrid id="dg1" selectionMode="singleRow" dragSelectable="false">\
            <columns>\
                <DataGridColumn dataField="Region"/>\
                <DataGridColumn dataField="Territory" width="150"/>\
                <DataGridColumn dataField="Territory_Rep" headerText="Territory Rep" width="150"/>\
                <DataGridColumn dataField="Actual" textAlign="right"/>\
                <DataGridColumn dataField="Estimate" textAlign="right"/>\
                <DataGridColumn dataField="Real" textAlign="right"/>\
                <DataGridColumn dataField="Price" textAlign="right"/>\
            </columns>\
        </DataGrid>\
    </KoolGrid>\
    ';

var gridData = [
    {
        "Region": "Southwest",
        "Territory": "Arizona",
        "Territory_Rep": "Arizona",
        "Actual": 38865,
        "Estimate": 40000,
        "Real": 30000,
        "Price": 3001
    },
    {
        "Region": "Southwest",
        "Territory": "Arizona",
        "Territory_Rep": "Arizona",
        "Actual": 29885,
        "Estimate": 30000,
        "Real": 30000,
        "Price": 3002
    },
    {
        "Region": "Southwest",
        "Territory": "Central California",
        "Territory_Rep": "Central California",
        "Actual": 29134,
        "Estimate": 30000,
        "Real": 30000,
        "Price": 3003
    },
    {
        "Region": "Southwest",
        "Territory": "Nevada",
        "Territory_Rep": "Nevada",
        "Actual": 52888,
        "Estimate": 45000,
        "Real": 30000,
        "Price": 3004
    },
    {
        "Region": "Southwest",
        "Territory": "Northern California",
        "Territory_Rep": "Northern California",
        "Actual": 38805,
        "Estimate": 40000,
        "Real": 30000,
        "Price": 3005
    },
    {
        "Region": "Southwest",
        "Territory": "Northern California",
        "Territory_Rep": "Northern California",
        "Actual": 55498,
        "Estimate": 40000,
        "Real": 30000,
        "Price": 3006
    },
    {
        "Region": "Southwest",
        "Territory": "Southern California",
        "Territory_Rep": "Southern California",
        "Actual": 44985,
        "Estimate": 45000,
        "Real": 30000,
        "Price": 3007
    },
    {
        "Region": "Southwest",
        "Territory": "Southern California",
        "Territory_Rep": "Southern California",
        "Actual": 44913,
        "Estimate": 45000,
        "Real": 30000,
        "Price": 3008
    },
    {
        "Region": "Nor",
        "Territory": "Arizona",
        "Territory_Rep": "Arizona",
        "Actual": 38865,
        "Estimate": 40000,
        "Real": 30000,
        "Price": 3009
    },
    {
        "Region": "Nor",
        "Territory": "Arizona",
        "Territory_Rep": "Arizona",
        "Actual": 29885,
        "Estimate": 30000,
        "Real": 30000,
        "Price": 3000
    },
    {
        "Region": "Nor",
        "Territory": "Central California",
        "Territory_Rep": "Central California",
        "Actual": 29134,
        "Estimate": 30000,
        "Real": 30000,
        "Price": 3001
    },
    {
        "Region": "Nor",
        "Territory": "Nevada",
        "Territory_Rep": "Nevada",
        "Actual": 52888,
        "Estimate": 45000,
        "Real": 30000,
        "Price": 3002
    },
    {
        "Region": "Nor",
        "Territory": "Northern California",
        "Territory_Rep": "Northern California",
        "Actual": 38805,
        "Estimate": 40000,
        "Real": 30000,
        "Price": 3003
    },
    {
        "Region": "Nor",
        "Territory": "Northern California",
        "Territory_Rep": "Northern California",
        "Actual": 55498,
        "Estimate": 40000,
        "Real": 30000,
        "Price": 3004
    },
    {
        "Region": "Nor",
        "Territory": "Southern California",
        "Territory_Rep": "Southern California",
        "Actual": 44985,
        "Estimate": 45000,
        "Real": 30000,
        "Price": 3005
    },
    {
        "Region": "Nor",
        "Territory": "Southern California",
        "Territory_Rep": "Southern California",
        "Actual": 44913,
        "Estimate": 45000,
        "Real": 30000,
        "Price": 3006
    },
    {
        "Region": "Southeast",
        "Territory": "Arizona",
        "Territory_Rep": "Arizona",
        "Actual": 38865,
        "Estimate": 40000,
        "Real": 30000,
        "Price": 3007
    },
    {
        "Region": "Southeast",
        "Territory": "Arizona",
        "Territory_Rep": "Arizona",
        "Actual": 29885,
        "Estimate": 30000,
        "Real": 30000,
        "Price": 3008
    },
    {
        "Region": "Southeast",
        "Territory": "Central California",
        "Territory_Rep": "Central California",
        "Actual": 29134,
        "Estimate": 30000,
        "Real": 30000,
        "Price": 3009
    },
    {
        "Region": "Southeast",
        "Territory": "Nevada",
        "Territory_Rep": "Nevada",
        "Actual": 52888,
        "Estimate": 45000,
        "Real": 30000,
        "Price": 3000
    },
    {
        "Region": "Southeast",
        "Territory": "Northern California",
        "Territory_Rep": "Northern California",
        "Actual": 38805,
        "Estimate": 40000,
        "Real": 30000,
        "Price": 3001
    },
    {
        "Region": "Southeast",
        "Territory": "Northern California",
        "Territory_Rep": "Northern California",
        "Actual": 55498,
        "Estimate": 40000,
        "Real": 30000,
        "Price": 3002
    },
    {
        "Region": "Southeast",
        "Territory": "Southern California",
        "Territory_Rep": "Southern California",
        "Actual": 44985,
        "Estimate": 45000,
        "Real": 30000,
        "Price": 3003
    },
    {
        "Region": "Southeast",
        "Territory": "Southern California",
        "Territory_Rep": "Southern California",
        "Actual": 44913,
        "Estimate": 45000,
        "Real": 30000,
        "Price": 3004
    },
    {
        "Region": "Southwest",
        "Territory": "Arizona",
        "Territory_Rep": "Arizona",
        "Actual": 38865,
        "Estimate": 40000,
        "Real": 30000,
        "Price": 3005
    },
    {
        "Region": "Southwest",
        "Territory": "Arizona",
        "Territory_Rep": "Arizona",
        "Actual": 29885,
        "Estimate": 30000,
        "Real": 30000,
        "Price": 3006
    },
    {
        "Region": "Southwest",
        "Territory": "Central California",
        "Territory_Rep": "Central California",
        "Actual": 29134,
        "Estimate": 30000,
        "Real": 30000,
        "Price": 3007
    },
    {
        "Region": "Southwest",
        "Territory": "Nevada",
        "Territory_Rep": "Nevada",
        "Actual": 52888,
        "Estimate": 45000,
        "Real": 30000,
        "Price": 3008
    },
    {
        "Region": "Southwest",
        "Territory": "Northern California",
        "Territory_Rep": "Northern California",
        "Actual": 38805,
        "Estimate": 40000,
        "Real": 30000,
        "Price": 3009
    },
    {
        "Region": "Southwest",
        "Territory": "Northern California",
        "Territory_Rep": "Northern California",
        "Actual": 55498,
        "Estimate": 40000,
        "Real": 30000,
        "Price": 3000
    },
    {
        "Region": "Southwest",
        "Territory": "Southern California",
        "Territory_Rep": "Southern California",
        "Actual": 44985,
        "Estimate": 45000,
        "Real": 30000,
        "Price": 3001
    },
    {
        "Region": "Southwest",
        "Territory": "Southern California",
        "Territory_Rep": "Southern California",
        "Actual": 44913,
        "Estimate": 45000,
        "Real": 30000,
        "Price": 3002
    },
    {
        "Region": "Northwest",
        "Territory": "Arizona",
        "Territory_Rep": "Arizona",
        "Actual": 38865,
        "Estimate": 40000,
        "Real": 30000,
        "Price": 3003
    },
    {
        "Region": "Northwest",
        "Territory": "Arizona",
        "Territory_Rep": "Arizona",
        "Actual": 29885,
        "Estimate": 30000,
        "Real": 30000,
        "Price": 3004
    },
    {
        "Region": "Northwest",
        "Territory": "Central California",
        "Territory_Rep": "Central California",
        "Actual": 29134,
        "Estimate": 30000,
        "Real": 30000,
        "Price": 3005
    },
    {
        "Region": "Northwest",
        "Territory": "Nevada",
        "Territory_Rep": "Nevada",
        "Actual": 52888,
        "Estimate": 45000,
        "Real": 30000,
        "Price": 3006
    },
    {
        "Region": "Northwest",
        "Territory": "Northern California",
        "Territory_Rep": "Northern California",
        "Actual": 38805,
        "Estimate": 40000,
        "Real": 30000,
        "Price": 3007
    },
    {
        "Region": "Northwest",
        "Territory": "Northern California",
        "Territory_Rep": "Northern California",
        "Actual": 55498,
        "Estimate": 40000,
        "Real": 30000,
        "Price": 3008
    },
    {
        "Region": "Northwest",
        "Territory": "Southern California",
        "Territory_Rep": "Southern California",
        "Actual": 44985,
        "Estimate": 45000,
        "Real": 30000,
        "Price": 3009
    }
];
*/