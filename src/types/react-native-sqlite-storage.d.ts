declare module 'react-native-sqlite-storage' {
  export interface DBConnection {
    transaction(
      callback: (tx: Transaction) => void,
      errorCallback?: (error: any) => void,
      successCallback?: () => void,
    ): void;
    executeSql(
      statement: string,
      params?: any[],
      successCallback?: (results: ResultSet) => void,
      errorCallback?: (error: any) => void,
    ): Promise<[ResultSet]>;
    close(): Promise<void>;
  }

  export interface Transaction {
    executeSql(
      statement: string,
      params?: any[],
      successCallback?: (tx: Transaction, results: ResultSet) => void,
      errorCallback?: (tx: Transaction, error: any) => void,
    ): void;
  }

  export interface ResultSet {
    rows: {
      length: number;
      item(index: number): any;
      raw(): any[];
    };
    rowsAffected: number;
    insertId: number;
  }

  export type SQLiteDatabase = DBConnection;

  export function openDatabase(
    params: {
      name: string;
      location?: string;
      createFromLocation?: string | number;
    },
    successCallback?: () => void,
    errorCallback?: (error: any) => void,
  ): Promise<DBConnection>;

  export function enablePromise(enable: boolean): void;
}
