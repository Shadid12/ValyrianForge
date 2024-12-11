import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ModuleRegistry } from '@ag-grid-community/core';
import { AgGridReact } from '@ag-grid-community/react';
import { useEffect, useState } from 'react';
import { useGetRecords } from "../hooks/useGetRecords";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

// Create new GridExample component
export const DataTables = ({ collectionDetails }) => {
    // State for row data
    const [rowData, setRowData] = useState([]);
    
    // State for column definitions
    const [colDefs, setColDefs] = useState([]);

    // Fetch data from useGetRecords hook
    const { data, error, isLoading } = useGetRecords(collectionDetails?.table_name);

    // Update column definitions dynamically based on collectionDetails
    useEffect(() => {
        if (collectionDetails?.columns) {
            const dynamicColDefs = collectionDetails.columns.map((column) => ({
                field: column.name,
                headerName: column.name.charAt(0).toUpperCase() + column.name.slice(1), // Capitalize header names
                sortable: true, // Enable sorting
                filter: true,  // Enable filtering
            }));
            setColDefs(dynamicColDefs);
        }
    }, [collectionDetails]);

    // Update row data when fetched
    useEffect(() => {
        if (data?.data) {
            setRowData(data.data);
        }
    }, [data]);

    // Container: Defines the grid's theme & dimensions
    return (
        <div
            className={"ag-theme-quartz-dark"}
            style={{ width: '100%', height: '85%' }}
        >
            {error && <p>Error fetching data: {error.message}</p>}
            {isLoading && <p>Loading data...</p>}
            <AgGridReact 
                rowData={rowData} 
                columnDefs={colDefs} 
                animateRows={true} // Enables row animations
                pagination={true} // Enable pagination
            />
        </div>
    );
};