import type {
    NextComponentType,
    NextPageContext,
    NextLayoutComponentType,
    NextPage
  } from 'next';
  import type { AppProps } from 'next/app';
  
  declare module 'next' {
    type NextLayoutComponentType<P = {}> = NextComponentType<
      NextPageContext,
      any,
      P
    > & {
      getLayout?: (page: ReactElement) =>ReactElement;
    };
  }
  
  declare module 'next/app' {
    type AppLayoutProps<P = {}> = AppProps & {
      Component: NextLayoutComponentType;
    };
  }