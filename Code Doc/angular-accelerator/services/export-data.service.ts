// @ts-nocheck
// @ts-ignore

import { Inject, Injectable, LOCALE_ID } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { firstValueFrom, map, Observable, of } from "rxjs";
import { DateUtils } from "@onecx/angular-accelerator";
import { ObjectUtils } from "@onecx/angular-accelerator";
import { ColumnType } from "@onecx/angular-accelerator";

@Injectable({ providedIn: "any" })
export class ExportDataService {
  constructor(
    private dateUtils: DateUtils,
    private translateService: TranslateService,
    @Inject(LOCALE_ID) private locale: string
  ) {}


  // ************************************************************************************************************************************************************************************************************************************
  // ************************************************************************************************************************************************************************************************************************************

  async exportCsv<T extends string | number | symbol>(
    columns: { id: string; nameKey: string; columnType: ColumnType }[],
    data: Partial<Record<T, unknown | undefined>>[],
    fileName: string
  ): Promise<void> {
    if (!columns.length) {
      return;
    }
    // Flatten the data to ensure all nested fields are resolved before translation and formatting
    const flattenedData = data.map((d) =>
      columns.reduce(
        (obj, c) => ({ ...obj, [c.id]: ObjectUtils.resolveFieldData(d, c.id) }),
        {}
      )
    );

    const translatedData = await firstValueFrom(
      this.translateData(columns, flattenedData)
    );

    const dataToExport = this.formatData(columns, translatedData);

    // en US => , 
    // de DE => ;
    const delimiter = this.locale.startsWith("de") ? ";" : ",";

    const dataString = dataToExport
      .map((d) =>
        columns
          .reduce((arr: unknown[], c) => [...arr, d[c.id]], [])
          .map((d) => this.escapeDelimiterAndLineBreaks(delimiter, d))
          .join(delimiter)
      )
      .join("\r\n");
      //dataString = "T-101,Fix login bug,Open,Alice,13/09/2023,7.5\r\nT-102,Write tests,Done,Bob,14/09/2023,3"


    const headerString = (
      await firstValueFrom(this.translateColumnNames(columns))
    )
      .map((c) => c.name)
      .map((c) => this.escapeDelimiterAndLineBreaks(delimiter, c))
      .join(delimiter);

    const csvString = headerString + "\r\n" + dataString;

    // Create Blob and trigger download  ==>  A Blob is a browser object that represents: “A chunk of binary data that behaves like a file  ==> virtual file in memory ==> Blob converts text → file-like object
    const blob = new Blob(["\ufeff" + csvString], {
      type: "text/csv;charset=utf-8;",
    });

    // Create a link and trigger download
    const dwldLink = document.createElement("a");
    const url = URL.createObjectURL(blob);

    // For Firefox it is necessary to delay revoking the ObjectURL
    dwldLink.setAttribute("href", url);

    // Set the file name
    dwldLink.setAttribute("download", fileName);

    // triggering the function
    dwldLink.click();
  }


  // ************************************************************************************************************************************************************************************************************************************
  // ************************************************************************************************************************************************************************************************************************************
  

  private translateColumnNames(
    columns: { id: string; nameKey: string; columnType: ColumnType }[]
  ): Observable<{ id: string; name: string; columnType: ColumnType }[]> {
    return this.translateService
      .get(columns.map((c) => c.nameKey))
      .pipe(
        map((translations) =>
          columns.map((c) => ({ ...c, name: translations[c.nameKey] }))
        )
      );
  }

  // ************************************************************************************************************************************************************************************************************************************
  // ************************************************************************************************************************************************************************************************************************************

  // date formatting according to locale
  private formatData(
    columns: { id: string; nameKey: string; columnType: ColumnType }[],
    data: Record<string, unknown>[]
  ): { [columnId: string]: unknown }[] {
    return data.map((d) =>
      columns.reduce((obj, c) => {
        if (
          c.columnType === ColumnType.DATE ||
          c.columnType === ColumnType.RELATIVE_DATE
        ) {
          return {
            ...obj,
            [c.id]: this.dateUtils.localizedDate(
              d[c.id] ? String(d[c.id]) : undefined
            ),
          };
        }
        return { ...obj, [c.id]: d[c.id] };
      }, {})
    );
  }

  // ************************************************************************************************************************************************************************************************************************************
  // ************************************************************************************************************************************************************************************************************************************


  // Translate the data based on translation keys present in the columns
  private translateData(
    columns: { id: string; nameKey: string; columnType: ColumnType }[],
    data: Record<string, unknown>[]
  ): Observable<{ [columnId: string]: unknown }[]> {

    // empty array that will hold all translation keys found in data.
    let translationKeys: string[] = [];
    // Filter columns that are of type TRANSLATION_KEY
    const translatedColumns = columns.filter(
      (c) => c.columnType === ColumnType.TRANSLATION_KEY
    );

    // Collect all translation keys from the data for the relevant columns
    // ...data.map((i) => i[c.id]?.toString() ?? '') => For each data item, get the value for the column id, convert to string, if undefined use empty string and spred into individual elements
    translatedColumns.forEach((c) => {
      translationKeys = [
        ...translationKeys,
        ...data.map((i) => i[c.id]?.toString() ?? ""),
      ];
    });

    // What translateService.get(...) does Input:
    // ['SOME_STATUS', 'STATUS_EXAMPLE']
    // Output (later used in map):
    // {
    //   'SOME_STATUS': 'Some Translated Status',
    //   'STATUS_EXAMPLE': 'Status Example Translated'
    // }
    translationKeys = Array.from(new Set(translationKeys)); // Remove duplicates
    if (translationKeys.length) {
      return this.translateService.get(translationKeys).pipe(
        map((translatedValues: Record<string, string>) => {
          return data.map((d) =>
            columns.reduce(
              (obj, c) => ({
                ...obj,
                [c.id]:
                  c.columnType === ColumnType.TRANSLATION_KEY
                    ? translatedValues[String(d[c.id])]
                    : d[c.id],
              }),
              {}
            )
          );
        })
      );
    }
    // Example
    // Input:
    // data = [
    //   { status: 'SOME_STATUS', name: 'Item 1' },
    //   { status: 'STATUS_EXAMPLE', name: 'Item 2' }
    // ]
    // Output:
    // { status: 'SOME_STATUS', name: 'Item 1' },
    // { status: 'STATUS_EXAMPLE', name: 'Item 2' }
    return of(data);
  }

  // ************************************************************************************************************************************************************************************************************************************
  // ************************************************************************************************************************************************************************************************************************************

  // Escape delimiters and line breaks in CSV data  
  private escapeDelimiterAndLineBreaks(delimiter: ";" | ",", data: unknown) {
    if (data === null || data === undefined) {
      return data;
    }

    let str = String(data);

    // Because CSV uses " to wrap values. If the value itself contains ", it needs to be escaped.
    if (str.includes('"')) {
      str = str.replaceAll('"', '""');
    }

    // Enclose the string in double quotes if it contains delimiters or line breaks
    if (str.includes(delimiter) || str.includes("\n") || str.includes("\r")) {
      str = `"${str}"`;
    }
    return str;
  }
}
// END OF EXPORTDATASERVICE CLASS
// ************************************************************************************************************************************************************************************************************************************
// ************************************************************************************************************************************************************************************************************************************





export enum ColumnType {
  STRING = "STRING",
  NUMBER = "NUMBER",
  DATE = "DATE",
  RELATIVE_DATE = "RELATIVE_DATE",
  TRANSLATION_KEY = "TRANSLATION_KEY",
}




/*
Example Usage:
*/

// columns :
const columns = [
  {
    id: 'id',
    nameKey: 'COLUMN.ID',
    columnType: ColumnType.STRING,
  },
  {
    id: 'title',
    nameKey: 'COLUMN.TITLE',
    columnType: ColumnType.STRING,
  },
  {
    id: 'status',
    nameKey: 'COLUMN.STATUS',
    columnType: ColumnType.TRANSLATION_KEY,
  },
  {
    id: 'meta.createdBy.name',
    nameKey: 'COLUMN.CREATED_BY',
    columnType: ColumnType.STRING,
  },
  {
    id: 'meta.dates.startDate',
    nameKey: 'COLUMN.START_DATE',
    columnType: ColumnType.DATE,
  },
  {
    id: 'effortHours',
    nameKey: 'COLUMN.EFFORT',
    columnType: ColumnType.NUMBER,
  },
]

// data :
const data = [
  {
    id: 'T-101',
    title: 'Fix login bug',
    status: 'STATUS_OPEN',
    priority: 1,
    meta: {
      createdBy: { name: 'Alice', id: 'U-1' },
      dates: { startDate: '2023-09-13T09:34:05Z' },
    },
    effortHours: 7.5,
    active: true,
  },
  {
    id: 'T-102',
    title: 'Write unit tests',
    status: 'STATUS_DONE',
    priority: 2,
    meta: {
      createdBy: { name: 'Bob', id: 'U-2' },
      dates: { startDate: '2023-09-14T10:00:00Z' },
    },
    effortHours: 3,
    active: false,
  },
  {
    id: 'T-103',
    title: 'Refactor auth module',
    status: 'STATUS_IN_PROGRESS',
    priority: 3,
    meta: {
      createdBy: { name: 'Charlie', id: 'U-3' },
      dates: { startDate: '2023-09-15T08:15:00Z' },
    },
    effortHours: 12.25,
    active: true,
  },
  {
    id: 'T-104',
    title: 'Update documentation',
    status: 'STATUS_OPEN',
    priority: 4,
    meta: {
      createdBy: { name: 'Diana', id: 'U-4' },
      dates: { startDate: undefined },
    },
    effortHours: 2,
    active: true,
  },
  {
    id: 'T-105',
    title: 'Release build v1.2',
    status: 'STATUS_DONE',
    priority: 1,
    meta: {
      createdBy: { name: 'Evan', id: 'U-5' },
      dates: { startDate: '2023-09-18T18:45:00Z' },
    },
    effortHours: 5,
    active: false,
  },
  {
    id: 'T-106',
    title: 'Investigate prod issue',
    status: 'STATUS_BLOCKED',
    priority: 1,
    meta: {
      createdBy: { name: 'Fatima', id: 'U-6' },
      dates: { startDate: '2023-09-19T06:30:00Z' },
    },
    effortHours: 9,
    active: true,
  },
  {
    id: 'T-107',
    title: 'Optimize DB queries',
    status: 'STATUS_IN_PROGRESS',
    priority: 2,
    meta: {
      createdBy: { name: 'George', id: 'U-7' },
      dates: { startDate: '2023-09-20T11:20:00Z' },
    },
    effortHours: 14,
    active: true,
  },
]

//
fileName: 'exported_data.csv'


// flattenedData :
// 8 rows flattened
// nested fields resolved
// extra backend fields removed
flattenedData = [
  {
    id: 'T-101',
    title: 'Fix login bug',
    status: 'STATUS_OPEN',
    'meta.createdBy.name': 'Alice',
    'meta.dates.startDate': '2023-09-13T09:34:05Z',
    effortHours: 7.5,
  },
  {
    id: 'T-102',
    title: 'Write unit tests',
    status: 'STATUS_DONE',
    'meta.createdBy.name': 'Bob',
    'meta.dates.startDate': '2023-09-14T10:00:00Z',
    effortHours: 3,
  },
  {
    id: 'T-103',
    title: 'Refactor auth module',
    status: 'STATUS_IN_PROGRESS',
    'meta.createdBy.name': 'Charlie',
    'meta.dates.startDate': '2023-09-15T08:15:00Z',
    effortHours: 12.25,
  },
  {
    id: 'T-104',
    title: 'Update documentation',
    status: 'STATUS_OPEN',
    'meta.createdBy.name': 'Diana',
    'meta.dates.startDate': undefined,
    effortHours: 2,
  },
  {
    id: 'T-105',
    title: 'Release build v1.2',
    status: 'STATUS_DONE',
    'meta.createdBy.name': 'Evan',
    'meta.dates.startDate': '2023-09-18T18:45:00Z',
    effortHours: 5,
  },
  {
    id: 'T-106',
    title: 'Investigate prod issue',
    status: 'STATUS_BLOCKED',
    'meta.createdBy.name': 'Fatima',
    'meta.dates.startDate': '2023-09-19T06:30:00Z',
    effortHours: 9,
  },
  {
    id: 'T-107',
    title: 'Optimize DB queries',
    status: 'STATUS_IN_PROGRESS',
    'meta.createdBy.name': 'George',
    'meta.dates.startDate': '2023-09-20T11:20:00Z',
    effortHours: 14,
  },
]



// translatedData :
// keys collected from data and translated
[
  'STATUS_OPEN',
  'STATUS_DONE',
  'STATUS_IN_PROGRESS',
  'STATUS_BLOCKED'
]

// Translations fetched :
{
  STATUS_OPEN: 'Open',
  STATUS_DONE: 'Done',
  STATUS_IN_PROGRESS: 'In progress',
  STATUS_BLOCKED: 'Blocked'
}
// status values replaced in all 8 rows
// Assuming the following translations:
{
  id: 'T-106',
  title: 'Fix CSV bug',
  status: 'Blocked',
  'meta.createdBy.name': 'Farah',
  'meta.dates.startDate': '2023-09-17T14:15:00Z',
  effortHours: 4
}




// data formatted according to locale :
/*
[
  { id: 'T-101', title: 'Fix login bug', status: 'Open',        createdBy: 'Alice',   startDate: '13/09/2023', effort: 7.5 },
  { id: 'T-102', title: 'Write unit tests', status: 'Done',    createdBy: 'Bob',     startDate: '14/09/2023', effort: 3 },
  { id: 'T-103', title: 'Refactor auth module', status: 'In Progress', createdBy: 'Charlie', startDate: '15/09/2023', effort: 12.25 },
  { id: 'T-104', title: 'Update documentation', status: 'Open', createdBy: 'Diana',  startDate: '', effort: 2 },
  { id: 'T-105', title: 'Release build v1.2', status: 'Done',  createdBy: 'Evan',    startDate: '18/09/2023', effort: 5 },
  { id: 'T-106', title: 'Investigate prod issue', status: 'Blocked', createdBy: 'Fatima', startDate: '19/09/2023', effort: 9 },
  { id: 'T-107', title: 'Optimize DB queries', status: 'In Progress', createdBy: 'George', startDate: '20/09/2023', effort: 14 },
]
*/


//dates formatted as per locale (en-GB) DD/MM/YYYY
// {
//   id: 'T-104',
//   title: 'Update docs',
//   status: 'Done',
//   'meta.createdBy.name': 'Diana',
//   'meta.dates.startDate': '',
//   effortHours: 2.5
// }


/*
// CSV String :
ID,Title,Status,Created By,Start Date,Effort
T-101,Fix login bug,Open,Alice,13/09/2023,7.5
T-102,Write unit tests,Done,Bob,14/09/2023,3
T-103,Refactor auth module,In Progress,Charlie,15/09/2023,12.25
T-104,Update documentation,Open,Diana,,2
T-105,Release build v1.2,Done,Evan,18/09/2023,5
T-106,Investigate prod issue,Blocked,Fatima,19/09/2023,9
T-107,Optimize DB queries,In Progress,George,20/09/2023,14

*/




/*
2.1 What is a Blob?
A Blob is a browser object that represents:
“A chunk of binary data that behaves like a file”
Think of it as:
an in-memory file
not saved on disk yet
browser knows its type

Mental model
Blob = virtual file in memory

2.2 Why do we create a Blob here?
Because:
Browsers can only download files
CSV text (string) is not a file
Blob converts text → file-like object

Without a Blob:
❌ No download possible

2.3 What is inside the Blob?
['\ufeff' + csvString]
This is an array with ONE string element.
The important part is:
'\ufeff'

2.4 What is \ufeff? (THIS IS CRITICAL)
\ufeff is the UTF-8 BOM (Byte Order Mark).
Why it exists
Excel (especially Windows Excel): is bad at detecting UTF-8
often opens CSV as ANSI breaks: accented characters, umlauts, non-English text

Example without BOM ❌
CSV content:
Name
Jürgen
Excel shows:
JÃ¼rgen

Example with BOM ✅
CSV content starts with:
\ufeffName
Jürgen
Excel shows:
Jürgen

So this part:
'\ufeff' + csvString

means:
“Add a UTF-8 marker at the very start of the file so Excel knows how to read it.”


Why type: 'text/csv;charset=utf-8;'
type: 'text/csv;charset=utf-8;'

This tells the browser:
This file is CSV
Encoding is UTF-8

This helps:
browsers
OS
Excel





Create the download link (browser trick)
const downloadLink = document.createElement('a')

Why an <a> tag?
Browsers only allow downloads via:
clicking a link
or simulating a click
There is no downloadFile() API.
So the trick is:
Create a hidden anchor (<a>) and click it programmatically.


Create a URL for the Blob
const url = URL.createObjectURL(blob)
4.1 What this does
It converts the Blob into a temporary URL, like:
blob:http://localhost:4200/9c8a3e4f-...
This URL:
points to the in-memory file is valid only in this browser session
Why this is needed
<a href="..."> requires a URL.
Blob itself is not a URL.


Attach URL to the link
downloadLink.setAttribute('href', url)
Now the anchor points to the CSV file.
Equivalent HTML
<a href="blob:..." />

Set the download filename
downloadLink.setAttribute('download', fileName)
What this does
Tells the browser:
“When downloading, save the file with this name.”
Without this:
browser uses random name
or opens the file instead of downloading

Example
fileName = 'report.csv'


Trigger the download
downloadLink.click()
*/