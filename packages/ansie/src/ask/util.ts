export interface AskOptions {
    format: 'ansie' | 'plain';
    theme: string;
    default: string;
    typeOptions:
        | {
              type: 'select';
              choices: string[];
          }
        | {
              type: 'text';
              multiline: boolean;
          }
        | {
              type: 'password';
              mask?: string;
          }
        | {
              type: 'confirm';
              isContinue: boolean;
              trueValue: string;
              falseValue: string;
          };
}
