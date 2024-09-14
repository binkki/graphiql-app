import { Dispatch, InputHTMLAttributes, SetStateAction } from "react";

export interface EndpointUrlProps
  extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  setEndpointUrl: Dispatch<SetStateAction<string>>;
  value?: string;
}

export interface MethodSelectorProps
  extends InputHTMLAttributes<HTMLSelectElement> {
  id: string;
  methods: string[];
  setMethod: Dispatch<SetStateAction<string>>;
  value?: string;
}

export interface HeadersProps {
  id: string;
  headers: RequestHeader[];
  setHeader: Dispatch<SetStateAction<RequestHeader[]>>;
}

export type RequestHeader = {
  key: string;
  value: string;
};

export interface CodeEditorProps {
  language: string;
  readonly: boolean;
  value: string;
  id: string;
  setRequestBody?: Dispatch<SetStateAction<string>>;
}

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

export type LoaderData = {
  url: string;
  locale: string;
};

export type RestfulClientProps = {
  method: string;
  endpointUrl: string;
  body: string;
  headers: RequestHeader[];
};
