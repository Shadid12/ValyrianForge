import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ModuleRegistry } from '@ag-grid-community/core';
import { AgGridReact } from '@ag-grid-community/react';
import { useEffect, useState } from 'react';

interface Column {
  name: string;
  type: string;
}

interface CollectionDetails {
  table_name: string;
  columns: Column[];
}

interface DataTablesProps {
  collectionDetails: CollectionDetails | null;
  isQuery: boolean;
  prompt: string;
  data: any;
  isLoading: boolean;
  error: any;
}

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export const DataTables: React.FC<DataTablesProps> = ({ collectionDetails, data, isLoading, error }) => {
  const [rowData, setRowData] = useState<any[]>([]);
  const [colDefs, setColDefs] = useState<any[]>([]);

  // Update columns based on collectionDetails
  useEffect(() => {
    if (collectionDetails?.columns) {
      const dynamicColDefs = collectionDetails.columns.map((column) => ({
        field: column.name,
        headerName: column.name.charAt(0).toUpperCase() + column.name.slice(1),
        sortable: true,
        filter: true,
      }));
      setColDefs(dynamicColDefs);
    }
  }, [collectionDetails]);

  // Update row data based on the fetched results
  useEffect(() => {
    if (data?.data) {
      setRowData(data.data);
    }
  }, [data]);

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