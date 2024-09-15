import { Dispatch, SetStateAction } from "react";

export interface ClientProps {
  id: string;
  request: RestfulRequestProps;
  setRequest: Dispatch<SetStateAction<RestfulRequestProps>>;
}

export type RestfulMethodProps = {
  id: string;
  methods: string[];
  setMethod: Dispatch<SetStateAction<string>>;
  defaultValue: string;
};

export type RestfulEndpointProps = {
  id: string;
  setEndpointUrl: Dispatch<SetStateAction<string>>;
  defaultValue: string;
};

export type CodeEditorProps = {
  language: string;
  readonly: boolean;
  value: string;
  id: string;
  setRequestBody?: Dispatch<SetStateAction<string>>;
};

export type RequestHeader = {
  key: string;
  value: string;
};

export type RequestBody = {
  method: string;
  headers: Headers;
  body?: string | undefined;
};

export type HeaderItemProps = {
  index: number;
  headerKey: string;
  headerValue: string;
  addHeader: (index: number, key: string, value: string) => void;
  deleteHeader: (index: number) => void;
};

export type FormField = {
  value: string;
};

export type EditedUrlProps = {
  id: string;
  url: string;
};

export type RestfulResponseProps = {
  status: string;
  body: string;
};

export type RestfulRequestProps = {
  method: string;
  endpointUrl: string;
  headers: RequestHeader[];
  body: string;
};

export type RestfulClientErrors = {
  methodError: string;
  endpointUrlError: string;
  bodyError: string;
};

export type RestfulClientProps = {
  restfulRequest?: RestfulRequestProps;
  restfulResponse?: RestfulResponseProps;
};
