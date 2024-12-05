import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ModuleRegistry } from '@ag-grid-community/core';
import { AgGridReact } from '@ag-grid-community/react';
import { useEffect, useState } from 'react';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

// Create new GridExample component
export const DataTables = () => {
    // Row Data: The data to be displayed.
    const [rowData, setRowData] = useState([]);

    // Column Definitions: Defines & controls grid columns.
    const [colDefs] = useState([
        { field: 'mission' },
        { field: 'company' },
        { field: 'location' },
        { field: 'date' },
        { field: 'price' },
        { field: 'successful' },
        { field: 'rocket' },
    ]);

    // Fetch data & update rowData state
    useEffect(() => {
        fetch('https://www.ag-grid.com/example-assets/space-mission-data.json') // Fetch data from server
            .then((result) => result.json()) // Convert to JSON
            .then((rowData) => setRowData(rowData)); // Update state of `rowData`
    }, []);

    // Container: Defines the grid's theme & dimensions.
    return (
        <div
            className={
                "ag-theme-quartz-dark"
            }
            style={{ width: '100%', height: '85%' }}
        >
            <AgGridReact rowData={rowData} columnDefs={colDefs} />
        </div>
    );
};