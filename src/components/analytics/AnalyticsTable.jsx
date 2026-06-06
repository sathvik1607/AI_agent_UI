import { memo } from 'react';

/**
 * Renders structured query output as a data table.
 *
 * Receives column names and row data from the Analytics Engine response
 * (analysis.output_columns and analysis.output_data) and maps them into an
 * HTML table. Missing cell values fall back to 'N/A'.
 *
 * memo'd because the table data (columns + rows) is stable after the API
 * response is stored in the conversation — it won't change between renders.
 *
 * @param {{
 *   outputTitle?: string,
 *   outputColumns: string[],
 *   outputData: Record<string, string>[],
 * }} props
 */
const AnalyticsTable = memo(({ outputTitle, outputColumns, outputData }) => (
  <div
    style={{
      overflowX: 'auto',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      backgroundColor: 'var(--bg-dark)',
    }}
  >
    {outputTitle && (
      <div
        style={{
          padding: '1rem',
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--card-bg)',
          fontWeight: 600,
          fontSize: '0.95rem',
          color: 'var(--text-main)',
        }}
      >
        {outputTitle}
      </div>
    )}

    <table
      className="markdown-body"
      style={{ margin: 0, border: 'none', width: '100%', borderCollapse: 'collapse' }}
    >
      <thead>
        <tr>
          {outputColumns.map((columnName, index) => (
            <th
              key={index}
              style={{
                padding: '0.75rem 1rem',
                textAlign: 'left',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderBottom: '2px solid var(--border)',
                color: 'var(--text-secondary)',
                fontWeight: 500,
                fontSize: '0.85rem',
              }}
            >
              {columnName}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {outputData.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            style={{
              borderBottom:
                rowIndex === outputData.length - 1 ? 'none' : '1px solid var(--border)',
            }}
          >
            {outputColumns.map((columnName, colIndex) => (
              <td
                key={colIndex}
                style={{
                  padding: '0.875rem 1rem',
                  fontSize: '0.9rem',
                  color: 'var(--text-main)',
                  border: 'none',
                }}
              >
                {row[columnName] ?? 'N/A'}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
));

AnalyticsTable.displayName = 'AnalyticsTable';
export default AnalyticsTable;
