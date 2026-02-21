import React from 'react';

type chartType = {
  data: string[][];
  index: number;
  length: number;
};

type tableArrayType = {
  data: React.ReactElement;
  index: number;
  length: number;
} | undefined;

const filterChartData = (content: string, matches: RegExpMatchArray) => {
  const filtered: chartType[] | undefined = [];
  for (let row of matches) {
    try {
      const parsed = JSON.parse(row.replace(/['"]/g, '"'));
      if (
        Array.isArray(parsed) &&
        parsed.length >= 2 &&
        parsed.every((row) => Array.isArray(row))
      ) {
        filtered.push({
          data: parsed,
          index: content.indexOf(row),
          length: row.length,
        });
      }
    } catch (e) {
      continue;
    }
  }
  return filtered;
};

const makeTableData = (filteredArray: chartType[]): tableArrayType[] => {
  let tableArray: tableArrayType[] = [];

  for (let c = 0; c < filteredArray.length; c++) {
    const chart = filteredArray[c];
    if (chart) {
      const { data, index, length } = chart;
      const headerRowspanCnt = Array.from({ length: data[0].length }, () => 0);

      for (let i = 0; i < data[0].length; i++) {
        const head = data[0][i];
        if (head === '') {
          let prevIdx = i;
          for (let j = i - 1; j >= 0; j--) {
            if (data[0][j] !== '') {
              prevIdx = j;
              break;
            }
          }
          if (prevIdx !== i) headerRowspanCnt[prevIdx] += 1;
        } else {
          headerRowspanCnt[i] += 1;
        }
      }

      const header = [];
      for (let i = 0; i < data[0].length; i++) {
        const thData = data[0][i];
        if (thData === '') continue;
        header.push(
          <th
            key={`${thData.slice(1, 3)}_${i}`}
            colSpan={headerRowspanCnt[i]}
            className="border border-gray-300 bg-gray-100 p-2 text-xs text-center"
          >
            {thData.replaceAll('\n', ' ').trim()}
          </th>
        );
      }

      const bodyRows = [];
      for (let i = 1; i < data.length; i++) {
        const row = [];
        for (let j = 0; j < data[i].length; j++) {
          row.push(
            <td
              key={`${data[i][j].slice(1, 3)}_${j}`}
              className="border border-gray-300 p-2 text-xs text-center"
            >
              {data[i][j].replaceAll('\n', ' ').trim()}
            </td>
          );
        }
        bodyRows.push(<tr key={i}>{row}</tr>);
      }

      tableArray.push({
        data: (
          <table
            key={`table_${c}`}
            className="w-full border border-gray-400 border-collapse my-3 text-xs"
          >
            <thead key={`th_${c}`}>
              <tr>{header}</tr>
            </thead>
            <tbody key={`tb_${c}`}>{bodyRows}</tbody>
          </table>
        ),
        index: index,
        length: length,
      });
    }
  }
  return tableArray;
};

const makeTableArray = (
  content: string,
  tableData: tableArrayType[]
): (string | React.ReactNode)[] => {
  const result: (string | React.ReactNode)[] = [];
  if (tableData[0] == null) return result;
  result.push(content.slice(0, tableData[0].index));
  for (let j = 0; j < tableData.length; j++) {
    const item = tableData[j];
    if (item == null) continue;
    const { data, index, length } = item;
    const nextIdx =
      j < tableData.length - 1 ? tableData[j + 1]?.index ?? content.length : content.length;
    result.push(data);
    result.push(content.slice(index + length + 1, nextIdx));
  }
  return result;
};

export function transStringToChartData(content: string) {
  const matches = content.match(/\[\[.*?\]\]/g);
  if (!matches) return content;
  const filtered = filterChartData(content, matches);
  const tableData = makeTableData(filtered);
  if (tableData.length) return makeTableArray(content, tableData);
  return content;
}
